import { OrderStatus, SocialProvider } from '@/constants/enum'

export type OrderItemDto = {
  dish: string // ObjectID
  quantity: number
  price: number
  note: string
}

export type CreateOrderByCustomerBodyType = {
  items: OrderItemDto[]
}

export type UpdateOrderBodyType = {
  status: OrderStatus
}

export type CreateOrderBodyType = {
  tableNumber: number
  items: OrderItemDto[]
}

export type LoginOAuthBodyType = {
  email: string
  avatarUrl?: string
  provider: SocialProvider
  accessToken: string
}
