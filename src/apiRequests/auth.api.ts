import http from '@/lib/http'
import { LoginBodyType, RegisterBodyType } from '@/schemaValidations/auth.schema'
import { IAuthEmployee } from '@/types/auth.type'
import { ApiResponse } from '@/types/response.type'

const authApiRequest = {
  refreshTokenRequest: undefined as Promise<ApiResponse<IAuthEmployee>> | undefined,

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
  async refreshToken() {
    if (this.refreshTokenRequest) {
      return
    }
    this.refreshTokenRequest = http.post<ApiResponse<IAuthEmployee>>('/api/auth/refresh-token', {}, { baseUrl: '' })
    return await this.refreshTokenRequest
  }
}

export default authApiRequest
