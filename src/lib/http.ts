import envConfig from '@/config'
import { getAccessTokenFromLS, normalizePath } from '@/lib/utils'
import { ISuccessResponse } from '@/types/response.type'
import { defaultMaxListeners } from 'events'

type OptionsType = Omit<RequestInit, 'method' | 'body'> & {
  baseUrl?: '' // khi cần gọi API đến NextServer
}

export const isClient = typeof window !== 'undefined'

const request = async <ResponseType>(
  method: 'GET' | 'POST' | 'PATCH' | 'DELETE',
  path: string,
  payload?: any,
  options?: OptionsType | undefined
): Promise<ResponseType | { error: any }> => {
  const baseUrl = options?.baseUrl === '' ? envConfig.NEXT_PUBLIC_NEXT_API_URL : envConfig.NEXT_PUBLIC_BACKEND_URL
  const normalizedPath = normalizePath(path)
  const fullUrl = `${baseUrl}${normalizedPath}`

  const baseHeaders: HeadersInit = {
    'Content-Type': 'application/json'
  }

  if (isClient) {
    const accessToken = getAccessTokenFromLS()
    if (accessToken) {
      baseHeaders.Authorization = `Bearer ${accessToken}`
    }
  }

  // Lưu ý body có thể là Object hoặc FormData (image, file...) -> cho nên không phải lúc nào cũng JSON.stringify
  let body: FormData | string | undefined = undefined
  if (payload && !(payload instanceof FormData)) {
    body = JSON.stringify(payload)
  }

  const res = await fetch(fullUrl, {
    method,
    headers: { ...baseHeaders, ...options?.headers },
    body
  })

  if (!res.ok) {
    const error = await res.json()
    throw error
  }
  const data: ResponseType = await res.json()
  return data
}

const http = {
  get: <DataType>(path: string, options?: OptionsType) => {
    return request<ISuccessResponse<DataType>>('GET', path, options)
  },
  post: <DataType>(path: string, body: any, options?: OptionsType) => {
    return request<ISuccessResponse<DataType>>('POST', path, body, options)
  },
  patch: <DataType>(path: string, body: any, options?: OptionsType) => {
    return request<ISuccessResponse<DataType>>('PATCH', path, body, options)
  },
  delete: <DataType>(path: string, options?: OptionsType) => {
    return request<ISuccessResponse<DataType>>('DELETE', path, options)
  }
}

export default http
