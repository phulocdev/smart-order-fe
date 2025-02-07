import { toast } from '@/hooks/use-toast'
import { EntityError, HttpError } from '@/lib/errors'
import { isClient } from '@/lib/http'
import { clsx, type ClassValue } from 'clsx'
import { UseFormSetError } from 'react-hook-form'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Hàm này dùng để bổ sung thêm dấu / trong path url
 * @param path đường dẫn đến tài nguyên trong backend
 */
export function normalizePath(path: string) {
  return path.startsWith('/') ? path : `/${path}`
}

export const getAccessTokenFromLS = () => {
  return (isClient && localStorage.getItem('accessToken')) || ''
}

export const getRefreshTokenFromLS = () => {
  return (isClient && localStorage.getItem('refreshToken')) || ''
}

export const setAccessTokenToLS = (token: string) => {
  if (isClient) {
    localStorage.setItem('accessToken', token)
  }
}

export const setRefreshTokenToLS = (token: string) => {
  if (isClient) {
    localStorage.setItem('refreshToken', token)
  }
}

export const removeAccessTokenFromLS = () => {
  if (isClient) {
    localStorage.removeItem('accessToken')
  }
}

export const removeRefreshTokenFromLS = () => {
  if (isClient) {
    localStorage.removeItem('refreshToken')
  }
}

export const handleApiError = ({ error, setError }: { error: any; setError?: UseFormSetError<any> }) => {
  if (error instanceof EntityError && setError) {
    const { errors } = error
    errors.map((err) => setError(err.field as any, { message: err.message }))
  } else {
    // Http Error (Bad Request | Not Found | Unauthorized | Internal Server Error)
    // Ngoài ra còn có các lỗi khác như: ERRCONNECT | Unexpected Error
    toast({
      title: '❌ Đã có lỗi xảy ra',
      description: error.message || 'Vui lòng thử lại'
    })
  }
}
