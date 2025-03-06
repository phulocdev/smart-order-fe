import React from 'react'
import { PAGINATION } from '@/constants/constants'
import { PaginatedResponse } from '@/types/response.type'
import { DateRangeQuery, PaginationQuery, TQueryParams } from '@/types/search-params.type'
import { UseQueryResult } from '@tanstack/react-query'
import {
  ColumnDef,
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
import { endOfWeek, format, startOfToday, startOfWeek } from 'date-fns'
import { isUndefined, omitBy } from 'lodash'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import qs from 'qs'
import { cn, getVietnameseOrderStatusList } from '@/lib/utils'
import AdvanceDateRange from '@/components/advance-date-range'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Button } from '@/components/ui/button'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import TableSkeleton from '@/components/table-skeleton'
import NumberedPagination from '@/components/numbered-pagination'
import { vi } from 'date-fns/locale'

interface DataTableProps<TData, TValue> {
  // Required Type
  columns: ColumnDef<TData, TValue>[]
  useDataQuery: (params?: DateRangeQuery & PaginationQuery) => UseQueryResult<PaginatedResponse<TData>, Error>

  // Query By Date Range Type
  initialFromDate?: Date
  initialToDate?: Date
  isQueryByDateRange?: boolean

  // Sync and Get State From URL
  filterColumnKeys?: Array<keyof TData>
  getStateFromUrl?: false

  paginationType?: 'numbered' | 'simple' // Numbered: có thêm các nút bấm chuyển trang với số trang tương ứng | Simple: chỉ gồm các nút next và prev
  contentActionButton?: React.ReactNode
  hrefActionButton?: string
}

