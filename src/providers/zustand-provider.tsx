"use client";

import {
  addOrderItemToLS,
  clearOrderItemFromLS,
  getOrderItemsFromLS,
  removeOrderItemFromLS,
  updateOrderItemInLS,
} from "@/lib/utils";
import { IDish } from "@/types/backend.type";
import { create } from "zustand";

export type OrderItem = {
  dish: IDish;
  quantity: number;
  price: number;
  note: string;
};

export type OrderItemsState = { tableNumber: number; items: OrderItem[] };

type State = {
  orderItems: OrderItemsState[];
};

type Action = {
  addOrderItem: (tableNumber: number, newOrderItem: OrderItem) => void;
  removeOrderItem: (tableNumber: number, dishId: string) => void;
  updateOrderItem: (
    tableNumber: number,
    dishId: string,
    payload: { quantity?: number; note?: string },
  ) => void;
  clearOrderInCart: (tableNumber: number) => void;
};

export const useAppStore = create<State & Action>((set) => ({
  orderItems: getOrderItemsFromLS() ?? [],
  addOrderItem: (tableNumber: number, newOrderItem: OrderItem) => {
    addOrderItemToLS(tableNumber, newOrderItem);
    set((state) => {
      let prevOrderItems = state.orderItems;
      let prevItems =
        prevOrderItems.find((order) => order.tableNumber === tableNumber)
          ?.items ?? [];

      // loại bỏ đi items của bàn mà cần thêm mới các đơn hàng vô
      prevOrderItems = prevOrderItems.filter(
        (order) => order.tableNumber !== tableNumber,
      );
      // loại bỏ đi các món ăn đã có trong orderItems
      prevItems = prevItems.filter(
        (item) => item.dish._id !== newOrderItem.dish._id,
      );
      return {
        orderItems: [
          ...prevOrderItems,
          { tableNumber, items: [...prevItems, newOrderItem] },
        ],
      };
    });
  },
  removeOrderItem: (tableNumber: number, dishId: string) => {
    removeOrderItemFromLS(tableNumber, dishId);
    set((state) => {
      const prevOrderItems = state.orderItems;
      const prevItemsIdx = prevOrderItems.findIndex(
        (order) => order.tableNumber === tableNumber,
      );

      if (prevItemsIdx < 0) {
        return { orderItems: prevOrderItems };
      }

      const prevItems = prevOrderItems[prevItemsIdx].items;
      const filteredItems = prevItems.filter(
        (item) => item.dish._id !== dishId,
      );
      prevOrderItems[prevItemsIdx].items = filteredItems;
      return { orderItems: [...prevOrderItems] };
    });
  },
  updateOrderItem: (tableNumber, dishId, payload) => {
    updateOrderItemInLS(tableNumber, dishId, payload);

    set((state) => {
      return {
        orderItems: state.orderItems.map((order) => {
          if (order.tableNumber !== tableNumber) return order;

          return {
            ...order,
            items: order.items.map((item) => {
              if (item.dish._id !== dishId) return item;

              return {
                ...item,
                ...payload,
              };
            }),
          };
        }),
      };
    });
  },
  clearOrderInCart: (tableNumber: number) => {
    clearOrderItemFromLS(tableNumber);
    set((state) => {
      let prevOrderItems = state.orderItems;
      // const prevItemsIdx = prevOrderItems.findIndex((order) => order.tableNumber === tableNumber)
      // prevOrderItems[prevItemsIdx].items = []
      prevOrderItems = prevOrderItems.filter(
        (order) => order.tableNumber !== tableNumber,
      );
      return { orderItems: [...prevOrderItems] };
    });
  },
}));
