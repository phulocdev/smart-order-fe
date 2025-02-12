import http from '@/lib/http'
import { IDish } from '@/types/backend.type'
import { PaginatedResponse } from '@/types/response.type'

const prefix = '/dishes'

const dishApiRequest = {
  sGetList: () => {
    return http.get<PaginatedResponse<IDish>>(prefix)
  }
}

export default dishApiRequest
