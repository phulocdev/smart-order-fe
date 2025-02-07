import authApiRequest from '@/apiRequests/auth.api'
import { HttpError } from '@/lib/errors'
import { LoginBodyType } from '@/schemaValidations/auth.schema'
import { cookies } from 'next/headers'
import jwt from 'jsonwebtoken'

export async function POST(request: Request) {
  try {
    const cookieStore = await cookies()
    const body = (await request.json()) as LoginBodyType

    const response = await authApiRequest.sLogin(body)
    const {
      data: { accessToken, refreshToken }
    } = response

    const decodedAccessToken = jwt.decode(accessToken) as { exp: number } // second
    const decodedRefreshToken = jwt.decode(refreshToken) as { exp: number }

    cookieStore.set({
      name: 'accessToken',
      value: accessToken,
      path: '/',
      expires: decodedAccessToken.exp * 1000, // milisecond
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
