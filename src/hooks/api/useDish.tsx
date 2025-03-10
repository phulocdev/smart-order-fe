import dishApiRequest from '@/apiRequests/dish.api'
import { useMutation, useQuery } from '@tanstack/react-query'

export function useGetDishListQuery() {
  return useQuery({
    queryKey: ['dishes'],
    queryFn: dishApiRequest.getList
  })
}

export function useCreateDishMutation() {
  return useMutation({
    mutationFn: dishApiRequest.create
  })
}

export function useUpdateDishMutation() {
  return useMutation({
    mutationFn: dishApiRequest.update
  })
}

export function useRemoveDishMutation() {
  return useMutation({
    mutationFn: dishApiRequest.remove
  })
}
