import authApiRequest from '@/apiRequests/auth.api'
import customerApiRequest from '@/apiRequests/customer.api'
import { useMutation } from '@tanstack/react-query'

export function useLoginMutation() {
  return useMutation({
    mutationFn: authApiRequest.login
  })
}

export function useCustomerLoginMutation() {
  return useMutation({
    mutationFn: customerApiRequest.login
  })
}
