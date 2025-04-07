import { OrderStatus } from '@/constants/enum'

type FSM = Record<OrderStatus, OrderStatus[]>

const orderStatusFSM: FSM = {
  [OrderStatus.Pending]: [OrderStatus.Confirmed, OrderStatus.Canceled, OrderStatus.Rejected],
  [OrderStatus.Confirmed]: [OrderStatus.Cooked, OrderStatus.Canceled],
  [OrderStatus.Cooked]: [OrderStatus.Served, OrderStatus.Canceled],
  [OrderStatus.Served]: [OrderStatus.Paid],
  [OrderStatus.Paid]: [],
  [OrderStatus.Canceled]: [],
  [OrderStatus.Rejected]: []
}

export const canTransitionStatus = (current: OrderStatus, next: OrderStatus): boolean => {
  return orderStatusFSM[current].includes(next)
}
