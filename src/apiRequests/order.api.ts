import http from '@/lib/http'
import { CreateOrderBodyType, UpdateOrderBodyType } from '@/types/backend.dto'
import { IOrder, IStatisticOrders } from '@/types/backend.type'
import { ApiResponse, PaginatedResponse } from '@/types/response.type'
import { DateRangeQuery, OrderQuery, PaginationQuery } from '@/types/search-params.type'
import qs from 'qs'

const orderApiRequest = {
  getList: (accessToken: string, params?: DateRangeQuery & PaginationQuery & OrderQuery) => {
    return http.get<PaginatedResponse<IOrder>>(`/orders?${qs.stringify(params)}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    })
  },
  statisticsByTables: (accessToken: string) => {
    return http.get<ApiResponse<IStatisticOrders[]>>('/orders/statistics-by-tables', {
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    })
  },
  update: ({ id, body }: { id: string; body: UpdateOrderBodyType }) => {
    return http.patch<ApiResponse<IOrder>>(`/orders/${id}`, body)
  },
  create: (body: CreateOrderBodyType) => {
    return http.post<ApiResponse<IOrder[]>>('/orders', body)
  },
  remove: (id: string) => {
    return http.delete<[]>(`/orders/${id}`)
  },
  removeBulk: ({ ids }: { ids: string[] }) => {
    return http.delete('/orders/bulk-delete', {}, ids)
  },
  checkout: (customerId: string) => {
    return http.get<ApiResponse<[]>>(`/orders/checkout/${customerId}`)
  }
}

export default orderApiRequest
