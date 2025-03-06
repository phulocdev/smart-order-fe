import authApiRequest from '@/apiRequests/auth.api'
import envConfig from '@/config/env'
import { ENTITY_ERROR_STATUS_CODE, EntityError, HttpError, UNAUTHORIZED_ERROR_STATUS_CODE } from '@/lib/errors'
import {
  getAccessTokenFromLS,
  normalizePath,
  removeAccessTokenFromLS,
  removeAccountFromLS,
  removeCustomerFromLS,
  removeRefreshTokenFromLS,
  setAccessTokenToLS,
  setRefreshTokenToLS
} from '@/lib/utils'
import { IAuth } from '@/types/auth.type'
import { ApiErrorResponse, ApiResponse } from '@/types/response.type'
import { redirect } from 'next/navigation'

type OptionsType = Omit<RequestInit, 'method' | 'body'> & {
  baseUrl?: '' // khi cần gọi API đến NextServer
}

export const isClient = typeof window !== 'undefined'

const request = async <Response>(
  method: 'GET' | 'POST' | 'PATCH' | 'DELETE',
  path: string,
  payload?: any,
  options?: OptionsType | undefined
) => {
  const baseUrl = options?.baseUrl === '' ? envConfig.NEXT_PUBLIC_NEXT_API_URL : envConfig.NEXT_PUBLIC_BACKEND_URL
  const normalizedPath = normalizePath(path)
  const fullUrl = `${baseUrl}${normalizedPath}`

  const baseHeaders: HeadersInit = {
    'Content-Type': 'application/json'
  }

  // Lưu ý body có thể là Object hoặc FormData (image, file...) -> cho nên không phải lúc nào cũng JSON.stringify()
  let body: FormData | string | undefined = undefined
  if (payload && !(payload instanceof FormData)) {
    body = JSON.stringify(payload)
  }

  // ------------------------------------------- INTERCEPTOR REQUEST  -------------------------------------------
  if (isClient) {
    const accessToken = getAccessTokenFromLS()
    if (accessToken) {
      baseHeaders.Authorization = `Bearer ${accessToken}`
    }
  }

  const res = await fetch(fullUrl, {
    method,
    headers: { ...baseHeaders, ...options?.headers },
    body
  })

  // ------------------------------------------- INTERCEPTOR ERROR RESPONSE  -------------------------------------------
  if (!res.ok) {
    const errorResponse: ApiErrorResponse = await res.json()
    const { message, statusCode, errors } = errorResponse
    if (statusCode === UNAUTHORIZED_ERROR_STATUS_CODE) {
      debugger
      console.log(errorResponse)
      if (isClient) {
        // + RT hết hạn
        // + RT bị Server xóa đi / RT không hợp lệ
        // + AT bị hết hạn (vì lưu trong LocalStorage nên không thể tự động xóa)
        // + AT không hợp lệ (do client chỉnh sửa)
        // + AT không được gửi lên
        authApiRequest.logout().finally(() => {
          window.location.href = '/login'
          removeAccessTokenFromLS()
          removeRefreshTokenFromLS()
        })
      } else {
        // + AT không hợp lệ (do client chỉnh sửa)
        // + AT không được gửi lên / AT trong cookie không còn
        console.log('>>>>> errorResponse', errorResponse)
        debugger
        redirect(`/logout?logoutSecretKey=${envConfig.NEXT_PUBLIC_LOGOUT_SECRET_KEY}`)
      }
    } else if (statusCode === ENTITY_ERROR_STATUS_CODE) {
      console.log(errors)
      throw new EntityError({ message, errors })
    }
    throw new HttpError({ message, statusCode })
  }

  // ------------------------------------------- INTERCEPTOR SUCCESS RESPONSE  -------------------------------------------
  const successResponse: Response = await res.json()

  if (
    [
      '/api/auth/login',
      '/api/auth/register',
      '/api/auth/refresh-token',
      '/api/customers/auth/login',
      '/api/customers/auth/register',
      '/api/customers/auth/refresh-token'
    ].includes(normalizedPath)
  ) {
    const data = (successResponse as ApiResponse<IAuth>).data
    const { accessToken, refreshToken } = data
    setAccessTokenToLS(accessToken)
    setRefreshTokenToLS(refreshToken)
  } else if (['/api/auth/logout', '/api/customers/auth/logout'].includes(normalizedPath)) {
    removeAccessTokenFromLS()
    removeRefreshTokenFromLS()
    removeCustomerFromLS()
    removeAccountFromLS()
  }

  // await new Promise((resolve) => {
  //   setTimeout(() => {
  //     resolve(true)
  //   }, 5000)
  // })

  return successResponse
}

const http = {
  get: <T>(path: string, options?: OptionsType) => {
    return request<T>('GET', path, undefined, options)
  },
  post: <T>(path: string, body: any, options?: OptionsType) => {
    return request<T>('POST', path, body, options)
  },
  patch: <T>(path: string, body: any, options?: OptionsType) => {
    return request<T>('PATCH', path, body, options)
  },
  delete: <T>(path: string, options?: OptionsType) => {
    return request<T>('DELETE', path, undefined, options)
  }
}

export default http
