import http from '@/lib/http'
import { LoginBodyType, RegisterBodyType } from '@/schemaValidations/auth.schema'
import { IAuthEmployee } from '@/types/auth.type'
import { ApiResponse } from '@/types/response.type'

const authApiRequest = {
  sRegister: (body: RegisterBodyType) => {
    return http.post<ApiResponse<IAuthEmployee>>('/auth/register', body)
  },
  register: (body: RegisterBodyType) => {
    return http.post<ApiResponse<IAuthEmployee>>('/api/auth/register', body, {
      baseUrl: ''
    })
  },
  sLogin: (body: LoginBodyType) => {
    return http.post<ApiResponse<IAuthEmployee>>('/auth/login', body)
  },
  login: (body: LoginBodyType) => {
    return http.post<ApiResponse<IAuthEmployee>>('/api/auth/login', body, {
      baseUrl: ''
    })
  },
  sLogout: ({ accessToken, refreshToken }: { accessToken: string; refreshToken: string }) => {
    return http.post<ApiResponse<[]>>(
      '/auth/logout',
      { refreshToken },
      {
        headers: {
          Authorization: `Bearer ${accessToken}`
        }
      }
    )
  },
  logout: () => {
    return http.post<ApiResponse<[]>>('/api/auth/logout', {}, { baseUrl: '' })
  },
  sRefreshToken: (refreshToken: string) => {
    return http.post<ApiResponse<IAuthEmployee>>('/auth/refresh-token', { refreshToken })
  },
  refreshToken: () => {
    return http.post<ApiResponse<IAuthEmployee>>('/api/auth/refresh-token', {}, { baseUrl: '' })
  }
}

export default authApiRequest
