import authApiRequest from '@/apiRequests/auth.api'
import { useMutation } from '@tanstack/react-query'

export function useLoginMutation() {
  return useMutation({
    mutationFn: authApiRequest.login
  })
}

export function useRegisterMutation() {
  return useMutation({
    mutationFn: authApiRequest.register
  })
}

export function useLogoutMutation() {
  return useMutation({
    mutationFn: authApiRequest.logout
  })
}
