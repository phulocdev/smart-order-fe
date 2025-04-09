'use client'

import {
  addOrderItemToLS,
  clearOrderItemFromLS,
  getOrderItemsFromLS,
  removeOrderItemFromLS,
  updateOrderItemInLS
} from '@/lib/utils'
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
  orderItems: getOrderItemsFromLS() ?? [],
  addOrderItem: (newOrderItem: OrderItemState) => {
    addOrderItemToLS(newOrderItem)
    set((state) => {
      const prevOrderItems = state.orderItems
      return { orderItems: [...prevOrderItems, newOrderItem] }
    })
  },
  removeOrderItem: (dishId: string) => {
    removeOrderItemFromLS(dishId)
    set((state) => ({ orderItems: state.orderItems.filter((order) => order.dish._id !== dishId) }))
  },
  updateOrderItem: (dishId: string, payload: { quantity?: number; note?: string }) => {
    // Cho phép cập nhật quantity và note
    updateOrderItemInLS(dishId, payload)
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
    clearOrderItemFromLS()
    set(() => ({ orderItems: [] }))
  }
}))
