import http from '@/lib/http'
import { CreateOrderByCustomerBodyType } from '@/types/backend.dto'
import { IOrder } from '@/types/backend.type'
import { ApiResponse, PaginatedResponse } from '@/types/response.type'

const prefix = '/customers'

const customerApiRequest = {
  createOrder: (body: CreateOrderByCustomerBodyType) => {
    return http.post<ApiResponse<IOrder[]>>(`${prefix}/orders`, body)
  },
  getOrders: (accessToken: string) => {
    return http.get<PaginatedResponse<IOrder>>(`${prefix}/orders`, {
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    })
  }
}

export default customerApiRequest
