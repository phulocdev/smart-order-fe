'use client'

import { DeleteOrdersDialog } from '@/app/dashboard/orders/_components/delete-order-dialog'
import { OrdersTableToolbarActions } from '@/app/dashboard/orders/_components/orders-table-toolbar-actions'
import StatisticCard from '@/app/dashboard/orders/_components/statistic-card'
import { DataTable } from '@/components/data-table/data-table'
import { DataTableToolbar } from '@/components/data-table/data-table-toolbar'
import { Role } from '@/constants/enum'
import { useDataTable } from '@/hooks/use-data-table'
import { getVietnameseOrderStatusList, translateOrderKey } from '@/lib/utils'
import { useSocket } from '@/providers/socket-provider'
import { IOrder, IStatisticOrders, ITable } from '@/types/backend.type'
import type { DataTableFilterField, DataTableRowAction } from '@/types/data-table.type'
import { ApiResponse, PaginatedResponse } from '@/types/response.type'
import { Session } from 'next-auth'
import { useRouter } from 'next/navigation'
import * as React from 'react'
import { toast } from 'sonner'
import { getColumns } from './orders-table-columns'

interface OrdersTableProps {
  promises: Promise<
    [Awaited<PaginatedResponse<IOrder>>, Awaited<PaginatedResponse<ITable>>, Awaited<ApiResponse<IStatisticOrders[]>>]
  >
  session: Session | null
}

export function OrdersTable({ promises, session }: OrdersTableProps) {
  const socket = useSocket()
  const router = useRouter()
  const role = session?.account?.role

  const [{ data: orderData, meta }, { data: tableData }, { data: statisticsByTablesData }] = React.use(promises)
  const [rowAction, setRowAction] = React.useState<DataTableRowAction<IOrder> | null>(null)
  const columns = React.useMemo(() => getColumns({ setRowAction, role }), [role])

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

    const onUpdatedOrder = () => {
      router.refresh()
    }

    socket.on('newOrders', onNewOrders)

    socket.on('updatedOrder', onUpdatedOrder)

    return () => {
      socket.off('newOrders', onNewOrders)
      socket.off('updatedOrder', onUpdatedOrder)
    }
  }, [router, socket])

  return (
    <>
      {session?.account?.role !== Role.Chef && (
        <div className='custom-scrollbar flex max-w-[1040px] space-x-4 overflow-x-auto py-4'>
          {statisticsByTablesData.map((statistic) => (
            <StatisticCard key={statistic.tableNumber} statistic={statistic} />
          ))}
        </div>
      )}
      <DataTable className='mt-3' table={table} tableDivClassName='max-h-[65vh] custom-scrollbar rounded-sm'>
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
