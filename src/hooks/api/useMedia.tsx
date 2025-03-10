import mediaApiRequest from '@/apiRequests/media.api'
import { useMutation } from '@tanstack/react-query'

export function useUploadSingleImageMutation() {
  return useMutation({
    mutationFn: mediaApiRequest.uploadSingleImage
  })
}
