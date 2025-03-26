import { DishStatus, OrderStatus, TableStatus } from '@/constants/enum'
import { IAccount, ICustomer } from '@/types/auth.type'

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

export interface ITable {
  _id: string
  number: number
  capacity: number
  status: TableStatus
  customer: string // ObjectId
  createdAt: string
  updatedAt: string
}

export interface IOrder {
  _id: string
  code: string
  customer: Omit<ICustomer, 'table'> | null
  dish: IDish | null
  quantity: number
  price: number
  note: string
  totalPrice: number
  status: OrderStatus
  tableNumber: number
  createdAt: string
  updatedAt: string
}

export interface IStatisticOrders {
  tableNumber: number
  orders: IOrder[]
  statusCounts: Record<OrderStatus, number>
}

interface IOrderItem {
  _id: string
  dish: IDish | null
  quantity: number
  price: number
  createdAt: string
  updatedAt: string
}

export interface IBill {
  billCode: string
  customerCode: string
  totalPrice: number
  orderItems: IOrderItem[]
  tableNumer: number
  account: Omit<IAccount, 'avatarUrl'> | null
  createdAt: string
  updatedAt: string
}
