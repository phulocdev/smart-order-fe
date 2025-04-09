import orderApiRequest from '@/apiRequests/order.api'
import { useMutation } from '@tanstack/react-query'

export function useUpdateOrderMutation() {
  return useMutation({ mutationFn: orderApiRequest.update })
}

export function useCreateOrderMutation() {
  return useMutation({ mutationFn: orderApiRequest.create })
}

export function useCheckoutOrdersMutation() {
  return useMutation({ mutationFn: orderApiRequest.checkout })
}
