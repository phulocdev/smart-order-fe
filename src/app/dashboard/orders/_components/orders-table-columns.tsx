import type { DataTableRowAction } from '@/types/data-table.type'
import type { ColumnDef } from '@tanstack/react-table'
import { Trash } from 'lucide-react'
import * as React from 'react'

import { DataTableColumnHeader } from '@/components/data-table/data-table-column-header'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import {
  formatNumberToVnCurrency,
  getVietnameseOrderStatus,
  getVietnameseOrderStatusList,
  translateOrderKey
} from '@/lib/utils'

import { canTransitionStatus } from '@/app/dashboard/orders/_lib/order.machine'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { OrderStatus, Role } from '@/constants/enum'
import { useUpdateOrderMutation } from '@/hooks/api/useOrder'
import { getErrorMessage } from '@/lib/handle-error'
import { IOrder } from '@/types/backend.type'
import { format } from 'date-fns'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'

interface GetColumnsProps {
  setRowAction: React.Dispatch<React.SetStateAction<DataTableRowAction<IOrder> | null>>
  role?: Role
}

export function getColumns({ setRowAction, role }: GetColumnsProps): ColumnDef<IOrder>[] {
  return [
    {
      id: 'select',
      header: ({ table }) => (
        <Checkbox
          checked={table.getIsAllPageRowsSelected() || (table.getIsSomePageRowsSelected() && 'indeterminate')}
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label='Select all'
          className='translate-y-0.5'
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label='Select row'
          className='translate-y-0.5'
        />
      ),
      enableSorting: false,
      enableHiding: false,
      size: 40
    },
    {
      accessorKey: 'code',
      header: ({ column }) => <DataTableColumnHeader column={column} title={translateOrderKey('code')} />,
      cell: ({ row }) => <Badge variant={'ghost'}>{row.original.code}</Badge>
    },
    {
      accessorKey: 'customer',
      header: translateOrderKey('customer'),
      cell: ({ row }) => (
        <div>
          <div className='text-sm font-medium'>Bàn số: {row.original.tableNumber}</div>
          <div className='text-[13px] text-gray-500'>{row.original.customer?.code}</div>
        </div>
      )
    },
    {
      accessorKey: 'dish',
      header: translateOrderKey('dish'),
      size: 300,
      cell: ({ row }) => {
        const { dish } = row.original
        return (
          <div className='flex items-start gap-x-3'>
            <div className='relative aspect-square w-16 shrink-0'>
              <Image
                width={0}
                height={0}
                sizes='100vw'
                className='aspect-square w-full rounded-sm object-cover'
                alt={dish?.title ?? ''}
                src={dish?.imageUrl ?? ''}
              />
              {row.original.status === OrderStatus.Pending && (
                <Badge
                  className='absolute -left-4 -top-1 px-1.5 py-0.5 text-[10px] font-medium italic'
                  variant={'destructive'}
                >
                  New
                </Badge>
              )}
            </div>
            <div className='grow text-sm'>
              <h4 className='line-clamp-2 text-ellipsis text-[15px] font-medium'>{dish?.title ?? ''}</h4>
              <span className='italic'>x{row.original.quantity}</span>
            </div>
          </div>
        )
      }
    },
    {
      accessorKey: 'note',
      header: 'Ghi chú',
      cell: ({ row }) => <div className='line-clamp-2'>{row.original.note ? row.original.note : '(Trống)'}</div>
    },
    {
      accessorKey: 'status',
      header: 'Trạng thái',
      cell: function Cell({ row }) {
        const router = useRouter()
        const currentStatus = row.original.status
        const { isPending: isUpdatePending, mutateAsync: updateOrderMutateAsync } = useUpdateOrderMutation()
        return (
          <div className='relative'>
            {currentStatus === OrderStatus.Paid && (
              <div className='absolute -left-2 -top-1 aspect-square w-5'>
                <Image
                  alt='checkIcon'
                  src={'/check-icon.svg'}
                  width={20}
                  height={20}
                  className='aspect-square w-5 object-cover'
                />
              </div>
            )}
            <Select
              disabled={isUpdatePending}
              onValueChange={async (value) => {
                toast.promise(
                  updateOrderMutateAsync({
                    id: row.original._id,
                    body: { status: value as OrderStatus }
                  }).then(() => {
                    router.refresh()
                  }),
                  {
                    loading: 'Đang cập nhật...',
                    success: 'Cập nhật trạng thái đơn hàng thành công',
                    error: (err) => getErrorMessage(err)
                  }
                )
              }}
            >
              <SelectTrigger>
                <SelectValue placeholder={getVietnameseOrderStatus(currentStatus)} />
              </SelectTrigger>
              <SelectContent>
                {getVietnameseOrderStatusList().map(({ label, value }) => {
                  const nextStatus = value
                  return (
                    <SelectItem
                      value={value}
                      key={value}
                      className={!canTransitionStatus(currentStatus, nextStatus) ? 'hidden' : ''}
                    >
                      {label}
                    </SelectItem>
                  )
                })}
              </SelectContent>
            </Select>
          </div>
        )
      }
    },
    {
      accessorKey: 'totalPrice',
      header: ({ column }) =>
        role !== Role.Chef && <DataTableColumnHeader column={column} title={translateOrderKey('totalPrice')} />,
      cell: ({ row }) =>
        role !== Role.Chef && <div className='pl-7'>{formatNumberToVnCurrency(row.original.totalPrice)}</div>,
      size: role === Role.Chef ? 0 : undefined
    },
    {
      accessorKey: 'createdAt',
      header: ({ column }) => <DataTableColumnHeader column={column} title={translateOrderKey('createdAt')} />,
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
      header: ({ column }) => <DataTableColumnHeader column={column} title={translateOrderKey('updatedAt')} />,
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
    { accessorKey: 'tableNumber', header: '', cell: '', size: 0, enableHiding: false },
    {
      id: 'actions',
      cell:
        role !== Role.Chef
          ? function Cell({ row }) {
              // const [isUpdatePending, startUpdateTransition] = React.useTransition()
              // const router = useRouter()
              return (
                <div className='flex items-center gap-x-2'>
                  {/* <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button aria-label='Open menu' variant='ghost' className='flex size-8 p-0 data-[state=open]:bg-muted'>
                  <PenLine className='h-3 w-3' aria-hidden='true' />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align='end' className='w-48'>
                <DropdownMenuRadioGroup
                  value={row.original.status}
                  onValueChange={(value) => {
                    startUpdateTransition(() => {
                      toast.promise(
                        orderApiRequest
                          .update({
                            id: row.original._id,
                            body: { status: value as OrderStatus }
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
                >
                  {getVietnameseOrderStatusList().map(({ label, value }) => (
                    <DropdownMenuRadioItem
                      key={value}
                      value={value}
                      className='block capitalize'
                      disabled={isUpdatePending}
                    >
                      {label}
                    </DropdownMenuRadioItem>
                  ))}
                </DropdownMenuRadioGroup>
              </DropdownMenuContent>
            </DropdownMenu> */}
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
            }
          : () => <div></div>,
      size: role !== Role.Chef ? 80 : 0
    }
  ]
}
