import { isClient } from '@/lib/http'
import { clsx, type ClassValue } from 'clsx'
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
