import dishApiRequest from '@/apiRequests/dish.api'
import { useQuery } from '@tanstack/react-query'

export function useGetDishListQuery() {
  return useQuery({
    queryKey: ['dishes'],
    queryFn: dishApiRequest.getList
  })
}