export default function DataTable<TData, TValue>({
  columns,
  useDataQuery,
  initialFromDate = startOfWeek(startOfToday(), { locale: vi }),
  initialToDate = endOfWeek(startOfToday(), { locale: vi }),
  filterColumnKeys,
  isQueryByDateRange,
  paginationType = 'simple',
  getStateFromUrl = false,
  contentActionButton,
  hrefActionButton = '#'
}: DataTableProps<TData, TValue>) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const queryParams: TQueryParams | undefined = React.useMemo(() => {
    if (!getStateFromUrl || !filterColumnKeys) return undefined

    return omitBy(
      {
        page: searchParams.get('page') || 1,
        sort: searchParams.get('sort') ?? undefined,
        from: searchParams.get('from') ?? undefined,
        to: searchParams.get('to') ?? undefined,
        // FilterColumn Params
        ...filterColumnKeys.reduce(
          (acc, key) => {
            const value = searchParams.get(key as string)
            if (value !== null) acc[key as string] = value
            return acc
          },
          {} as Record<string, string>
        )
      },
      isUndefined
    ) as TQueryParams
  }, [getStateFromUrl, searchParams, filterColumnKeys])

  // Sort - Filter - Selection - Visibility - Pagination? Table State
  const initialSorting: SortingState =
    getStateFromUrl && queryParams?.sort
      ? [{ id: queryParams.sort.split('.')[0], desc: queryParams.sort.split('.')[1] === 'desc' }]
      : []
  const initialColumnFilters: ColumnFiltersState =
    getStateFromUrl && queryParams
      ? Object.entries(queryParams)
          .filter(([key]) => !['page', 'sort', 'from', 'to'].includes(key))
          .map(([key, value]) => ({ id: key, value }))
      : []
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({})
  const [rowSelection, setRowSelection] = React.useState({})
  const pageIndex = (Number(queryParams?.page) || 1) - 1
  const [pagination, setPagination] = React.useState({
    pageIndex,
    pageSize: PAGINATION.DEFAULT_PAGE_SIZE
  })

  const dataQueryParams: undefined | (DateRangeQuery & PaginationQuery) = Boolean(isQueryByDateRange)
    ? {
        from: queryParams?.from ?? format(initialFromDate, 'yyyy-M-dd'),
        to: queryParams?.to ?? format(initialToDate, 'yyy y-M-dd')
      }
    : undefined
  const dataQuery = useDataQuery(dataQueryParams)
  const data = dataQuery.data?.data ?? []

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
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
    if (!queryParams || !getStateFromUrl) return
    if (JSON.stringify(prevColumnFilterState.current) === JSON.stringify(columnFilterState)) {
      return
    }
    const timeoutId = setTimeout(() => {
      const objectFilterColumns = Object.fromEntries(columnFilterState.map(({ id, value }) => [id, value]))
      const { page, sort, from, to } = queryParams
      router.replace(`${pathname}?${qs.stringify({ page, sort, from, to, ...objectFilterColumns })}`)
      // Cập nhật lại giá trị mới cho ref
      prevColumnFilterState.current = columnFilterState
    }, 1000)

    return () => clearTimeout(timeoutId)
  }, [queryParams, pathname, router, table, columnFilterState, getStateFromUrl])

  // Tự động sync lên URL những State mặc định (pageIndex + sort)
  React.useEffect(() => {
    if (!Number(searchParams.get('page'))) {
      router.replace(`${pathname}?page=1&sort=createdAt.desc`)
    }
  }, [pathname, router, searchParams])

  // setPagination khi mà chuyển trang - áp dụng với trường hợp mà muốn control Pagination State
  // Nếu để cho tanstack table kiểm soát state thì không cần thực hiện useEffect ở dưới + định nghĩa là PaginationState ở trên
  React.useEffect(() => {
    if (getStateFromUrl) {
      setPagination((state) => ({ ...state, pageIndex }))
    }
  }, [pageIndex, getStateFromUrl])

  return (
    <div>
      <div className={cn('grid gap-2')}>
        {isQueryByDateRange && queryParams && (
          <AdvanceDateRange
            fromDate={queryParams?.from ?? format(initialFromDate, 'yyyy-M-dd')}
            toDate={queryParams?.to ?? format(initialToDate, 'yyyy-M-dd')}
            searchParams={queryParams}
          />
        )}
        {filterColumnKeys && (
          <div className='flex justify-between pb-4 pt-2'>
            <div className='flex items-center gap-x-4'>
              {filterColumnKeys.map((key) => {
                const column = table.getColumn(key as string)
                if (!column) return null

                // Kiểm tra nếu kiểu dữ liệu của key là string thì render Input
                if (typeof queryParams?.[key as string] === 'string') {
                  return (
                    <Input
                      key={key as string}
                      placeholder={`Lọc theo ${key as string}`}
                      value={(column.getFilterValue() as string) ?? ''}
                      onChange={(event) => column.setFilterValue(event.target.value)}
                      className='max-w-[220px]'
                    />
                  )
                }
                // Kiểm tra nếu key là Enum (ví dụ: status)
                if (key === 'status') {
                  return (
                    <Select key={key as string} onValueChange={(value) => column.setFilterValue(value)}>
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
                  )
                }
                return null
              })}
            </div>
            {contentActionButton && (
              <Button type='button' className='ml-auto' onClick={() => router.replace(hrefActionButton)}>
                {contentActionButton}
              </Button>
            )}
          </div>
        )}
        {/* <div className='flex items-center gap-x-4 pb-4 pt-2'>
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
        </div> */}
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
          {dataQuery.isPending && <TableSkeleton columns={5} />}
          {!dataQuery.isPending && (
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
      {dataQuery.data?.data && (
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
          {paginationType === 'numbered' && (
            <NumberedPagination
              currentPage={table.getState().pagination.pageIndex + 1}
              totalPages={table.getPageCount()}
              onChange={(pageIndex: number) => setPagination((prev) => ({ ...prev, pageIndex }))}
              searchParams={queryParams}
            />
          )}
          {paginationType === 'simple' && (
            <div className='space-x-2'>
              <Button
                variant='outline'
                size='sm'
                type='button'
                onClick={() => setPagination((prev) => ({ ...prev, pageIndex: prev.pageIndex - 1 }))}
                disabled={!table.getCanPreviousPage()}
              >
                <ChevronLeft />
              </Button>
              <Button
                type='button'
                variant='outline'
                size='sm'
                onClick={() => setPagination((prev) => ({ ...prev, pageIndex: prev.pageIndex + 1 }))}
                disabled={!table.getCanNextPage()}
              >
                <ChevronRight />
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
