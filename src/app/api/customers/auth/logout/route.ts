import { cookies } from 'next/headers'
import { ApiResponse } from '@/types/response.type'
import { HttpError } from '@/lib/errors'
import customerApiRequest from '@/apiRequests/customer.api'

export async function POST(request: Request) {
  try {
    const cookieStore = await cookies()
    const accessToken = cookieStore.get('accessToken')?.value
    const refreshToken = cookieStore.get('refreshToken')?.value

    // Khi User muốn logout thì ta phải xóa AT và RT trong cookies ở client (cookies này là từ Next Server)
    // Còn việc call API đến backend server thì có hoặc không cũng được
    cookieStore.delete('accessToken')
    cookieStore.delete('refreshToken')

    if (!accessToken || !refreshToken) {
      const res: ApiResponse<[]> = {
        message: 'Không nhận được Access Token hoặc Refresh Token',
        statusCode: 200,
        data: []
      }
      return Response.json(res, { status: 200 })
    }

    const response = await customerApiRequest.sLogout({ accessToken, refreshToken })
    return Response.json(response)
  } catch (error) {
    if (((error as any)?.digest as string)?.startsWith('NEXT_REDIRECT')) {
      throw error
    }
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
