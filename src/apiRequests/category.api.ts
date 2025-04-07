import http from '@/lib/http'
import { ICategory } from '@/types/backend.type'
import { PaginatedResponse } from '@/types/response.type'

const prefix = '/categories'

const categoryApiRequest = {
  getList: () => {
    return http.get<PaginatedResponse<ICategory>>(`${prefix}`)
  }
}

export default categoryApiRequest
