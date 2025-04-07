import httpServer from '@/lib/http.server'
import { CustomerLoginBodyType } from '@/schemaValidations/auth.schema'
import { IAuthCustomer } from '@/types/auth.type'
import { ApiResponse } from '@/types/response.type'

const prefix = '/customers'

const customerAuthApiRequest = {
  login: (body: CustomerLoginBodyType) => {
    return httpServer.post<ApiResponse<IAuthCustomer>>(`${prefix}/auth/login`, body)
  },
  // logout: (refreshToken: string) => {
  //   return httpServer.post<ApiResponse<[]>>(`${prefix}/auth/logout`, { refreshToken })
  // },
  refreshToken: (refreshToken: string) => {
    return httpServer.post<ApiResponse<IAuthCustomer>>(`${prefix}/auth/refresh-token`, { refreshToken })
  }
}

export default customerAuthApiRequest
