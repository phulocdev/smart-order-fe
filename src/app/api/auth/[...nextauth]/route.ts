import { authOptions } from '@/auth'
import envServerConfig from '@/config/env.server'
import { createAuthCookieString } from '@/lib/auth'
import { refreshAccessToken, shouldUpdateToken } from '@/middleware'
import * as jwt from 'jsonwebtoken'
import NextAuth from 'next-auth'
import { decode, encode, getToken, JWT } from 'next-auth/jwt'
import { NextRequest, NextResponse } from 'next/server'

const handler = NextAuth(authOptions)

export const SESSION_SECURE = process.env.NEXTAUTH_URL?.startsWith('https://')
export const NEXT_AUTH_SESSION_TOKEN_COOKIE = SESSION_SECURE
  ? `__Secure-next-auth.session-token`
  : `next-auth.session-token`

const wrappedAuthHandler = async (req: NextRequest, res: NextResponse) => {
  const token = await getToken({ req })
  const nextAuthResponse = await handler(req, res)
  return maybePerformTokenRefresh(token, req, nextAuthResponse)
}

export { wrappedAuthHandler as GET, wrappedAuthHandler as POST }

async function maybePerformTokenRefresh(token: JWT | null, request: NextRequest, response: NextResponse) {
  // Check if there is a Set-Cookie header with the NEXT_AUTH_SESSION_TOKEN_COOKIE name.
  // If there is, we need to see if the token is expired and needs an update.
  // Return value of getSetCookie() is an array of strings: ['cookie1=value1', 'cookie2=value2', ...]
  const setCookieHeaders = response.headers.getSetCookie()
  const nextAuthSessionTokenCookie = setCookieHeaders?.find((cookie) => cookie.includes(NEXT_AUTH_SESSION_TOKEN_COOKIE))

  if (!nextAuthSessionTokenCookie) {
    // No cookie found, nothing to update.
    return response
  }

  const cookieValueWithOptions = nextAuthSessionTokenCookie.split('=')[1]
  const cookieValue = cookieValueWithOptions.split(';')[0]

  const decodedCookieAsToken = await decode({
    secret: envServerConfig.NEXTAUTH_SECRET as string,
    token: cookieValue
  })

  if (!decodedCookieAsToken || !shouldUpdateToken(decodedCookieAsToken.accessToken)) {
    return response
  }

  let updatedSessionToken: JWT | undefined = undefined
  const decodedRefreshToken = jwt.decode(decodedCookieAsToken?.refreshToken) as { exp: number }

  try {
    const newSession = await refreshAccessToken(decodedCookieAsToken)
    updatedSessionToken = newSession
  } catch (e) {
    console.error(`❌❌ [Middleware] Error refreshing tokens: ${e}`)
  }
  const newSessionToken = await encode({
    secret: process.env.NEXTAUTH_SECRET as string,
    token: updatedSessionToken,
    maxAge: decodedRefreshToken.exp
  })

  const newCookieValue = createAuthCookieString(NEXT_AUTH_SESSION_TOKEN_COOKIE, newSessionToken, {
    httpOnly: true,
    maxAge: decodedRefreshToken.exp,
    secure: SESSION_SECURE,
    sameSite: 'Lax',
    path: '/'
  })

  const clonedResponse = response.clone()
  clonedResponse.headers.delete('Set-Cookie')
  clonedResponse.headers.set('Set-Cookie', newCookieValue)
  return clonedResponse
}
