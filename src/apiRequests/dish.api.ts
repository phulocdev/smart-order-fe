import http from '@/lib/http'
import { CreateDishBodyType, UpdateDishBodyType } from '@/schemaValidations/dish.schema'
import { IDish } from '@/types/backend.type'
import { ApiResponse, DeleteResponse, PaginatedResponse } from '@/types/response.type'

const dishApiRequest = {
  getList: (accessToken: string) => {
    return http.get<PaginatedResponse<IDish>>('/dishes', {
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    })
  },
  create: (body: CreateDishBodyType) => {
    return http.post<ApiResponse<IDish>>('/dishes', body)
  },
  update: ({ id, body }: { id: string; body: UpdateDishBodyType }) => {
    return http.patch<ApiResponse<IDish>>(`/dishes/${id}`, body)
  },
  remove: (id: string) => {
    return http.delete<DeleteResponse>(`/dishes/${id}`)
  }
}

export default dishApiRequest
