import accountApiRequest from '@/apiRequests/account.api'
import { useQuery } from '@tanstack/react-query'

export default function useAccountsQuery(params?: Record<string, string>) {
  return useQuery({
    queryKey: ['accounts', params],
    queryFn: () => accountApiRequest.getList(params)
  })
}
