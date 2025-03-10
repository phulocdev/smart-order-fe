import http from '@/lib/http'
import { ITable } from '@/types/backend.type'
import { PaginatedResponse } from '@/types/response.type'

const tableApiRequest = {
  getList: () => {
    return http.get<PaginatedResponse<ITable>>('/tables')
  },
  sGetList: (accessToken: string) => {
    return http.get<PaginatedResponse<ITable>>('/tables', {
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    })
  }
}

export default tableApiRequest
