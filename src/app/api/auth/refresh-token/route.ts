import { HttpError } from '@/lib/errors'
import { cookies } from 'next/headers'
import jwt from 'jsonwebtoken'
import authApiRequest from '@/apiRequests/auth.api'

export async function POST() {
  try {
    const cookieStore = await cookies()
    const olRefreshToken = cookieStore.get('refreshToken')?.value || ''

    const response = await authApiRequest.sRefreshToken(olRefreshToken)
    const {
      data: { accessToken, refreshToken }
    } = response

    const decodedAccessToken = jwt.decode(accessToken) as { exp: number }
    const decodedRefreshToken = jwt.decode(refreshToken) as { exp: number }

    cookieStore.set({
      name: 'accessToken',
      value: accessToken,
      path: '/',
      expires: decodedAccessToken.exp * 1000,
      httpOnly: true
    })

    cookieStore.set({
      name: 'refreshToken',
      value: refreshToken,
      path: '/',
      expires: decodedRefreshToken.exp * 1000,
      httpOnly: true
    })
    return Response.json(response)
  } catch (error) {
    if (error instanceof HttpError) {
      // RT Invalid
      return Response.json(error, { status: error.statusCode })
    }
    return Response.json(
      {
        title: 'Internal Next Server Error',
        statusCode: 500,
        message: 'Đã có lỗi khi Next Server gọi API đến Backend Server'
      },
      { status: 500 }
    )
  }
}
