import http from '@/lib/http'
import { IAccount } from '@/types/auth.type'
import { PaginatedResponse } from '@/types/response.type'
import queryString from 'query-string'

const accountApiRequest = {
  sGetList: (accessToken: string) => {
    return http.get<PaginatedResponse<IAccount>>('/accounts', {
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    })
  },

  getList: (params?: Record<string, string>) => {
    return http.get<PaginatedResponse<IAccount>>(`/accounts${queryString.stringify(params || {})}`)
  }
}

export default accountApiRequest
