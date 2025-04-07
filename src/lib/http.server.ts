import envConfig from '@/config/env'
import { ENTITY_ERROR_STATUS_CODE, EntityError, HttpError } from '@/lib/errors'
import { normalizePath } from '@/lib/utils'
import { ApiErrorResponse } from '@/types/response.type'

type ServerOptionsType = Omit<RequestInit, 'method' | 'body'> & {
  baseUrl?: ''
  accessToken?: string | null
}

const serverRequest = async <Response>(
  method: 'GET' | 'POST' | 'PATCH' | 'DELETE',
  path: string,
  payload?: any,
  options?: ServerOptionsType | undefined
): Promise<Response> => {
  const baseUrl = options?.baseUrl === '' ? envConfig.NEXT_PUBLIC_NEXT_API_URL : envConfig.NEXT_PUBLIC_BACKEND_URL
  if (!baseUrl) {
    throw new Error('API base URL is not configured for server request.')
  }
  const normalizedPath = normalizePath(path)
  const fullUrl = `${baseUrl}${normalizedPath}`

  const baseHeaders: HeadersInit = {
    'x-api-key': envConfig.NEXT_PUBLIC_API_KEY || ''
  }

  let body: FormData | string | undefined = payload
  if (payload && !(payload instanceof FormData)) {
    body = JSON.stringify(payload)
    baseHeaders['Content-Type'] = 'application/json'
  }

  if (options?.accessToken) {
    baseHeaders.Authorization = `Bearer ${options.accessToken}`
  }

  const res = await fetch(fullUrl, {
    method,
    headers: { ...baseHeaders, ...options?.headers },
    body
    // Important for edge: Consider cache options if needed
    // cache: 'no-store',
  })

  if (!res.ok) {
    let errorResponse: ApiErrorResponse
    try {
      errorResponse = await res.json()
    } catch (jsonError) {
      throw new HttpError({ message: `HTTP error ${res.status}: ${res.statusText}`, statusCode: res.status })
    }

    const { message, statusCode, errors } = errorResponse

    if (statusCode === ENTITY_ERROR_STATUS_CODE) {
      throw new EntityError({ message, errors })
    }
    throw new HttpError({ message: message || 'API request failed', statusCode })
  }

  const contentType = res.headers.get('content-type')
  if (contentType && contentType.includes('application/json')) {
    const successResponse: Response = await res.json()
    return successResponse
  } else if (res.status === 204 || res.headers.get('content-length') === '0') {
    return {} as Response
  } else {
    try {
      return await res.json()
    } catch (e) {
      console.warn(`Non-JSON success response received from ${method} ${fullUrl}`)
      return {} as Response
    }
  }
}

const httpServer = {
  get: <T>(path: string, options?: ServerOptionsType) => {
    return serverRequest<T>('GET', path, undefined, options)
  },
  post: <T>(path: string, body: any, options?: ServerOptionsType) => {
    return serverRequest<T>('POST', path, body, options)
  },
  patch: <T>(path: string, body: any, options?: ServerOptionsType) => {
    return serverRequest<T>('PATCH', path, body, options)
  },
  delete: <T>(path: string, options?: ServerOptionsType, body?: any | undefined) => {
    return serverRequest<T>('DELETE', path, body, options)
  }
}

export default httpServer
