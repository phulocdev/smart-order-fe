import tableApiRequest from '@/apiRequests/table.api'
import { useQuery } from '@tanstack/react-query'

// TODO: Bổ sung params: fromDate & toDate để query ra những Orders cần thiết
export function useGetTableListQuery() {
  return useQuery({ queryKey: ['tables'], queryFn: tableApiRequest.getList })
}
