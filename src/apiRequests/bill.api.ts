import http from '@/lib/http'
import { IBill } from '@/types/backend.type'
import { PaginatedResponse } from '@/types/response.type'
import { DateRangeQuery } from '@/types/search-params.type'
import qs from 'qs'

const prefix = '/bills'

const billApiRequest = {
  getList: (accessToken: string, params: DateRangeQuery) => {
    return http.get<PaginatedResponse<IBill>>(`${prefix}?${qs.stringify(params)}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    })
  }
}

export default billApiRequest
