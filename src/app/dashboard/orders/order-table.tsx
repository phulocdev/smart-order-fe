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
import React, { useMemo, useState } from 'react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { useGetOrderListQuery } from '@/hooks/api/useOrder'
import { CirclePlus } from 'lucide-react'
import { cn, getVietnameseOrderStatusList } from '@/lib/utils'
import { endOfMonth, format, startOfMonth, startOfToday } from 'date-fns'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import TableSkeleton from '@/components/table-skeleton'
import useOrderColumns from '@/app/dashboard/orders/useOrderColumns'
import { OrderQuery } from '@/types/search-params.type'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import AdvanceDateRange from '@/components/advance-date-range'
import { omitBy, isUndefined } from 'lodash'
import { PAGINATION } from '@/constants/constants'
import qs from 'qs'
import NumberedPagination from '@/components/numbered-pagination'

// const initialFromDate = format(startOfWeek(startOfToday(), { locale: vi }), 'yyyy-M-dd')
// const initialToDate = format(endOfWeek(startOfToday(), { locale: vi }), 'yyyy-M-dd')

const initialFromDate = format(startOfMonth(startOfToday()), 'yyyy-M-dd')
const initialToDate = format(endOfMonth(startOfToday()), 'yyyy-M-dd')

export function OrderTable() {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const orderSearchParams: OrderQuery = useMemo(
    () =>
      omitBy(
        {
          // chỉ phục vụ cho việc Pagination ở phía client mà thôi - Không liên quan j đến phía backend
          page: searchParams.get('page') || PAGINATION.DEFAUT_PAGE_INDEX,
          sort: searchParams.get('sort') ?? undefined,
          from: searchParams.get('from') ?? undefined,
          to: searchParams.get('to') ?? undefined,
          // Filter column
          code: searchParams.get('code') ?? undefined,
          customer: searchParams.get('customer') ?? undefined,
          status: searchParams.get('status') ?? undefined
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
    pageSize: PAGINATION.DEFAULT_PAGE_SIZE
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

  // Đồng bộ filterColumnState lên URL
  const columnFilterState = table.getState().columnFilters
  const prevColumnFilterState = React.useRef(columnFilterState)
  React.useEffect(() => {
    if (JSON.stringify(prevColumnFilterState.current) === JSON.stringify(columnFilterState)) {
      return
    }
    const timeoutId = setTimeout(() => {
      const objectFilterColumns = Object.fromEntries(columnFilterState.map(({ id, value }) => [id, value]))
      const { page, sort, from, to } = orderSearchParams
      router.replace(`${pathname}?${qs.stringify({ page, sort, from, to, ...objectFilterColumns })}`)
      // Cập nhật lại giá trị mới cho ref
      prevColumnFilterState.current = columnFilterState
    }, 1000)

    return () => clearTimeout(timeoutId)
  }, [orderSearchParams, pathname, router, table, columnFilterState])

  React.useEffect(() => {
    if (!Number(searchParams.get('page'))) {
      router.replace(`${pathname}?page=1&sort=createdAt.desc`)
    }
  }, [pathname, router, searchParams])

  // setState Pagination khi mà chuyển trang
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

        <div className='flex items-center gap-x-4 pb-4 pt-2'>
          {/* TODO: Isolate Filter Column component */}
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
            placeholder='Lọc theo mã khách hàng hoặc số bàn '
            value={(table.getColumn('customer')?.getFilterValue() as string) ?? ''}
            onChange={(event) => table.getColumn('customer')?.setFilterValue(event.target.value)}
            className='max-w-[300px]'
          />
          <Select onValueChange={(status) => table.getColumn('status')?.setFilterValue(status)}>
            <SelectTrigger className='w-[180px]'>
              <SelectValue placeholder={<span className='text-gray-500'>Trạng thái</span>} />
            </SelectTrigger>
            <SelectContent>
              {getVietnameseOrderStatusList().map(({ label, value }, index) => (
                <SelectItem key={index} value={value}>
                  {label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Button className='ml-auto' onClick={() => router.replace('/dashboard/orders/create')}>
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
                onValueChange={(pageSize) => {
                  table.setPageSize(Number(pageSize))
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder={table.getState().pagination.pageSize} />
                </SelectTrigger>
                <SelectContent>
                  {[
                    PAGINATION.DEFAULT_PAGE_SIZE,
                    PAGINATION.DEFAULT_PAGE_SIZE * 2,
                    PAGINATION.DEFAULT_PAGE_SIZE * 4,
                    PAGINATION.DEFAULT_PAGE_SIZE * 5
                  ].map((pageSize) => (
                    <SelectItem key={pageSize} value={pageSize.toString()}>
                      {pageSize}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <NumberedPagination
            currentPage={table.getState().pagination.pageIndex + 1}
            totalPages={table.getPageCount()}
            searchParams={orderSearchParams}
          />
        </div>
      )}
    </div>
  )
}
