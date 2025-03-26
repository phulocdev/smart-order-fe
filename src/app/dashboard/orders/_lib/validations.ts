import { PAGINATION } from '@/constants/constants'
import { OrderStatus } from '@/constants/enum'
import { getSortingStateParser } from '@/lib/parsers'
import { IOrder } from '@/types/backend.type'
import { endOfToday, startOfToday } from 'date-fns'
import { createSearchParamsCache, parseAsArrayOf, parseAsInteger, parseAsIsoDate, parseAsString } from 'nuqs/server'
import * as z from 'zod'

export const orderSearchParamsCache = createSearchParamsCache({
  // flags: parseAsArrayOf(z.enum(['advancedTable', 'floatingBar'])).withDefault([]),
  page: parseAsInteger.withDefault(PAGINATION.DEFAUT_PAGE_INDEX),
  limit: parseAsInteger.withDefault(PAGINATION.DEFAULT_PAGE_SIZE),
  from: parseAsIsoDate.withDefault(startOfToday()),
  to: parseAsIsoDate.withDefault(endOfToday()),
  // from: parseAsString.withDefault(''),
  // to: parseAsString.withDefault(''),

  // Filter by keys of column - các key này phải có trong accessorKey trong ordertableColumns
  sort: getSortingStateParser<IOrder>().withDefault([{ id: 'createdAt', desc: true }]),
  code: parseAsString.withDefault(''),
  // Dùng zod để parse bởi vì nếu client thêm những filter value không hợp lệ vào url thì sẽ làm crash app
  status: parseAsArrayOf(z.nativeEnum(OrderStatus)).withDefault([]),
  tableNumber: parseAsArrayOf(
    z
      .string()
      .transform((val) => parseInt(val))
      .pipe(z.number().int().min(0))
  ).withDefault([]),
  customer: parseAsString.withDefault('') // Customer Code
})
