'use client'

import type { DataTableFilterField, DataTableRowAction } from '@/types/data-table.type'
import * as React from 'react'
import { DataTable } from '@/components/data-table/data-table'
import { DataTableToolbar } from '@/components/data-table/data-table-toolbar'
import { useDataTable } from '@/hooks/use-data-table'
import { getVietnameseOrderStatusList, translateOrderKey } from '@/lib/utils'
import { IOrder, ITable } from '@/types/backend.type'
import { PaginatedResponse } from '@/types/response.type'
import { getColumns } from './orders-table-columns'
import { OrdersTableToolbarActions } from '@/app/dashboard/orders/_components/orders-table-toolbar-actions'
import { UpdateOrderSheet } from '@/app/dashboard/orders/_components/update-order-sheet'
import { DeleteOrdersDialog } from '@/app/dashboard/orders/_components/delete-order-dialog'

interface OrdersTableProps {
  promises: Promise<[Awaited<PaginatedResponse<IOrder>>, Awaited<PaginatedResponse<ITable>>]>
}

export function OrdersTable({ promises }: OrdersTableProps) {
  const [{ data: orderData, meta }, { data: tableData }] = React.use(promises)

  const [rowAction, setRowAction] = React.useState<DataTableRowAction<IOrder> | null>(null)

  const columns = React.useMemo(() => getColumns({ setRowAction }), [])

  /**
   * This component can render either a faceted filter or a search filter based on the `options` prop.
   *
   * @prop options - An array of objects, each representing a filter option. If provided, a faceted filter is rendered. If not, a search filter is rendered.
   *
   * Each `option` object has the following properties:
   * @prop {string} label - The label for the filter option.
   * @prop {string} value - The value for the filter option.
   * @prop {React.ReactNode} [icon] - An optional icon to display next to the label.
   * @prop {boolean} [withCount] - An optional boolean to display the count of the filter option.
   */
  const filterFields: DataTableFilterField<IOrder>[] = [
    {
      id: 'code',
      label: 'Mã đơn hàng',
      placeholder: 'Lọc theo mã đơn hàng'
    },
    {
      id: 'customer',
      label: 'Mã khách hàng',
      placeholder: 'Lọc theo mã khách hàng'
    },
    {
      id: 'status',
      label: 'Trạng thái',
      options: getVietnameseOrderStatusList().map((status) => status)
    },
    {
      id: 'table',
      label: 'Số bàn',
      options: tableData.map((table) => ({
        label: `Bàn số ${table.number}`,
        value: table.number
      }))
    }
  ]
  const { table } = useDataTable({
    data: orderData,
    columns,
    pageCount: meta.totalPages,
    filterFields,
    // enableAdvancedFilter: enableAdvancedTable,
    initialState: {
      sorting: [{ id: 'createdAt', desc: true }],
      columnPinning: { right: ['actions'] }
    },
    getRowId: (originalRow) => originalRow._id,
    shallow: false,
    clearOnDefault: true
  })

  return (
    <>
      <DataTable table={table}>
        <DataTableToolbar table={table} filterFields={filterFields} translateHeaderFunc={translateOrderKey as any}>
          <OrdersTableToolbarActions table={table} />
        </DataTableToolbar>
      </DataTable>
      <UpdateOrderSheet
        open={rowAction?.type === 'update'}
        onOpenChange={() => setRowAction(null)}
        order={rowAction?.row.original ?? null}
      />
      <DeleteOrdersDialog
        open={rowAction?.type === 'delete'}
        onOpenChange={() => setRowAction(null)}
        orders={rowAction?.row.original ? [rowAction?.row.original] : []}
        showTrigger={false}
        onSuccess={() => rowAction?.row.toggleSelected(false)}
      />
    </>
  )
}
