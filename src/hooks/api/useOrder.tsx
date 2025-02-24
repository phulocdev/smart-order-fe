import orderApiRequest from '@/apiRequests/order.api'
import { DateRangeQuery } from '@/types/search-params.type'
import { keepPreviousData, useQuery } from '@tanstack/react-query'

// TODO: Bổ sung params: fromDate & toDate để query ra những Orders cần thiết
export function useGetOrderListQuery(params: DateRangeQuery) {
  return useQuery({
    queryKey: ['orders', params],
    queryFn: () => orderApiRequest.getList(params),
    placeholderData: keepPreviousData
  })
}
