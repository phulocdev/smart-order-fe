import http from '@/lib/http'
import { IBill } from '@/types/backend.type'
import { PaginatedResponse } from '@/types/response.type'

const billApiRequest = {
  getList: (accessToken: string) => {
    return http.get<PaginatedResponse<IBill>>(`/bills`, {
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    })
  }
}

export default billApiRequest
