import http from '@/lib/http'
import { IOrder } from '@/types/backend.type'
import { DateRangeQuery, OrderQuery, PaginationQuery } from '@/types/search-params.type'
import { ApiResponse, PaginatedResponse } from '@/types/response.type'
import qs from 'qs'
import { CreateOrderBodyType, UpdateOrderBodyType } from '@/types/backend.dto'

const orderApiRequest = {
  getList: (params?: DateRangeQuery & PaginationQuery & OrderQuery) => {
    return http.get<PaginatedResponse<IOrder>>(`/orders?${qs.stringify(params)}`)
  },
  getDetail: (id: string) => {
    return http.get<ApiResponse<IOrder>>(`/orders/${id}`)
  },
  update: ({ id, body }: { id: string; body: UpdateOrderBodyType }) => {
    return http.patch<ApiResponse<IOrder>>(`/orders/${id}`, body)
  },
  create: (body: CreateOrderBodyType) => {
    return http.post<ApiResponse<IOrder>>('/orders', body)
  }
  // sGetDetail: (id: string, accessToken: string) => {
  //   return http.get<ApiResponse<IOrder>>(`/orders/${id}`, {
  //     headers: {
  //       Authorization: `Bearer ${accessToken}`
  //     }
  //   })
  // }
}

export default orderApiRequest
