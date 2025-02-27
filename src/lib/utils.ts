import { toast } from '@/hooks/use-toast'
import { EntityError } from '@/lib/errors'
import { isClient } from '@/lib/http'
import { clsx, type ClassValue } from 'clsx'
import { UseFormSetError } from 'react-hook-form'
import { twMerge } from 'tailwind-merge'
import jwt from 'jsonwebtoken'
import authApiRequest from '@/apiRequests/auth.api'
import { AuthTokenPayload, IAccount, ICustomer } from '@/types/auth.type'
import customerApiRequest from '@/apiRequests/customer.api'
import { OrderStatus } from '@/constants/enum'
import { getDay, parse, isValid, setDate } from 'date-fns'
import { badgeVariants, variants } from '@/components/ui/badge'

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

export const getCustomerFromLS = () => {
  if (!isClient) return null
  const customer = localStorage.getItem('customer')
  return customer ? JSON.parse(customer) : null
}

export const setCustomerToLS = (customer: ICustomer) => {
  if (isClient) {
    localStorage.setItem('customer', JSON.stringify(customer))
  }
}

export const removeCustomerFromLS = () => {
  if (isClient) {
    console.log('removeCustomerFromLS')
    localStorage.removeItem('customer')
  }
}

export const getAccountFromLS = () => {
  if (!isClient) return null
  const account = localStorage.getItem('account')
  return account ? JSON.parse(account) : null
}

export const setAccountToLS = (account: IAccount) => {
  if (isClient) {
    localStorage.setItem('account', JSON.stringify(account))
  }
}

export const removeAccountFromLS = () => {
  if (isClient) {
    localStorage.removeItem('account')
  }
}

export const handleApiError = ({ error, setError }: { error: any; setError?: UseFormSetError<any> }) => {
  if (error instanceof EntityError && setError) {
    const { errors } = error
    errors.map((err) => setError(err.field as any, { message: err.message }))
  } else {
    // Http Error (Bad Request | Not Found | Unauthorized | Internal Server Error)
    // Ngoài ra còn có các lỗi khác như: ERRCONNECT | Unexpected Error - Uncaught
    toast({
      title: '❌ Đã có lỗi xảy ra',
      description: error?.message || 'Vui lòng thử lại'
    })
  }
}

export const checkAndRefreshToken = async () => {
  const accessToken = getAccessTokenFromLS()
  const refreshToken = getRefreshTokenFromLS()

  if (!accessToken || !refreshToken) {
    return
  }

  const decodedAccessToken = jwt.decode(accessToken) as AuthTokenPayload
  const decodedRefreshToken = jwt.decode(refreshToken) as AuthTokenPayload
  const now = new Date().getTime() / 1000 // second

  // TH: RT hết hạn
  if (decodedRefreshToken.exp - now <= 0) {
    return authApiRequest.logout()
  }

  if (decodedAccessToken.exp - now < (decodedAccessToken.exp - decodedAccessToken.iat) / 3) {
    if (decodedRefreshToken.role) {
      await authApiRequest.refreshToken()
    } else {
      await customerApiRequest.refreshToken()
    }
  }
}

export const formatNumberToVnCurrency = (number: number) => {
  return number.toLocaleString('it-IT') + 'đ'
}

export const getVietnameseOrderStatus = (status: OrderStatus) => {
  switch (status) {
    case OrderStatus.Pending:
      return 'Chờ xác nhận'
    case OrderStatus.Confirmed:
      return 'Đã xác nhận'
    case OrderStatus.Preparing:
      return 'Đang chuẩn bị'
    case OrderStatus.ReadyToServe:
      return 'Sẵn sàng phục vụ'
    case OrderStatus.Served:
      return 'Đã phục vụ'
    case OrderStatus.Paid:
      return 'Đã thanh toán'
    case OrderStatus.Canceled:
      return 'Đã hủy'
    case OrderStatus.Rejected:
      return 'Từ chối'
    default:
      return 'INVALID_ORDER_STATUS'
  }
}

export const getVietnameseOrderStatusList = () => {
  return Object.values(OrderStatus).map((status, index) => ({
    label: getVietnameseOrderStatus(status),
    value: getOrderStatusByIndex(index)
  }))
}

const getOrderStatusByIndex = (index: number) => {
  return Object.values(OrderStatus)[index]
}

export const getVietnameseDayOfWeek = (date: string | Date) => {
  const orderOfDay = getDay(date)
  switch (orderOfDay) {
    case 0:
      return 'Chủ nhật'
    case 1:
      return 'Thứ hai'
    case 2:
      return 'Thứ ba'
    case 3:
      return 'Thứ tư'
    case 4:
      return 'Thứ năm'
    case 5:
      return 'Thứ sáu'
    case 6:
      return 'Thứ bảy'
    default:
      return 'INVALID_DAY_OF_WEEK'
  }
}

export const getBadgeVariant = (status: OrderStatus): keyof typeof variants.variant => {
  switch (status) {
    case OrderStatus.Pending:
      return 'yellow'
    case OrderStatus.Confirmed:
      return 'blue'
    case OrderStatus.Preparing:
      return 'orange'
    case OrderStatus.ReadyToServe:
      return 'purple'
    case OrderStatus.Served:
      return 'blue'
    case OrderStatus.Rejected:
      return 'red'
    case OrderStatus.Canceled:
      return 'outline'
    case OrderStatus.Paid:
      return 'green'
    default:
      return 'default'
  }
}

export const removeVietNamAccent = (text: string) => {
  const from = 'àáãảạăằắẳẵặâầấẩẫậèéẻẽẹêềếểễệđùúủũụưừứửữựòóỏõọôồốổỗộơờớởỡợìíỉĩịäëïîöüûñçýỳỹỵỷ',
    to = 'aaaaaaaaaaaaaaaaaeeeeeeeeeeeduuuuuuuuuuuoooooooooooooooooiiiiiaeiiouuncyyyyy'
  for (let i = 0, l = from.length; i < l; i++) {
    text = text.replace(RegExp(from[i], 'gi'), to[i])
  }

  text = text
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\-]/g, '-')
    .replace(/-+/g, '-')

  return text
}
