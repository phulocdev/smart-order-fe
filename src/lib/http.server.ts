import { getAuthSession } from '@/auth'
import envConfig from '@/config/env'
import { ENTITY_ERROR_STATUS_CODE, EntityError, HttpError, UNAUTHORIZED_ERROR_STATUS_CODE } from '@/lib/errors'
import { normalizePath } from '@/lib/utils'
import { ApiErrorResponse } from '@/types/response.type'

type OptionsType = Omit<RequestInit, 'method' | 'body'> & {
  baseUrl?: ''
}

const request = async <Response>(method: 'GET', path: string, options?: OptionsType | undefined) => {
  const baseUrl = options?.baseUrl === '' ? envConfig.NEXT_PUBLIC_NEXT_API_URL : envConfig.NEXT_PUBLIC_BACKEND_URL
  const normalizedPath = normalizePath(path)
  const fullUrl = `${baseUrl}${normalizedPath}`
  const baseHeaders: HeadersInit = {}

  if (!(typeof window !== 'undefined')) {
    const session = await getAuthSession()
    const accessToken = session?.accessToken
    if (accessToken) {
      baseHeaders.Authorization = `Bearer ${accessToken}`
    }
  }

  const res = await fetch(fullUrl, {
    method,
    headers: { ...baseHeaders, ...options?.headers }
  })

  // ------------------------------------------- INTERCEPTOR ERROR RESPONSE  -------------------------------------------
  if (!res.ok) {
    const errorResponse: ApiErrorResponse = await res.json()
    const { message, statusCode, errors } = errorResponse
    if (statusCode === UNAUTHORIZED_ERROR_STATUS_CODE) {
      if (['REFRESH_TOKEN_EXPIRED', 'INVALID_REFRESH_TOKEN'].includes(message)) {
        throw errorResponse
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

const httpServer = {
  get: <T>(path: string, options?: OptionsType) => {
    return request<T>('GET', path, options)
  }
}

export default httpServer
