import { NextResponse, type NextMiddleware, type NextRequest } from 'next/server'
import * as Sentry from '@sentry/nextjs'
import * as jwt from 'jsonwebtoken'
import { encode, getToken, type JWT } from 'next-auth/jwt'
import authApiRequest from '@/apiRequests/auth.api'
import envServerConfig from '@/config/env.server'
import customerApiRequest from '@/apiRequests/customer.api'

export const SIGNIN_SUB_URL = '/api/auth/signin'
export const SESSION_TIMEOUT = 60 * 60 * 24 * 7 // 7 days
export const TOKEN_REFRESH_BUFFER_SECONDS = 3
// 60 * 5 // 5 minutes
export const SESSION_SECURE = process.env.NEXTAUTH_URL?.startsWith('https://')
export const SESSION_COOKIE = SESSION_SECURE ? '__Secure-next-auth.session-token' : 'next-auth.session-token'
let isRefreshing = false

export function shouldUpdateToken(accessToken: string): boolean {
  const timeInSeconds = Math.floor(Date.now() / 1000)
  const { exp } = jwt.decode(accessToken) as { exp: number } // seconds
  return timeInSeconds >= exp - TOKEN_REFRESH_BUFFER_SECONDS
}

export async function refreshAccessToken(token: JWT): Promise<JWT> {
  if (isRefreshing) {
    return token
  }
  try {
    if (token.account) {
      const response = await authApiRequest.refreshToken(token.refreshToken)
      const { data: newSession } = response
      return newSession
    } else if (token.customer) {
      const response = await customerApiRequest.refreshToken(token.refreshToken)
      const { data: newSession } = response
      return newSession
    }
    return token
  } catch (e: any) {
    console.error(e)
    Sentry.captureException(e)
    return token
  } finally {
    isRefreshing = false
  }
}

export function updateCookie(
  sessionToken: string | null,
  request: NextRequest,
  response: NextResponse,
  maxAge?: number
): NextResponse<unknown> {
  /*
   * BASIC IDEA:
   *
   * 1. Set request cookies for the incoming getServerSession to read new session
   * 2. Updated request cookie can only be passed to server if it's passed down here after setting its updates
   * 3. Set response cookies to send back to browser
   */

  if (sessionToken && sessionToken !== null && maxAge) {
    request?.cookies?.set(SESSION_COOKIE, sessionToken)
    response = NextResponse.next({
      request: {
        headers: request?.headers
      }
    })
    response?.cookies?.set(SESSION_COOKIE, sessionToken, {
      httpOnly: true,
      maxAge,
      secure: SESSION_SECURE,
      sameSite: 'lax'
    })
  } else {
    return NextResponse.redirect(new URL('/logout', request?.url))
    // request?.cookies?.delete(SESSION_COOKIE)
    // setTimeout(() => {
    //   response = NextResponse.redirect(new URL(SIGNIN_SUB_URL, request?.url))
    //   return response
    // }, 300)
  }
  return response
}

const employeeBasePaths = ['/dashboard']
const customerBasePaths = ['/customer']

export const config = {
  matcher: ['/dashboard/:path*', '/customer/:path*']
}

export const middleware: NextMiddleware = async (request: NextRequest) => {
  // if (request.nextUrl.toString().includes('/api/auth/signin?error=OAuthCallback')) {
  //   return NextResponse.redirect(new URL(envServerConfig.NEXTAUTH_URL))
  // }

  const token = await getToken({ req: request })

  const pathname = request?.nextUrl?.pathname

  const isAuthenticated = !!token

  const isEmployee = !!token?.account
  const isEmployeePage = employeeBasePaths.some((path) => pathname.startsWith(path))

  const isCustomer = !!token?.customer
  const isCustomerPage = customerBasePaths.some((path) => pathname.startsWith(path))

  if (!isAuthenticated && (isCustomerPage || isEmployeePage)) {
    return NextResponse.redirect(new URL('/login', request?.url))
  }

  if ((!isCustomer && isCustomerPage) || (!isEmployee && isEmployeePage)) {
    return NextResponse.redirect(new URL('/', request?.url))
  }

  let response = NextResponse.next()

  if (!token) {
    return NextResponse.redirect(new URL(envServerConfig.NEXTAUTH_URL))
  }

  const decodedRefreshToken = jwt.decode(token.refreshToken) as { exp: number }

  if (shouldUpdateToken(token.accessToken)) {
    try {
      const newSession = await refreshAccessToken(token)

      if (token === newSession) {
        console.error('Error refreshing token')
        return updateCookie(null, request, response)
      }

      const newSessionToken = await encode({
        secret: envServerConfig.NEXTAUTH_SECRET,
        token: newSession,
        maxAge: decodedRefreshToken.exp // equal with expire time of RT
      })

      // const size = 3933 // maximum size of each chunk
      // const regex = new RegExp('.{1,' + size + '}', 'g')

      response = updateCookie(newSessionToken, request, response, decodedRefreshToken.exp)
    } catch (error: any) {
      Sentry.captureException(error)
      console.error('Error refreshing token: ', error)
      return updateCookie(null, request, response)
    }
  }
  return response
}
