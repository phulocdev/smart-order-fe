export type OrderItemDto = {
  dish: string // ObjectID
  quantity: number
  price: number
  note: string
}

export type CreateOrderByCustomerBodyType = {
  items: OrderItemDto[]
}
