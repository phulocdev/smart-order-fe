import http from '@/lib/http'
import { LoginBodyType, LoginOAuthBodyType } from '@/schemaValidations/auth.schema'
import { IAuthEmployee } from '@/types/auth.type'
import { ApiResponse } from '@/types/response.type'

const authApiRequest = {
  login: (body: LoginBodyType) => {
    return http.post<ApiResponse<IAuthEmployee>>('/auth/login', body)
  },
  loginOAuth: (body: LoginOAuthBodyType) => {
    return http.post<ApiResponse<IAuthEmployee>>('/auth/login/oauth', body)
  },
  logout: ({ refreshToken }: { refreshToken: string }) => {
    return http.post<ApiResponse<[]>>('/auth/logout', { refreshToken })
  }
}

export default authApiRequest
