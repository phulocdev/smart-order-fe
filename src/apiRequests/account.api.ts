import http from '@/lib/http'
import { IAccount } from '@/types/auth.type'
import { PaginatedResponse } from '@/types/response.type'
import qs from 'qs'

const prefix = '/accounts'

const accountApiRequest = {
  getList: (accessToken: string, params?: Record<string, string>) => {
    return http.get<PaginatedResponse<IAccount>>(`${prefix}?${qs.stringify(params)}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    })
  }
}

export default accountApiRequest
