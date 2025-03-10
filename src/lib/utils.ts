import { variants } from '@/components/ui/badge'
import { DishStatus, OrderStatus } from '@/constants/enum'
import { EntityError } from '@/lib/errors'
import { isClient } from '@/lib/http'
import { IDish, IOrder } from '@/types/backend.type'
import { clsx, type ClassValue } from 'clsx'
import { getDay } from 'date-fns'
import { UseFormSetError } from 'react-hook-form'
import { toast } from 'sonner'
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

// ---------------------- ACCESS_TOKEN UTILS --------------------

export const getAccessTokenFromLS = () => {
  return (isClient && localStorage.getItem('accessToken')) || ''
}

export const setAccessTokenToLS = (token: string) => {
  if (isClient) {
    localStorage.setItem('accessToken', token)
  }
}

export const removeAccessTokenFromLS = () => {
  if (isClient) {
    localStorage.removeItem('accessToken')
  }
}

// ---------------------- REFRESH_TOKEN UTILS --------------------

// export const getRefreshTokenFromLS = () => {
//   return (isClient && localStorage.getItem('refreshToken')) || ''
// }

// export const setRefreshTokenToLS = (token: string) => {
//   if (isClient) {
//     localStorage.setItem('refreshToken', token)
//   }
// }

// export const removeRefreshTokenFromLS = () => {
//   if (isClient) {
//     localStorage.removeItem('refreshToken')
//   }
// }

// export const getCustomerFromLS = () => {
//   if (!isClient) return null
//   const customer = localStorage.getItem('customer')
//   return customer ? JSON.parse(customer) : null
// }

// export const setCustomerToLS = (customer: ICustomer) => {
//   if (isClient) {
//     localStorage.setItem('customer', JSON.stringify(customer))
//   }
// }

// export const removeCustomerFromLS = () => {
//   if (isClient) {
//     console.log('removeCustomerFromLS')
//     localStorage.removeItem('customer')
//   }
// }

// export const getAccountFromLS = () => {
//   if (!isClient) return null
//   const account = localStorage.getItem('account')
//   return account ? JSON.parse(account) : null
// }

// export const setAccountToLS = (account: IAccount) => {
//   if (isClient) {
//     localStorage.setItem('account', JSON.stringify(account))
//   }
// }

// export const removeAccountFromLS = () => {
//   if (isClient) {
//     localStorage.removeItem('account')
//   }
// }

export const handleApiError = ({
  error,
  setError,
  duration = 3000
}: {
  error: any
  setError?: UseFormSetError<any>
  duration?: number
}) => {
  if (error instanceof EntityError && setError) {
    const { errors } = error
    errors.map((err) => setError(err.field, { message: err.message }))
  } else {
    // Http Error (Bad Request | Not Found | Unauthorized | Internal Server Error)
    // Ngoài ra còn có các lỗi khác như: ERRCONNECT | Unexpected Error - Uncaught
    toast.error(error?.message ?? 'Đã có lỗi xảy ra', { description: 'Vui lòng thử lại', duration })
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

export const getVietnameseDishStatus = (status: DishStatus) => {
  switch (status) {
    case DishStatus.Available:
      return 'Có sẵn'
    case DishStatus.Unavailable:
      return 'Không có sẵn'
    case DishStatus.Hidden:
      return 'Tạm ẩn'
    default:
      return 'INVALID_DISH_STATUS'
  }
}

export const getVietnameseDishStatusList = () => {
  return Object.values(DishStatus).map((status, index) => ({
    label: getVietnameseDishStatus(status),
    value: getDishStatusByIndex(index)
  }))
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

const getDishStatusByIndex = (index: number) => {
  return Object.values(DishStatus)[index]
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

const orderKeyTranslations: Record<keyof IOrder, string> = {
  _id: 'Mã đơn hàng',
  code: 'Mã đơn',
  customer: 'Khách hàng',
  items: 'Danh sách sản phẩm',
  totalPrice: 'Tổng tiền',
  status: 'Trạng thái',
  table: 'Bàn',
  createdAt: 'Ngày tạo',
  updatedAt: 'Ngày cập nhật'
}

export function translateOrderKey(key: keyof IOrder): string {
  return orderKeyTranslations[key]
}

export const dishKeyTranslations: Record<keyof IDish, string> = {
  _id: 'Mã món ăn',
  title: 'Tên món',
  description: 'Mô tả',
  price: 'Giá',
  status: 'Trạng thái',
  imageUrl: 'Hình ảnh',
  createdAt: 'Ngày tạo',
  updatedAt: 'Ngày cập nhật'
}

export function translateDishKey(key: keyof IDish): string {
  return dishKeyTranslations[key]
}
