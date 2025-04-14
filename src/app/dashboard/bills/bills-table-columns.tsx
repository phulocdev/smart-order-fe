import { exportBillToPDF } from '@/app/dashboard/bills/_lib/export-pdf'
import { DataTableColumnHeader } from '@/components/data-table/data-table-column-header'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { formatNumberToVnCurrency, translateBillKey } from '@/lib/utils'
import { IBill } from '@/types/backend.type'
import { DataTableRowAction } from '@/types/data-table.type'
import type { ColumnDef } from '@tanstack/react-table'
import { format } from 'date-fns'
import { Download } from 'lucide-react'

interface GetColumnsProps {
  setRowAction: React.Dispatch<React.SetStateAction<DataTableRowAction<IBill> | null>>
}

export function getColumns({ setRowAction }: GetColumnsProps): ColumnDef<IBill>[] {
  return [
    {
      accessorKey: 'billCode',
      header: translateBillKey('billCode'),
      cell: ({ row }) => (
        <Badge className='cursor-pointer' variant={'ghost'}>
          {row.original.billCode}
        </Badge>
      )
    },
    {
      accessorKey: 'customerCode',
      header: translateBillKey('customerCode'),
      cell: ({ row }) => <div className='text-sm font-medium'>{row.original.customerCode}</div>
    },
    {
      accessorKey: 'totalPrice',
      header: ({ column }) => <DataTableColumnHeader column={column} title={translateBillKey('totalPrice')} />,
      cell: ({ row }) => {
        return <div className='pl-7'>{formatNumberToVnCurrency(+row.original.totalPrice)}</div>
      }
    },
    {
      accessorKey: 'orderItems',
      header: translateBillKey('orderItems'),
      cell: ({ row }) => {
        return <div className='text-sm'>Số lượng đơn hàng ({row.original.orderItems.length})</div>
      }
    },
    {
      accessorKey: 'createdAt',
      header: ({ column }) => <DataTableColumnHeader column={column} title={translateBillKey('createdAt')} />,
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
      header: ({ column }) => <DataTableColumnHeader column={column} title={translateBillKey('updatedAt')} />,
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
      accessorKey: 'account',
      header: translateBillKey('account'),
      cell: ({ row }) => <div className=''>{row.original.account?.fullName}</div>
    },
    {
      id: 'actions',
      cell: function Cell({ row }) {
        return (
          <div className='flex items-center gap-x-2'>
            <Button
              size={'icon'}
              type='button'
              variant={'ghost'}
              onClick={() => {
                setTimeout(() => {
                  setRowAction(null)
                }, 0.1)
                exportBillToPDF(row.original)
              }}
            >
              <Download />
            </Button>
          </div>
        )
      },
      size: 80
    }
  ]
}
