import http from '@/lib/http'
import { ITable } from '@/types/backend.type'
import { PaginatedResponse } from '@/types/response.type'

const tableApiRequest = {
  getList: () => {
    return http.get<PaginatedResponse<ITable>>('/tables')
  }
}

export default tableApiRequest
