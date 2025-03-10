import { withAuth } from 'next-auth/middleware'
import { NextResponse } from 'next/server'

export const config = {
  matcher: ['/login', '/dashboard/:path*', '/customer/:path*']
}

const authenticationPaths = ['/login']
const employeePaths = ['/dashboard']
const customerPaths = ['/customer', '/reservation']

export default withAuth(
  function middleware(req) {
    const { pathname } = req.nextUrl
    const accessToken = req.nextauth.token?.accessToken
    const refreshToken = req.nextauth.token?.refreshToken
    const isEmployee = Boolean(req.nextauth.token?.account)
    const isCustomer = Boolean(req.nextauth.token?.customer)

    if (refreshToken) {
      if (
        authenticationPaths.includes(pathname) ||
        (customerPaths.some((path) => pathname.startsWith(path)) && !isCustomer) ||
        (employeePaths.some((path) => pathname.startsWith(path)) && !isEmployee)
      ) {
        return NextResponse.redirect(new URL('/', req.url))
      }
    }

    if (!refreshToken && [...customerPaths, ...employeePaths].some((path) => pathname.startsWith(path))) {
      return NextResponse.redirect(new URL('/login', req.url))
    }
  },
  {
    //  jwt: { decode: authOptions.jwt?.decode },
    callbacks: {
      authorized: () => {
        return true
      }
    }
  }
)
