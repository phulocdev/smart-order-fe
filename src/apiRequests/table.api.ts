import http from '@/lib/http'
import { ITable } from '@/types/backend.type'
import { ApiResponse, PaginatedResponse } from '@/types/response.type'

const tableApiRequest = {
  getList: (accessToken: string) => {
    return http.get<PaginatedResponse<ITable>>('/tables', {
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    })
  },

  clientGetOne: (id: string) => {
    return http.get<ApiResponse<ITable>>(`/tables/${id}`)
  }
}

export default tableApiRequest
