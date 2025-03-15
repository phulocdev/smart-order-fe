import envConfig from '@/config/env'
import { ENTITY_ERROR_STATUS_CODE, EntityError, HttpError, UNAUTHORIZED_ERROR_STATUS_CODE } from '@/lib/errors'
import { normalizePath } from '@/lib/utils'
import { ApiErrorResponse } from '@/types/response.type'
import { getSession, signOut } from 'next-auth/react'
import { redirect } from 'next/navigation'

export const isClient = typeof window !== 'undefined'

type OptionsType = Omit<RequestInit, 'method' | 'body'> & {
  baseUrl?: '' // khi cần gọi API đến NextServer
}

let isRecalling = false

const request = async <Response>(
  method: 'GET' | 'POST' | 'PATCH' | 'DELETE',
  path: string,
  payload?: any,
  options?: OptionsType | undefined
) => {
  const baseUrl = options?.baseUrl === '' ? envConfig.NEXT_PUBLIC_NEXT_API_URL : envConfig.NEXT_PUBLIC_BACKEND_URL
  const normalizedPath = normalizePath(path)
  const fullUrl = `${baseUrl}${normalizedPath}`
  let baseHeaders: HeadersInit = {}

  /**
   * Body:
   * 1. FormData: không được stringify() và không cần  'Content-Type': 'multipart/form-data'
   * Bởi vì fetch đã tự động thêm (Theo trí nhớ đọc trên GG)
   *
   * 2. Là JS Object: cần JSON.stringify() để có thể gửi trên internet thông qua Http Protocol
   */
  let body: FormData | string | undefined = payload
  if (payload && !(payload instanceof FormData)) {
    body = JSON.stringify(payload)
    baseHeaders = {
      'Content-Type': 'application/json'
    }
  }

  // -------------------------------------------- INTERCEPTOR REQUEST  -------------------------------------------
  if (isClient && !isRecalling) {
    const session = await getSession()
    const accessToken = session?.accessToken
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
    console.log('>>>>>>>', { errorResponse })
    const { message, statusCode, errors } = errorResponse
    if (statusCode === UNAUTHORIZED_ERROR_STATUS_CODE) {
      if (['REFRESH_TOKEN_EXPIRED', 'INVALID_REFRESH_TOKEN'].includes(message)) {
        // Handle Logout in middleware.ts of route handler
        throw errorResponse
      } else {
        // re-call previous request with 401 (execpt of Refresh Token Error) errorStatus fail api
        const session = await getSession()
        const accessToken = session?.accessToken ?? ''
        if (!session) {
          return [] as any
        }

        debugger
        isRecalling = true
        const response: Response = await request(method, path, payload, {
          headers: {
            Authorization: `Bearer ${accessToken}`
          }
        })
        isRecalling = false
        return response
      }
    } else if (statusCode === ENTITY_ERROR_STATUS_CODE) {
      throw new EntityError({ message, errors })
    }
    throw new HttpError({ message, statusCode })
  }

  // ------------------------------------------- INTERCEPTOR SUCCESS RESPONSE  -------------------------------------------

  // await new Promise((resolve) => {
  //   setTimeout(() => {
  //     resolve(true)
  //   }, 3000)
  // })

  const successResponse: Response = await res.json()
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
  delete: <T>(path: string, options?: OptionsType, body?: any | undefined) => {
    return request<T>('DELETE', path, body, options)
  }
}

export default http
