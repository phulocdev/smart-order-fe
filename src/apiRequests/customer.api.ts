import http from '@/lib/http'
import { CustomerLoginBodyType } from '@/schemaValidations/auth.schema'
import { IAuthCustomer } from '@/types/auth.type'
import { CreateOrderByCustomerBodyType } from '@/types/backend.dto'
import { IOrder, IOrderCreated } from '@/types/backend.type'
import { ApiResponse } from '@/types/response.type'

const customerApiRequest = {
  sLogin: (body: CustomerLoginBodyType) => {
    return http.post<ApiResponse<IAuthCustomer>>('/customers/auth/login', body)
  },
  login: (body: CustomerLoginBodyType) => {
    return http.post<ApiResponse<IAuthCustomer>>('/api/customers/auth/login', body, {
      baseUrl: ''
    })
  },
  sLogout: ({ accessToken, refreshToken }: { accessToken: string; refreshToken: string }) => {
    return http.post<ApiResponse<[]>>(
      '/customers/auth/logout',
      { refreshToken },
      {
        headers: {
          Authorization: `Bearer ${accessToken}`
        }
      }
    )
  },
  logout: () => {
    return http.post<ApiResponse<[]>>('/api/customers/auth/logout', {}, { baseUrl: '' })
  },
  sRefreshToken: (refreshToken: string) => {
    return http.post<ApiResponse<IAuthCustomer>>('/customers/auth/refresh-token', { refreshToken })
  },
  refreshToken: () => {
    return http.post<ApiResponse<IAuthCustomer>>('/api/customers/auth/refresh-token', {}, { baseUrl: '' })
  },
  createOrder: (body: CreateOrderByCustomerBodyType) => {
    return http.post<ApiResponse<IOrderCreated>>('/customers/orders', body)
  },
  getOrders: () => {
    return http.get<ApiResponse<IOrder>>('/orders')
  }
}

export default customerApiRequest
