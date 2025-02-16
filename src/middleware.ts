import { cookies } from 'next/headers'
import { NextResponse, type NextRequest } from 'next/server'

const authenticatePaths = ['/login', '/register']
const privatePaths = ['/dashboard']

export async function middleware(request: NextRequest) {
  const cookieStore = await cookies()
  const accessToken = cookieStore.get('accessToken')?.value
  const refreshToken = cookieStore.get('refreshToken')?.value
  const { pathname } = request.nextUrl

  if (refreshToken) {
    // Lâu ngày không vào web thì AT hết hạn
    // if (privatePaths.some((path) => pathname.startsWith(path)) && !accessToken) {
    //   const url = new URL(`/refresh-token?callbackURL=${pathname}`, request.url)
    //   return NextResponse.redirect(url)
    // }

    if (authenticatePaths.includes(pathname)) {
      return NextResponse.redirect(new URL('/', request.url))
    }
  }

  if (!refreshToken) {
    if (privatePaths.some((path) => pathname.startsWith(path))) {
      const url = new URL(`/login?clearTokens=true`, request.url)
      return NextResponse.redirect(url)
    }
  }
}

export const config = {
  matcher: ['/login', '/register', '/dashboard/:path*']
}
