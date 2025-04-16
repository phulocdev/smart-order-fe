'use client'
import { DeleteDishDialog } from '@/app/dashboard/dishes/delete-dish-dialog'
import { getColumns } from '@/app/dashboard/dishes/dishes-table-columns'
import UpsertDishDialog from '@/app/dashboard/dishes/upsert-dish-dialog'
import { DataTable } from '@/components/data-table/data-table'
import { DataTableToolbar } from '@/components/data-table/data-table-toolbar'
import { Button } from '@/components/ui/button'
import { PAGINATION } from '@/constants/constants'
import { translateDishKey } from '@/lib/utils'
import { ICategory, IDish } from '@/types/backend.type'
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
import { CirclePlus } from 'lucide-react'
import { useRouter } from 'next/navigation'
import * as React from 'react'

interface DishesTableProps {
  promises: Promise<[Awaited<PaginatedResponse<IDish>>, Awaited<PaginatedResponse<ICategory>>]>
}

export function DishesTable({ promises }: DishesTableProps) {
  const router = useRouter()
  const [sorting, setSorting] = React.useState<SortingState>([{ id: 'createdAt', desc: true }])
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([])
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({
    updatedAt: false,
    createdAt: false
  })
  const [rowSelection, setRowSelection] = React.useState({})

  const [rowAction, setRowAction] = React.useState<DataTableRowAction<IDish> | null>(null)
  const [isCreating, setIsCreating] = React.useState<boolean>(false)
  const isUpdating = rowAction?.type === 'update'
  const [{ data: dishListData }, { data: categoryListData }] = React.use(promises)
  const columns = React.useMemo(() => getColumns({ setRowAction }), [])

  const filterFields: DataTableFilterField<IDish>[] = [
    {
      id: 'title',
      label: 'Tên món ăn',
      placeholder: 'Lọc theo tên món ăn'
    }
  ]

  const table = useReactTable({
    data: dishListData,
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
      <DataTable table={table} tableDivClassName='max-h-[65vh] overflow-y-scroll custom-scrollbar rounded-sm'>
        {/* ------------------------- Add Button - Option 2 (Show Dialog Upsert) ---------------------- */}
        <div className='flex justify-end'>
          <Button onClick={() => setIsCreating(true)}>
            <CirclePlus />
            Thêm món ăn
          </Button>
        </div>
        <DataTableToolbar
          table={table}
          filterFields={filterFields}
          translateHeaderFunc={translateDishKey as any}
        ></DataTableToolbar>
      </DataTable>
      <UpsertDishDialog
        open={isCreating || isUpdating}
        dish={rowAction?.row.original}
        type={isUpdating ? 'update' : 'create'}
        categoryListData={categoryListData}
        onSuccess={() => {
          if (isCreating) setIsCreating(false)
          if (isUpdating) setRowAction(null)
          router.refresh()
        }}
        onOpenChange={() => {
          if (isCreating) setIsCreating(false)
          if (isUpdating) setRowAction(null)
        }}
      />
      <DeleteDishDialog
        open={rowAction?.type === 'delete'}
        onOpenChange={() => setRowAction(null)}
        dish={rowAction?.row.original}
        showTrigger={false}
        onSuccess={() => {
          rowAction?.row.toggleSelected(false)
          setRowAction(null)
          router.refresh()
        }}
      />
    </>
  )
}
