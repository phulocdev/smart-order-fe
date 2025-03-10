import http from '@/lib/http'
import { CustomerLoginBodyType } from '@/schemaValidations/auth.schema'
import { IAuthCustomer } from '@/types/auth.type'
import { CreateOrderByCustomerBodyType } from '@/types/backend.dto'
import { IOrder, IOrderCreated } from '@/types/backend.type'
import { ApiResponse } from '@/types/response.type'

const customerApiRequest = {
  login: (body: CustomerLoginBodyType) => {
    return http.post<ApiResponse<IAuthCustomer>>('/customers/auth/login', body)
  },
  logout: ({ refreshToken }: { refreshToken: string }) => {
    return http.post<ApiResponse<[]>>('/customers/auth/logout', { refreshToken })
  },
  createOrder: (body: CreateOrderByCustomerBodyType) => {
    return http.post<ApiResponse<IOrderCreated>>('/customers/orders', body)
  },
  getOrders: () => {
    return http.get<ApiResponse<IOrder>>('/customers/orders')
  }
}

export default customerApiRequest
