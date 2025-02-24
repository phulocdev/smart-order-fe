'use client'

import {
  ColumnFiltersState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
  VisibilityState
} from '@tanstack/react-table'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import React, { useMemo, useState } from 'react'
import { Input } from '@/components/ui/input'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Button } from '@/components/ui/button'
import { useGetOrderListQuery } from '@/hooks/api/useOrder'
import { Calendar } from '@/components/ui/calendar'
import { CalendarIcon, CirclePlus } from 'lucide-react'
import { cn } from '@/lib/utils'
import { addDays, endOfWeek, format, startOfToday, startOfWeek } from 'date-fns'
import { DateRange } from 'react-day-picker'
import { useGetTableListQuery } from '@/hooks/api/useTable'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import AutoPagination from '@/components/auto-pagination'
import TableSkeleton from '@/components/table-skeleton'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import useOrderColumns from '@/app/dashboard/orders/useOrderColumns'
import { OrderSearchParamsType } from '@/types/search-params.type'
import queryString from 'query-string'

const DEFAULT_PAGE_SIZE = 1
const initialFromDate = addDays(startOfWeek(startOfToday()), 1)
const initialToDate = addDays(endOfWeek(startOfToday()), 1)

export function DataTable() {
  console.log('DataTable')
  const [dateRange, setDateRange] = React.useState<DateRange | undefined>({
    from: initialFromDate,
    to: initialToDate
  })
  const searchParams = useSearchParams()
  const router = useRouter()
  const pathname = usePathname()
  const orderSearchParams: OrderSearchParamsType = useMemo(
    () => ({
      page: searchParams.get('page') || '1',
      sort: searchParams.get('sort') || 'createdAt.desc'
    }),
    [searchParams]
  )

  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([])
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({})
  const [rowSelection, setRowSelection] = React.useState({})

  const pageIndex = Number(orderSearchParams.page) - 1
  const [pagination, setPagination] = useState({
    pageIndex,
    pageSize: DEFAULT_PAGE_SIZE
  })
  const columns = useOrderColumns({ orderSearchParams })

  const fromDate = dateRange?.from ?? initialFromDate
  const toDate = dateRange?.to ?? initialToDate
  const orderListQuery = useGetOrderListQuery({
    fromDate: fromDate.toISOString(),
    toDate: toDate.toISOString()
  })
  const orderList = orderListQuery.data?.data ?? []

  const table = useReactTable({
    data: orderList,
    columns,
    enableSortingRemoval: true,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    onPaginationChange: setPagination,
    initialState: { sorting: [{ id: 'createdAt', desc: true }] },
    state: {
      pagination,
      columnFilters,
      columnVisibility,
      rowSelection
    }
  })

  React.useEffect(() => {
    if (searchParams.size === 0) {
      router.push(`${pathname}?${queryString.stringify(orderSearchParams)}`)
    }
  }, [orderSearchParams, pathname, router, searchParams.size])

  React.useEffect(() => {
    setPagination((state) => ({ ...state, pageIndex }))
  }, [pageIndex])

  return (
    <div>
      <div className={cn('grid gap-2')}>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              id='date'
              variant={'outline'}
              className={cn('w-[300px] justify-start text-left font-normal', !dateRange && 'text-muted-foreground')}
            >
              <CalendarIcon />
              {dateRange?.from ? (
                dateRange.to ? (
                  <>
                    {format(dateRange.from, 'dd/MM/yyyy')} - {format(dateRange.to, 'dd/MM/yyyy')}
                  </>
                ) : (
                  format(dateRange.from, 'dd/MM/yyyy')
                )
              ) : (
                <span>Từ ngày - Đến ngày</span>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className='w-auto p-0' align='start'>
            <Calendar
              initialFocus
              mode='range'
              defaultMonth={dateRange?.from}
              selected={dateRange}
              onSelect={setDateRange}
              numberOfMonths={2}
            />
          </PopoverContent>
        </Popover>
        <div className='flex items-center gap-x-4 pb-4 pt-2'>
          <Input
            placeholder='Lọc theo mã đơn hàng '
            value={(table.getColumn('code')?.getFilterValue() as string) ?? ''}
            onChange={(event) => table.getColumn('code')?.setFilterValue(event.target.value)}
            className='max-w-[240px]'
          />
          <Input
            placeholder='Lọc theo tên khách hàng hoặc số bàn '
            value={(table.getColumn('customer')?.getFilterValue() as string) ?? ''}
            onChange={(event) => table.getColumn('customer')?.setFilterValue(event.target.value)}
            className='max-w-[300px]'
          />
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
              {orderList.length > 0 ? (
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
