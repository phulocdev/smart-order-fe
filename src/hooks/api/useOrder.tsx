import orderApiRequest from '@/apiRequests/order.api'
import { DateRangeQuery, PaginationQuery } from '@/types/search-params.type'
import { keepPreviousData, useMutation, useQuery } from '@tanstack/react-query'

export function useGetOrderListQuery(params: DateRangeQuery & PaginationQuery) {
  return useQuery({
    queryKey: ['orders', params],
    queryFn: () => orderApiRequest.getList(params),
    placeholderData: keepPreviousData
  })
}

export function useGetOrderDetailQuery(id?: string) {
  return useQuery({
    queryKey: ['order', id],
    queryFn: () => orderApiRequest.getDetail(id as string),
    enabled: Boolean(id)
  })
}

export function useUpdateOrderMutation() {
  return useMutation({ mutationFn: orderApiRequest.update })
}
