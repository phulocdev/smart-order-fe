import { cookies } from 'next/headers'
import { NextResponse, type NextRequest } from 'next/server'

const authenticatePaths = ['/login', '/register']
const privatePaths = ['/dashboard']

export async function middleware(request: NextRequest) {
  const cookieStore = await cookies()
  const refreshToken = cookieStore.get('refreshToken')
  const { pathname } = request.nextUrl

  if (authenticatePaths.includes(pathname) && refreshToken) {
    return NextResponse.redirect(new URL('/', request.url))
  }

  if (privatePaths.some((path) => pathname.startsWith(path)) && !refreshToken) {
    return NextResponse.redirect(new URL('/login', request.url))
  }
}

export const config = {
  matcher: ['/login', '/register', '/dashboard/:path*']
}
