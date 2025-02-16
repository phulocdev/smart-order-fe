import { IOrderItem } from '@/types/backend.type'

// Phục vụ cho global state
export type OrderItem = Omit<IOrderItem, '_id' | 'status' | 'createdAt' | 'updatedAt'>

export type OrderItemDto = {
  dishId: string
  quantity: number
  price: number
  note: string
}

export type CreateOrderByCustomerBodyType = {
  items: OrderItemDto[]
}
