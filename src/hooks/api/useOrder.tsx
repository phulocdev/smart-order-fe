import orderApiRequest from '@/apiRequests/order.api'
import { DateRangeQuery, OrderQuery, PaginationQuery } from '@/types/search-params.type'
import { useMutation, useQuery } from '@tanstack/react-query'

export function useUpdateOrderMutation() {
  return useMutation({ mutationFn: orderApiRequest.update })
}

export function useCreateOrderMutation() {
  return useMutation({ mutationFn: orderApiRequest.create })
}

export function useCheckoutOrdersMutation() {
  return useMutation({ mutationFn: orderApiRequest.checkout })
}

export function useGetOrderListQuery(params?: DateRangeQuery & PaginationQuery & OrderQuery) {
  return useQuery({
    queryKey: ['orders', params],
    queryFn: () => orderApiRequest.clientGetList(params)
  })
}
