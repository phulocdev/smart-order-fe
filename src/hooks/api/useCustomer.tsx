import customerApiRequest from '@/apiRequests/customer.api'
import { useMutation, useQuery } from '@tanstack/react-query'

export function useGetOrdersByCustomerQuery() {
  return useQuery({ queryKey: ['orders'], queryFn: customerApiRequest.getOrders })
}

export function useCreateOrderByCustomerMutation() {
  return useMutation({
    mutationFn: customerApiRequest.createOrder
  })
}
