'use client'
import { getColumns } from '@/app/dashboard/orders/create/create-orders-table-columns'
import { DataTable } from '@/components/data-table/data-table'
import { DataTableToolbar } from '@/components/data-table/data-table-toolbar'
import { TableCell, TableRow } from '@/components/ui/table'
import { PAGINATION } from '@/constants/constants'
import { formatNumberToVnCurrency, translateDishKey } from '@/lib/utils'
import { useAppStore } from '@/providers/zustand-provider'
import { IDish } from '@/types/backend.type'
import { DataTableFilterField } from '@/types/data-table.type'
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

interface CreateOrdersTableProps {
  dishData: IDish[]
}

export function CreateOrdersTable({ dishData }: CreateOrdersTableProps) {
  const selectedOrderItems = useAppStore((state) => state.orderItems)
  const addOrderItem = useAppStore((state) => state.addOrderItem)
  const updateOrderItem = useAppStore((state) => state.updateOrderItem)
  const removeOrderItem = useAppStore((state) => state.removeOrderItem)
  const clearOrderInCart = useAppStore((state) => state.clearOrderInCart)

  const totalPrice = React.useMemo(() => {
    return selectedOrderItems.reduce((result, orderItem) => result + orderItem.quantity * orderItem.dish.price, 0)
  }, [selectedOrderItems])

  const [sorting, setSorting] = React.useState<SortingState>([{ id: 'createdAt', desc: true }])
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([])
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({})
  const [rowSelection, setRowSelection] = React.useState({})

  const handleSelectOrder = React.useCallback(
    (dish: IDish) => (quantity: number) => {
      const selectedOrderItemIdx = selectedOrderItems.findIndex((orderItem) => orderItem.dish._id === dish._id)
      const selectedOrder = selectedOrderItems[selectedOrderItemIdx]

      // TH1: Thêm mới
      if (selectedOrderItemIdx < 0) {
        return addOrderItem({ dish, note: '', price: dish.price, quantity })
      }

      // TH2: Xóa
      if (quantity === 0) {
        return removeOrderItem(dish._id)
      }
      // TH3: Cập nhật - select quantity phải !== 0
      if (selectedOrder.quantity !== quantity) {
        return updateOrderItem(dish._id, { quantity })
      }
    },
    [addOrderItem, removeOrderItem, selectedOrderItems, updateOrderItem]
  )

  const columns = React.useMemo(
    () => getColumns({ selectedOrderItems, handleSelectOrder }),
    [handleSelectOrder, selectedOrderItems]
  )

  const filterFields: DataTableFilterField<IDish>[] = [
    {
      id: 'title',
      label: 'Tên món ăn',
      placeholder: 'Lọc theo tên món ăn'
    }
  ]

  const table = useReactTable({
    data: dishData,
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
      columnVisibility: {
        createdAt: false
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

  React.useEffect(() => {
    return () => {
      clearOrderInCart()
    }
  }, [clearOrderInCart])

  return (
    <>
      <DataTable
        table={table}
        tableFooterContent={
          <TableRow>
            <TableCell colSpan={1}>Tổng ({selectedOrderItems.length} món):</TableCell>
            <TableCell colSpan={4} className='text-right text-lg font-semibold'>
              {formatNumberToVnCurrency(totalPrice)}
            </TableCell>
          </TableRow>
        }
      >
        <DataTableToolbar
          table={table}
          filterFields={filterFields}
          translateHeaderFunc={translateDishKey as any}
        ></DataTableToolbar>
      </DataTable>
    </>
  )
}
