'use client'

import { IAccount, ICustomer } from '@/types/auth.type'
import { IDish } from '@/types/backend.type'
import { create } from 'zustand'

export type OrderItemState = {
  dish: IDish
  quantity: number
  price: number
  note: string
}

type State = {
  orderItems: OrderItemState[]
}

type Action = {
  addOrderItem: (newOrderItem: OrderItemState) => void
  removeOrderItem: (dishId: string) => void
  updateOrderItem: (dishId: string, payload: { quantity?: number; note?: string }) => void
  clearOrderInCart: () => void
}

export const useAppStore = create<State & Action>((set) => ({
  orderItems: [],
  addOrderItem: (newOrderItem: OrderItemState) =>
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
  clearOrderInCart: () => {
    set(() => ({ orderItems: [] }))
  }
}))
