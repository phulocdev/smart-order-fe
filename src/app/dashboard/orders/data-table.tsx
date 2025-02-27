'use client'

import {
  ColumnFiltersState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
  VisibilityState
} from '@tanstack/react-table'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import React, { useMemo, useRef, useState } from 'react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { useGetOrderListQuery } from '@/hooks/api/useOrder'
import { CirclePlus } from 'lucide-react'
import { cn, getVietnameseOrderStatus } from '@/lib/utils'
import { addDays, endOfWeek, format, startOfToday, startOfWeek } from 'date-fns'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import AutoPagination from '@/components/auto-pagination'
import TableSkeleton from '@/components/table-skeleton'
import useOrderColumns from '@/app/dashboard/orders/useOrderColumns'
import { OrderSearchParamsType } from '@/types/search-params.type'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { OrderStatus } from '@/constants/enum'
import AdvanceDateRange from '@/components/advance-date-range'
import { omitBy, isUndefined } from 'lodash'
import { PAGINATION } from '@/constants/constants'
import qs from 'qs'

const DEFAULT_PAGE_SIZE = 6
const initialFromDate = format(addDays(startOfWeek(startOfToday()), 1), 'yyyy-M-dd')
const initialToDate = format(addDays(endOfWeek(startOfToday()), 1), 'yyyy-M-dd')

