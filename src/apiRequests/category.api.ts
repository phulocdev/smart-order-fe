import http from '@/lib/http'
import { ICategory } from '@/types/backend.type'
import { PaginatedResponse } from '@/types/response.type'

const categoryApiRequest = {
  getList: (accessToken: string) => {
    return http.get<PaginatedResponse<ICategory>>('/categories', {
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    })
  }
}

export default categoryApiRequest
