import http from '@/lib/http'
import { CreateOrderBodyType, UpdateOrderBodyType } from '@/types/backend.dto'
import { IOrder } from '@/types/backend.type'
import { ApiResponse, PaginatedResponse } from '@/types/response.type'
import { DateRangeQuery, OrderQuery, PaginationQuery } from '@/types/search-params.type'
import qs from 'qs'

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
    return http.post<ApiResponse<IOrder[]>>('/orders', body)
  },
  sGetList: (accessToken: string, params?: OrderQuery) => {
    return http.get<PaginatedResponse<IOrder>>(`/orders?${qs.stringify(params)}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    })
  },
  remove: (id: string) => {
    return http.delete<[]>(`/orders/${id}`)
  },
  removeBulk: ({ ids }: { ids: string[] }) => {
    return http.delete('/orders/bulk-delete', {}, ids)
  }
}

export default orderApiRequest
