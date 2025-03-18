import { PAGINATION } from '@/constants/constants'
import { OrderStatus } from '@/constants/enum'
import { getSortingStateParser } from '@/lib/parsers'
import { IOrder } from '@/types/backend.type'
import { createSearchParamsCache, parseAsArrayOf, parseAsInteger, parseAsString } from 'nuqs/server'
import * as z from 'zod'

export const searchParamsCache = createSearchParamsCache({
  // flags: parseAsArrayOf(z.enum(['advancedTable', 'floatingBar'])).withDefault([]),
  page: parseAsInteger.withDefault(PAGINATION.DEFAUT_PAGE_INDEX),
  limit: parseAsInteger.withDefault(PAGINATION.DEFAULT_PAGE_SIZE),
  from: parseAsString.withDefault(''),
  to: parseAsString.withDefault(''),

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
  // advanced filter
  // filters: getFiltersStateParser().withDefault([])
  // joinOperator: parseAsStringEnum(['and', 'or']).withDefault('and')
})

export const createTaskSchema = z.object({
  title: z.string()
  // label: z.enum(tasks.label.enumValues),
  // status: z.enum(tasks.status.enumValues),
  // priority: z.enum(tasks.priority.enumValues)
})

export const updateTaskSchema = z.object({
  title: z.string().optional()
  // label: z.enum(tasks.label.enumValues).optional(),
  // status: z.enum(tasks.status.enumValues).optional(),
  // priority: z.enum(tasks.priority.enumValues).optional()
})

export type GetTasksSchema = Awaited<ReturnType<typeof searchParamsCache.parse>>
export type CreateTaskSchema = z.infer<typeof createTaskSchema>
export type UpdateTaskSchema = z.infer<typeof updateTaskSchema>
