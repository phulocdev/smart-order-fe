import { DishStatus, OrderStatus, TableStatus } from '@/constants/enum'
import { ICustomer } from '@/types/auth.type'

export interface IDish {
  _id: string
  title: string
  description: string
  price: number
  status: DishStatus
  imageUrl: string
  createdAt: string
  updatedAt: string
}

export interface IOrderItem {
  _id: string
  dish: IDish
  quantity: number
  price: number
  note: string
  createdAt: string
  updatedAt: string
}

export interface ITable {
  _id: string
  number: number
  capacity: number
  status: TableStatus
  createdAt: string
  updatedAt: string
}

export interface IOrder {
  _id: string
  code: string
  customer: Omit<ICustomer, 'table'>
  items: IOrderItem[]
  totalPrice: number
  status: OrderStatus
  table: ITable
  createdAt: string
  updatedAt: string
}

export type IOrderCreated = Omit<IOrder, 'customer' | 'table' | 'items'> & {
  customer: string
  table: string
  items: Omit<IOrderItem, 'dish'> &
    {
      dish: string
    }[]
}
