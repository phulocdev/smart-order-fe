import { LoginBodyType } from '@/schemaValidations/auth.schema'
import { IAuthEmployee } from '@/types/auth.type'
import { LoginOAuthBodyType } from '@/types/backend.dto'
import { ApiResponse } from '@/types/response.type'
import httpServer from '@/lib/http.server'

const prefix = '/auth'

const authApiRequest = {
  login: (body: LoginBodyType) => {
    return httpServer.post<ApiResponse<IAuthEmployee>>(`${prefix}/login`, body)
  },
  loginOAuth: (body: LoginOAuthBodyType) => {
    return httpServer.post<ApiResponse<IAuthEmployee>>(`${prefix}/login/oauth`, body)
  },
  // logout: ({ accessToken, refreshToken }: { refreshToken: string; accessToken: string }) => {
  //   return httpServer.post<ApiResponse<[]>>(`${prefix}/logout`, { refreshToken, accessToken })
  // },
  refreshToken: (refreshToken: string) => {
    return httpServer.post<ApiResponse<IAuthEmployee>>(`${prefix}/refresh-token`, { refreshToken })
  }
}

export default authApiRequest
