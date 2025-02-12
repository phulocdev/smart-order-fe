import http from '@/lib/http'
import { IAccount } from '@/types/auth.type'
import { PaginatedResponse } from '@/types/response.type'
import queryString from 'query-string'

const prefix = '/accounts'

const accountApiRequest = {
  sGetList: (accessToken: string) => {
    return http.get<PaginatedResponse<IAccount>>(prefix, {
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    })
  },

  getList: (params?: Record<string, string>) => {
    return http.get<PaginatedResponse<IAccount>>(`${prefix}?${queryString.stringify(params || {})}`)
  }
}

export default accountApiRequest
