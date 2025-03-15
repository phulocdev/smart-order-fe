'use client'
import * as React from 'react'
import { DeleteDishDialog } from '@/app/dashboard/dishes/delete-dish-dialog'
import { getColumns } from '@/app/dashboard/dishes/dishes-table-columns'
import { Shell } from '@/components/shell'
import { Button } from '@/components/ui/button'
import { IDish } from '@/types/backend.type'
import { DataTableRowAction } from '@/types/data-table.type'
import { DishesTable } from '@/app/dashboard/dishes/dish-table'
import { useGetDishListQuery, useUpdateDishMutation } from '@/hooks/api/useDish'
import { DishStatus } from '@/constants/enum'
import { toast } from 'sonner'
import { cn, handleApiError } from '@/lib/utils'
import UpsertDishDialog from '@/app/dashboard/dishes/upsert-dish-dialog'
import { Loader } from 'lucide-react'

export default function Page() {
  const [isCreating, setIsCreating] = React.useState<boolean>(false)
  const [rowAction, setRowAction] = React.useState<DataTableRowAction<IDish> | null>(null)
  const isUpdating = rowAction?.type === 'update'

  const { data: dishListData, refetch } = useGetDishListQuery()
  const data = dishListData?.data ?? []
  const updateDishMutation = useUpdateDishMutation()

  const toggleDishAvailability = async ({ id, isUnAvailable }: { id: string; isUnAvailable: boolean }) => {
    try {
      await updateDishMutation.mutateAsync({
        id,
        body: { status: isUnAvailable ? DishStatus.Unavailable : DishStatus.Available }
      })
      toast('✅ Cập nhật trạng thái thành công')
      refetch()
    } catch (error) {
      handleApiError({ error })
    }
  }
  const columns = getColumns({ setRowAction, toggleDishAvailability })

  return (
    <Shell>
      <div className='flex items-start justify-between'>
        <h1 className='text-2xl font-medium'>Danh sách món ăn</h1>
        <Button
          className={cn({
            'cursor-not-allowed opacity-80': updateDishMutation.isPending
          })}
          onClick={() => setIsCreating(true)}
        >
          {updateDishMutation.isPending && <Loader className='mr-2 size-4 animate-spin' aria-hidden='true' />}
          Thêm món
        </Button>
      </div>
      <DishesTable columns={columns} data={data} />

      <UpsertDishDialog
        open={isCreating || isUpdating}
        dish={rowAction?.row.original}
        type={isUpdating ? 'update' : 'create'}
        onSuccess={() => {
          if (isCreating) setIsCreating(false)
          if (isUpdating) setRowAction(null)
          refetch()
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
          refetch()
        }}
      />
    </Shell>
  )
}
