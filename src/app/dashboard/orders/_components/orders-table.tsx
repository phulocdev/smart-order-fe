'use client'

import { DeleteOrdersDialog } from '@/app/dashboard/orders/_components/delete-order-dialog'
import { OrdersTableToolbarActions } from '@/app/dashboard/orders/_components/orders-table-toolbar-actions'
import { DataTable } from '@/components/data-table/data-table'
import { DataTableToolbar } from '@/components/data-table/data-table-toolbar'
import { Card, CardContent } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { useDataTable } from '@/hooks/use-data-table'
import { getVietnameseOrderStatusList, translateOrderKey } from '@/lib/utils'
import { useSocket } from '@/providers/socket-provider'
import { IOrder, IStatisticOrders, ITable } from '@/types/backend.type'
import type { DataTableFilterField, DataTableRowAction } from '@/types/data-table.type'
import { ApiResponse, PaginatedResponse } from '@/types/response.type'
import { Banknote, CookingPot, HandPlatter, Loader, Table } from 'lucide-react'
import { useRouter } from 'next/navigation'
import * as React from 'react'
import { toast } from 'sonner'
import { getColumns } from './orders-table-columns'
import StatisticCard from '@/app/dashboard/orders/_components/statistic-card'

interface OrdersTableProps {
  promises: Promise<
    [Awaited<PaginatedResponse<IOrder>>, Awaited<PaginatedResponse<ITable>>, Awaited<ApiResponse<IStatisticOrders[]>>]
  >
}

export function OrdersTable({ promises }: OrdersTableProps) {
  const socket = useSocket()
  const router = useRouter()

  const [{ data: orderData, meta }, { data: tableData }, { data: statisticsByTablesData }] = React.use(promises)
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
      id: 'tableNumber',
      label: 'Số bàn',
      options: tableData?.map((table) => ({
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
      columnPinning: { right: ['actions'] },
      columnVisibility: {
        updatedAt: false
      }
    },
    getRowId: (originalRow) => originalRow._id,
    shallow: false,
    clearOnDefault: true
  })

  React.useEffect(() => {
    if (!socket) return

    // Trong trường hợp JWT Expired thì socket chưa connect đến server đâu nên ở đây sẽ re-connect lại
    if (!socket.connected) {
      // socket.connect()
      router.refresh()
    }

    const onNewOrders = ({ tableNumber, quantity }: { tableNumber: number; quantity: number }) => {
      router.refresh()
      toast('🔔 Đơn hàng mới', { description: `Bàn số ${tableNumber} đã gọi ${quantity} món ăn` })
    }

    socket.on('newOrders', onNewOrders)

    return () => {
      socket.off('newOrders', onNewOrders)
    }
  }, [router, socket])

  return (
    <>
      <div className='flex max-w-[1040px] space-x-4 overflow-x-auto py-4 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-gray-300 dark:[&::-webkit-scrollbar-thumb]:bg-neutral-500 [&::-webkit-scrollbar-track]:rounded-full [&::-webkit-scrollbar-track]:bg-gray-100 dark:[&::-webkit-scrollbar-track]:bg-neutral-700 [&::-webkit-scrollbar]:h-[3px] [&::-webkit-scrollbar]:w-2'>
        {statisticsByTablesData.map((statistic) => (
          <StatisticCard key={statistic.tableNumber} statistic={statistic} />
        ))}
      </div>
      <div className='h-3'></div>
      <DataTable table={table}>
        <DataTableToolbar table={table} filterFields={filterFields} translateHeaderFunc={translateOrderKey as any}>
          <OrdersTableToolbarActions table={table} />
        </DataTableToolbar>
      </DataTable>
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
