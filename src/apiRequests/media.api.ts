import http from '@/lib/http'
import { ApiResponse } from '@/types/response.type'

const mediaApiRequest = {
  uploadSingleImage: ({ body, folderName }: { body: FormData; folderName?: string }) => {
    return http.post<ApiResponse<{ result: string }>>('/media/upload/single', body, {
      headers: {
        ['folder-name']: folderName as any
      }
    })
  }
}

export default mediaApiRequest
