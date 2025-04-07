import http from '@/lib/http'
import { IBill } from '@/types/backend.type'
import { PaginatedResponse } from '@/types/response.type'

const prefix = '/bills'

const billApiRequest = {
  getList: (accessToken: string) => {
    return http.get<PaginatedResponse<IBill>>(`${prefix}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    })
  }
}

export default billApiRequest
