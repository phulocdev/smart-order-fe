'use client'

import { getAccountFromLS, getCustomerFromLS, setAccountToLS, setCustomerToLS } from '@/lib/utils'
import { IAccount, ICustomer } from '@/types/auth.type'
import { OrderItem } from '@/types/backend.dto'
import { create } from 'zustand'

type State = {
  orderItems: OrderItem[]
  customer: ICustomer | null
  account: IAccount | null
}

type Action = {
  addOrderItem: (newOrderItem: OrderItem) => void
  removeOrderItem: (dishId: string) => void
  updateOrderItem: (dishId: string, payload: { quantity?: number; note?: string }) => void
  setCustomer: (customer: ICustomer | null) => void
  setAccount: (customer: IAccount | null) => void
}

export const useAppStore = create<State & Action>((set) => ({
  orderItems: [],
  addOrderItem: (newOrderItem: OrderItem) =>
    set((state) => {
      const prevOrderItems = state.orderItems
      return { orderItems: [...prevOrderItems, newOrderItem] }
    }),
  removeOrderItem: (dishId: string) => {
    set((state) => ({ orderItems: state.orderItems.filter((order) => order.dish._id !== dishId) }))
  },
  updateOrderItem: (dishId: string, payload: { quantity?: number; note?: string }) => {
    // Cho phép cập nhật quantity và note
    set((state) => {
      const prevOrderItems = state.orderItems
      const targetOrderItemIdx = prevOrderItems.findIndex((order) => order.dish._id === dishId)
      if (targetOrderItemIdx < 0) {
        return { orderItems: prevOrderItems }
      }
      const targetOrderItem = prevOrderItems[targetOrderItemIdx]
      prevOrderItems[targetOrderItemIdx] = { ...targetOrderItem, ...payload }
      return { orderItems: [...prevOrderItems] }
    })
  },
  customer: null,
  setCustomer: (customer: ICustomer | null) => {
    if (customer) setCustomerToLS(customer)
    return set(() => ({ customer }))
  },
  account: null,
  setAccount: (account: IAccount | null) => {
    if (account) setAccountToLS(account)
    return set(() => ({ account }))
  }
}))
