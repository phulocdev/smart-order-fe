import { OrderStatus } from '@/constants/enum'

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
