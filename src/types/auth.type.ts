import { Role } from '@/constants/enum'

export interface IAuth {
  accessToken: string
  refreshToken: string
  [key: string]: any
}

export interface IAuthEmployee extends IAuth {
  account: IAccount
}

export interface IAuthCustomer extends IAuth {
  customer: ICustomer
}

export type IAccount = {
  _id: string
  email: string
  fullName: string
  avatarUrl: string
  role: Role
  createdAt: string
  updatedAt: string
}

export type ICustomer = {
  _id: string
  name: string
  tableId: string
  createdAt: string
  updatedAt: string
}
