import http from '@/lib/http'
import { IOrder } from '@/types/backend.type'
import { DateRangeQuery } from '@/types/search-params.type'
import { PaginatedResponse } from '@/types/response.type'

const orderApiRequest = {
  getList: (params: DateRangeQuery) => {
    const { fromDate, toDate } = params
    return http.get<PaginatedResponse<IOrder>>(`/orders?createdAt>${fromDate}&createdAt<${toDate}`)
  }
}

export default orderApiRequest
