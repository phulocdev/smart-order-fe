import http from '@/lib/http'
import { IDashboardStatistics } from '@/types/backend.type'
import { ApiResponse } from '@/types/response.type'
import { DateRangeQuery } from '@/types/search-params.type'
import qs from 'qs'

const dashboardApiRequest = {
  getStatistics: (accessToken: string, params: DateRangeQuery) => {
    return http.get<ApiResponse<IDashboardStatistics>>(`/dashboard?${qs.stringify(params)}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    })
  }
}
export default dashboardApiRequest
