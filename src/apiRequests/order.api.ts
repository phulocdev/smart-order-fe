import http from '@/lib/http'
import { CreateOrderBodyType, UpdateOrderBodyType } from '@/types/backend.dto'
import { IOrder, IStatisticOrders } from '@/types/backend.type'
import { ApiResponse, PaginatedResponse } from '@/types/response.type'
import { DateRangeQuery, OrderQuery, PaginationQuery } from '@/types/search-params.type'
import qs from 'qs'

const prefix = '/orders'

const orderApiRequest = {
  getList: (accessToken: string, params?: DateRangeQuery & PaginationQuery & OrderQuery) => {
    return http.get<PaginatedResponse<IOrder>>(`${prefix}?${qs.stringify(params)}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    })
  },
  statisticsByTables: (accessToken: string) => {
    return http.get<ApiResponse<IStatisticOrders[]>>(`${prefix}/statistics-by-tables`, {
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    })
  },
  update: ({ id, body }: { id: string; body: UpdateOrderBodyType }) => {
    return http.patch<ApiResponse<IOrder>>(`${prefix}/${id}`, body)
  },
  create: (body: CreateOrderBodyType) => {
    return http.post<ApiResponse<IOrder[]>>(`${prefix}`, body)
  },
  remove: (id: string) => {
    return http.delete<[]>(`${prefix}/${id}`)
  },
  removeBulk: ({ ids }: { ids: string[] }) => {
    return http.delete(`${prefix}/bulk-delete`, {}, ids)
  },
  checkout: (customerId: string) => {
    return http.get<ApiResponse<[]>>(`${prefix}/checkout/${customerId}`)
  }
}

export default orderApiRequest
