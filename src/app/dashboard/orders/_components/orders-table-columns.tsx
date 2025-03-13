import type { DataTableRowAction } from '@/types/data-table.type'
import type { ColumnDef } from '@tanstack/react-table'
import { Eye, PenLine, Trash } from 'lucide-react'
import * as React from 'react'

import { DataTableColumnHeader } from '@/components/data-table/data-table-column-header'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'
import {
  formatNumberToVnCurrency,
  getBadgeVariant,
  getVietnameseOrderStatus,
  getVietnameseOrderStatusList,
  translateOrderKey
} from '@/lib/utils'

import orderApiRequest from '@/apiRequests/order.api'
import { OrderStatus } from '@/constants/enum'
import { getErrorMessage } from '@/lib/handle-error'
import { IOrder } from '@/types/backend.type'
import { format } from 'date-fns'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'

interface GetColumnsProps {
  setRowAction: React.Dispatch<React.SetStateAction<DataTableRowAction<IOrder> | null>>
}

export function getColumns({ setRowAction }: GetColumnsProps): ColumnDef<IOrder>[] {
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
          <div className='text-sm font-medium'>{row.original.customer.code}</div>
          <div className='text-xs text-gray-500'>Bàn số: {row.original.table.number}</div>
        </div>
      )
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
      accessorKey: 'totalPrice',
      header: ({ column }) => <DataTableColumnHeader column={column} title={translateOrderKey('totalPrice')} />,
      cell: ({ row }) => {
        return <div className='pl-7'>{formatNumberToVnCurrency(row.original.totalPrice)}</div>
      }
    },
    {
      accessorKey: 'status',
      header: 'Trạng thái',
      cell: ({ row }) => {
        const status: OrderStatus = row.original.status
        return (
          <div className='pl-5'>
            <Badge variant={getBadgeVariant(status)}>{getVietnameseOrderStatus(status)}</Badge>
          </div>
        )
      }
    },
    { accessorKey: 'table', header: '', cell: '', size: 0, enableHiding: false },
    {
      id: 'actions',
      cell: function Cell({ row }) {
        const [isUpdatePending, startUpdateTransition] = React.useTransition()
        const router = useRouter()
        return (
          <div className='flex items-center gap-x-2'>
            <Link href={`/dashboard/orders/${row.original._id}`}>
              <Button size={'icon'} variant={'ghost'}>
                <Eye />
              </Button>
            </Link>
            <DropdownMenu>
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
            </DropdownMenu>
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
