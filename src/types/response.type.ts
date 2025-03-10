export interface ApiResponse<T> {
  statusCode: number
  message: string
  data: T
}

// Type cho errorObject trả về từ backend
export interface ApiErrorResponse {
  statusCode: number
  title: string
  message: string
  errors?: { field: string; message: string }[]
}

export interface PaginatedResponse<T> {
  statusCode: number
  message: string
  data: T[]
  meta: {
    page: number
    limit: number
    totalPages: number
    totalDocuments: number
  }
}

export type DeleteResponse = ApiResponse<{
  acknowledged: boolean
  deletedCount: number
}>