export function DataTable() {
  console.log('DataTable')
  const searchParams = useSearchParams()
  const router = useRouter()
  const pathname = usePathname()
  // Store SearchParams to Object -> easy to access value
  const orderSearchParams: OrderSearchParamsType = useMemo(
    () =>
      omitBy(
        {
          // chỉ phục vụ cho việc Pagination ở phía client mà thôi - Không liên quan j đến phía backend
          page: searchParams.get('page') || PAGINATION.DEFAUT_PAGE_SIZE,
          sort: searchParams.get('sort') ?? undefined,
          code: searchParams.get('code') ?? undefined,
          customer: searchParams.get('customer') ?? undefined,
          status: searchParams.get('status') ?? undefined,
          from: searchParams.get('from') ?? undefined,
          to: searchParams.get('to') ?? undefined
        },
        isUndefined
      ),
    [searchParams]
  )

  const initialSorting: SortingState = orderSearchParams.sort
    ? [{ id: orderSearchParams.sort.split('.')[0], desc: orderSearchParams.sort.split('.')[1] === 'desc' }]
    : []
  const initialColumnFilters: ColumnFiltersState = Object.entries(orderSearchParams)
    .filter(([key]) => !['page', 'sort', 'from', 'to'].includes(key))
    .map(([key, value]) => ({ id: key, value }))

  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({})
  const [rowSelection, setRowSelection] = React.useState({})
  const pageIndex = (Number(orderSearchParams.page) || 1) - 1
  const [pagination, setPagination] = useState({
    pageIndex,
    pageSize: DEFAULT_PAGE_SIZE
  })
  const columns = useOrderColumns({ orderSearchParams })

  const orderListQuery = useGetOrderListQuery({
    from: orderSearchParams.from ?? format(initialFromDate, 'yyyy-M-dd'),
    to: orderSearchParams.to ?? format(initialToDate, 'yyyy-M-dd')
  })
  const orderList = orderListQuery.data?.data ?? []

  const table = useReactTable({
    data: orderList,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    onPaginationChange: setPagination,
    initialState: {
      sorting: initialSorting,
      columnFilters: initialColumnFilters
    },
    state: {
      pagination,
      columnVisibility,
      rowSelection
    }
  })

  const columnFilterState = table.getState().columnFilters
  const prevColumnFilterState = React.useRef(columnFilterState)
  React.useEffect(() => {
    if (JSON.stringify(prevColumnFilterState.current) === JSON.stringify(columnFilterState)) {
      return
    }
    const timeoutId = setTimeout(() => {
      const objectFilterColumns = Object.fromEntries(columnFilterState.map(({ id, value }) => [id, value]))
      const { page, sort, from, to } = orderSearchParams
      router.push(`${pathname}?${qs.stringify({ page, sort, from, to, ...objectFilterColumns })}`)
      // Cập nhật lại giá trị mới cho ref
      prevColumnFilterState.current = columnFilterState
    }, 1000)

    return () => clearTimeout(timeoutId)
  }, [orderSearchParams, pathname, router, table, columnFilterState])

  React.useEffect(() => {
    if (!Number(searchParams.get('page'))) {
      router.push(`${pathname}?page=1&sort=createdAt.desc`)
    }
  }, [pathname, router, searchParams])

  React.useEffect(() => {
    setPagination((state) => ({ ...state, pageIndex }))
  }, [pageIndex])

  return (
    <div>
      <div className={cn('grid gap-2')}>
        <AdvanceDateRange
          fromDate={orderSearchParams.from ?? initialFromDate}
          toDate={orderSearchParams.to ?? initialToDate}
          searchParams={orderSearchParams}
        />

        {/* TODO: Isolate Filter Column component */}
        <div className='flex items-center gap-x-4 pb-4 pt-2'>
          <Input
            placeholder='Lọc theo mã đơn hàng '
            value={(table.getColumn('code')?.getFilterValue() as string) ?? ''}
            onChange={(event) => {
              const filterValue = event.target.value
              table.getColumn('code')?.setFilterValue(filterValue)
            }}
            className='max-w-[220px]'
          />
          <Input
            placeholder='Lọc theo tên khách hàng hoặc số bàn '
            value={(table.getColumn('customer')?.getFilterValue() as string) ?? ''}
            onChange={(event) => table.getColumn('customer')?.setFilterValue(event.target.value)}
            className='max-w-[300px]'
          />
          <Select onValueChange={(status) => table.getColumn('status')?.setFilterValue(status)}>
            <SelectTrigger className='w-[180px]'>
              <SelectValue placeholder={<span className='text-gray-500'>Trạng thái</span>} />
            </SelectTrigger>
            <SelectContent>
              {Object.keys(OrderStatus).map((status) => (
                <SelectItem key={status} value={status}>
                  {getVietnameseOrderStatus(status as OrderStatus)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Button className='ml-auto'>
            <CirclePlus />
            <span>Tạo đơn hàng</span>
          </Button>
        </div>
      </div>

      <div className='rounded-md border'>
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                    </TableHead>
                  )
                })}
              </TableRow>
            ))}
          </TableHeader>
          {orderListQuery.isPending && <TableSkeleton columns={5} />}
          {!orderListQuery.isPending && (
            <TableBody>
              {table.getRowModel().rows.length > 0 ? (
                table.getRowModel().rows.map((row) => (
                  <TableRow key={row.id} data-state={row.getIsSelected() && 'selected'}>
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={columns.length} className='h-24 text-center'>
                    Danh sách trống
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          )}
        </Table>
      </div>
      {/* Pagination */}
      {orderListQuery.data?.data && (
        <div className='flex items-center justify-end space-x-2 py-4'>
          <div className='text-sm'>
            <div className='flex items-center gap-x-3'>
              <span className='shrink-0 text-sm font-semibold'>Rows per page</span>
              <Select
                onValueChange={(newPageSize) => {
                  table.setPageSize(Number(newPageSize))
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder={table.getState().pagination.pageSize} />
                </SelectTrigger>
                <SelectContent>
                  {[DEFAULT_PAGE_SIZE, 15, 20, 50].map((pageSize) => (
                    <SelectItem key={pageSize} value={pageSize.toString()}>
                      {pageSize}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <AutoPagination
            currentPage={table.getState().pagination.pageIndex + 1}
            totalPages={table.getPageCount()}
            searchParams={orderSearchParams}
          />
        </div>
      )}
    </div>
  )
}
