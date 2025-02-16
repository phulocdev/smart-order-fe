import customerApiRequest from '@/apiRequests/customer.api'
import { useMutation } from '@tanstack/react-query'

export function useCreateOrderByCustomer() {
  return useMutation({
    mutationFn: customerApiRequest.createOrder
  })
}
