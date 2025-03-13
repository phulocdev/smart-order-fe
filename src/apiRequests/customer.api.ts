import http from '@/lib/http'
import { CustomerLoginBodyType } from '@/schemaValidations/auth.schema'
import { IAuthCustomer } from '@/types/auth.type'
import { CreateOrderByCustomerBodyType } from '@/types/backend.dto'
import { IOrder, IOrderCreated } from '@/types/backend.type'
import { ApiResponse } from '@/types/response.type'

const prefix = '/customers'

const customerApiRequest = {
  login: (body: CustomerLoginBodyType) => {
    return http.post<ApiResponse<IAuthCustomer>>(`${prefix}/auth/login`, body)
  },
  logout: ({ accessToken, refreshToken }: { refreshToken: string; accessToken: string }) => {
    return http.post<ApiResponse<[]>>(
      `${prefix}/auth/logout`,
      { refreshToken },
      {
        headers: {
          Authorization: `Bearer ${accessToken}`
        }
      }
    )
  },
  createOrder: (body: CreateOrderByCustomerBodyType) => {
    return http.post<ApiResponse<IOrderCreated>>(`${prefix}/orders`, body)
  },
  getOrders: () => {
    return http.get<ApiResponse<IOrder>>(`${prefix}/orders`)
  },
  refreshToken: (refreshToken: string) => {
    return http.post<ApiResponse<IAuthCustomer>>(`${prefix}/auth/refresh-token`, { refreshToken })
  }
}

export default customerApiRequest
