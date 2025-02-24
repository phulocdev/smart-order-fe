export interface ApiResponse<T> {
  statusCode: number
  message: string
  data: T
}

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
