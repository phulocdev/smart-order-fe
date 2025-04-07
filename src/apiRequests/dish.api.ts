import http from '@/lib/http'
import httpServer from '@/lib/http.server'
import { CreateDishBodyType, UpdateDishBodyType } from '@/schemaValidations/dish.schema'
import { IDish } from '@/types/backend.type'
import { ApiResponse, DeleteResponse, PaginatedResponse } from '@/types/response.type'

const dishApiRequest = {
  getList: () => {
    return httpServer.get<PaginatedResponse<IDish>>('/dishes')
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
