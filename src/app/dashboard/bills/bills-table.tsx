'use client'
import { getColumns } from '@/app/dashboard/bills/bills-table-columns'
import ViewDetailInvoiceDialog from '@/app/dashboard/bills/view-detail-bill'
import { DataTable } from '@/components/data-table/data-table'
import { DataTableToolbar } from '@/components/data-table/data-table-toolbar'
import { PAGINATION } from '@/constants/constants'
import { translateDishKey } from '@/lib/utils'
import { IBill } from '@/types/backend.type'
import { DataTableFilterField, DataTableRowAction } from '@/types/data-table.type'
import { PaginatedResponse } from '@/types/response.type'
import {
  ColumnFiltersState,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
  VisibilityState
} from '@tanstack/react-table'
import * as React from 'react'

interface BillsTableProps {
  promise: Promise<Awaited<PaginatedResponse<IBill>>>
}

export function BillsTable({ promise }: BillsTableProps) {
  const [sorting, setSorting] = React.useState<SortingState>([{ id: 'createdAt', desc: true }])
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([])
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({})
  const [rowSelection, setRowSelection] = React.useState({})

  const [rowAction, setRowAction] = React.useState<DataTableRowAction<IBill> | null>(null)
  const { data } = React.use(promise)
  const columns = React.useMemo(() => getColumns(), [])

  const filterFields: DataTableFilterField<IBill>[] = [
    {
      id: 'billCode',
      label: 'Mã phiếu',
      placeholder: 'Lọc theo mã phiếu tính tiền'
    }
  ]

  const table = useReactTable({
    data,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    initialState: {
      pagination: {
        pageIndex: PAGINATION.DEFAUT_PAGE_INDEX - 1,
        pageSize: PAGINATION.DEFAULT_PAGE_SIZE
      },
      columnPinning: { right: ['actions'] }
    },
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection
    }
  })

  return (
    <>
      <DataTable table={table} actionType='view' setRowAction={setRowAction}>
        <DataTableToolbar
          table={table}
          filterFields={filterFields}
          translateHeaderFunc={translateDishKey as any}
        ></DataTableToolbar>
      </DataTable>
      <ViewDetailInvoiceDialog
        open={rowAction?.type === 'view'}
        onOpenChange={() => setRowAction(null)}
        bill={rowAction?.row.original}
        showTrigger={false}
        onSuccess={() => {}}
      />
    </>
  )
}
