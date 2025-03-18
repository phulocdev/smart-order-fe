import { OrderStatus } from '@/constants/enum'
import { formatSortQuery } from '@/lib/data-table'
import { IOrder } from '@/types/backend.type'
import { ExtendedSortingState } from '@/types/data-table.type'
import { OrderQuery } from '@/types/search-params.type'

interface OrderQueryValues {
  page: number
  limit: number
  from: string
  to: string
  code: string
  sort: ExtendedSortingState<IOrder>
  status: OrderStatus[]
  customer: string
  tableNumber: number[]
}

export function transformOrderQuery(query: OrderQueryValues): OrderQuery {
  return {
    page: query.page,
    limit: query.limit,
    from: query.from || undefined,
    sort: formatSortQuery(query.sort),
    to: query.to || undefined,
    code: query.code || undefined,
    customerCode: query.customer || undefined,
    status: query.status.length > 0 ? Array.from(new Set(query.status)).join(',') : undefined,
    tableNumber: query.tableNumber.length > 0 ? Array.from(new Set(query.tableNumber)).join(',') : undefined
  }
}
