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
}

export type ICustomer = {
  _id: string
  code: string
  tableNumber: number
}

export type AuthTokenPayload = {
  _id: string
  email: string
  fullName: string
  avatarUrl: string
  role: Role
  iat: number
  exp: number
}
