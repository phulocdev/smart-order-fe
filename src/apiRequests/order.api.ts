import http from '@/lib/http'
import { IOrder } from '@/types/backend.type'
import { PaginatedResponse } from '@/types/response.type'

const orderApiRequest = {
  getList: () => {
    return http.get<PaginatedResponse<IOrder>>('/orders')
  }
}

export default orderApiRequest
