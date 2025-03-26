import dishApiRequest from '@/apiRequests/dish.api'
import { DataTableColumnHeader } from '@/components/data-table/data-table-column-header'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Switch } from '@/components/ui/switch'
import { DishStatus } from '@/constants/enum'
import { getErrorMessage } from '@/lib/handle-error'
import { formatNumberToVnCurrency, getVietnameseDishStatus, removeVietNamAccent, translateDishKey } from '@/lib/utils'
import { IDish } from '@/types/backend.type'
import type { DataTableRowAction } from '@/types/data-table.type'
import { ColumnDef } from '@tanstack/react-table'
import { format } from 'date-fns'
import { SquarePen, Trash } from 'lucide-react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import * as React from 'react'
import { toast } from 'sonner'

interface GetColumnsProps {
  setRowAction: React.Dispatch<React.SetStateAction<DataTableRowAction<IDish> | null>>
}

export function getColumns({ setRowAction }: GetColumnsProps): ColumnDef<IDish>[] {
  return [
    {
      accessorKey: 'title',
      filterFn: (row, _, filterValue) => {
        const { title } = row.original
        return removeVietNamAccent(title).includes(removeVietNamAccent(filterValue))
      },
      header: translateDishKey('title'),
      cell: ({ row }) => (
        <div className='flex items-start gap-x-3'>
          <Image
            width={128}
            height={128}
            sizes='100vw'
            className='h-32 w-32 rounded-sm object-cover'
            alt={row.original.title}
            src={row.original.imageUrl}
          />
          <div className='line-clamp-2 font-normal'>{row.original.title}</div>
        </div>
      ),
      size: 600
    },
    {
      accessorKey: 'price',
      enableSorting: true,
      header: ({ column }) => <DataTableColumnHeader column={column} title={translateDishKey('price')} />,
      cell: ({ row }) => <div>{formatNumberToVnCurrency(row.original.price)}</div>
    },
    {
      accessorKey: 'description',
      header: translateDishKey('description'),
      cell: ({ row }) => <div>{row.original.description}</div>
    },
    {
      accessorKey: 'status',
      header: translateDishKey('status'),
      cell: ({ row }) => {
        const status = row.original.status
        return (
          <div className=''>
            <Badge>{getVietnameseDishStatus(status)}</Badge>
          </div>
        )
      }
    },
    {
      accessorKey: 'changeStatus',
      header: 'Tạm hết',
      enableHiding: false,
      cell: function Cell({ row }) {
        const status = row.original.status
        const [isUpdatePending, startUpdateTransition] = React.useTransition()
        const router = useRouter()
        return (
          <Switch
            disabled={isUpdatePending}
            checked={status === DishStatus.Unavailable}
            onCheckedChange={(isChecked) => {
              startUpdateTransition(() => {
                toast.promise(
                  dishApiRequest
                    .update({
                      id: row.original._id,
                      body: { status: isChecked ? DishStatus.Unavailable : DishStatus.Available }
                    })
                    .then(() => router.refresh()),
                  {
                    loading: 'Đang cập nhật...',
                    success: 'Cập nhật trạng thái đơn hàng thành công',
                    error: (err) => getErrorMessage(err)
                  }
                )
              })
            }}
          />
        )
      }
    },
    {
      accessorKey: 'createdAt',
      header: ({ column }) => <DataTableColumnHeader column={column} title={translateDishKey('createdAt')} />,
      cell: ({ row }) => (
        <>
          <div>
            <span className='text-xs text-gray-500'>Ngày: </span>
            <span className='text-sm'>{format(row.original.createdAt, 'dd/MM/yyyy')}</span>
          </div>
          <div>
            <span className='text-xs text-gray-500'>Giờ: </span>
            <span className='text-sm'>{format(row.original.createdAt, 'H:mm:ss')}</span>
          </div>
        </>
      )
    },
    {
      accessorKey: 'updatedAt',
      header: ({ column }) => <DataTableColumnHeader column={column} title={translateDishKey('updatedAt')} />,
      cell: ({ row }) => (
        <>
          <div>
            <span className='text-xs text-gray-500'>Ngày: </span>
            <span className='text-sm'>{format(row.original.updatedAt, 'dd/MM/yyyy')}</span>
          </div>
          <div>
            <span className='text-xs text-gray-500'>Giờ: </span>
            <span className='text-sm'>{format(row.original.updatedAt, 'H:mm:ss')}</span>
          </div>
        </>
      )
    },
    {
      id: 'actions',
      enableHiding: false,
      cell: function Cell({ row }) {
        return (
          <div className='flex items-center gap-x-2'>
            <Button
              onClick={() => setRowAction({ row, type: 'update' })}
              aria-label='Open menu'
              variant='ghost'
              className='flex size-8 p-0 data-[state=open]:bg-muted'
            >
              <SquarePen className='h-3 w-3' aria-hidden='true' />
            </Button>
            <Button
              size={'icon'}
              type='button'
              variant={'ghost'}
              onClick={() => {
                setRowAction({ row, type: 'delete' })
              }}
            >
              <Trash />
            </Button>
          </div>
        )
      },
      size: 80
    }
  ]
}
