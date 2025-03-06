import http from '@/lib/http'
import { IDish } from '@/types/backend.type'
import { PaginatedResponse } from '@/types/response.type'

const dishApiRequest = {
  getList: () => {
    return http.get<PaginatedResponse<IDish>>('/dishes')
  }
}

export default dishApiRequest
