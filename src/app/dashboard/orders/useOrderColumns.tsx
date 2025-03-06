'use client'
import HeaderColumn from '@/components/header-column'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { OrderStatus } from '@/constants/enum'
import { formatNumberToVnCurrency, getBadgeVariant, getVietnameseOrderStatus, removeVietNamAccent } from '@/lib/utils'
import { IOrder } from '@/types/backend.type'
import { OrderQuery } from '@/types/search-params.type'
import { ColumnDef } from '@tanstack/react-table'
import { format, isEqual } from 'date-fns'
import { Ellipsis, Eye } from 'lucide-react'
import Link from 'next/link'

interface Props {
  orderSearchParams: OrderQuery
}

export default function useOrderColumns({ orderSearchParams }: Props) {
  const columns: ColumnDef<IOrder>[] = [
    {
      accessorKey: 'code',
      header: ({ column }) => (
        <HeaderColumn column={column} searchParams={orderSearchParams}>
          Mã đơn
        </HeaderColumn>
      ),
      cell: ({ row }) => <Badge variant={'ghost'}>{row.original.code}</Badge>
    },
    {
      accessorKey: 'customer',
      header: 'Khách hàng',
      filterFn: (row, _, filterValue) => {
        const columnValue = `${row.original.customer.code}${row.original.table.number}`
        return removeVietNamAccent(columnValue).includes(removeVietNamAccent(filterValue))
      },
      cell: ({ row }) => (
        <div>
          <div className='text-sm font-medium'>{row.original.customer.code}</div>
          <div className='text-xs text-gray-500'>Bàn số: {row.original.table.number}</div>
        </div>
      )
    },
    {
      accessorKey: 'createdAt',
      sortingFn: (rowA, rowB) => {
        const timestampA = new Date(rowA.original.createdAt).getTime()
        const timestampB = new Date(rowB.original.createdAt).getTime()

        if (isEqual(timestampA, timestampB)) return 0
        return timestampA > timestampB ? 1 : -1
      },
      // sortingFn: 'datetime',
      header: ({ column }) => (
        <HeaderColumn column={column} searchParams={orderSearchParams}>
          <div>Ngày tạo</div>
        </HeaderColumn>
      ),
      cell: ({ row }) => (
        <>
          <div>
            <span className='text-xs text-gray-500'>Ngày: </span>
            <span className='text-sm'>{format(row.original.createdAt, 'dd/MM/yyyy')}</span>
          </div>
          <div>
            <span className='text-xs text-gray-500'>Giờ: </span>
            <span className='text-sm'>{format(row.original.updatedAt, 'pp')}</span>
          </div>
        </>
      )
    },
    {
      accessorKey: 'totalPrice',
      header: ({ column }) => (
        <HeaderColumn column={column} searchParams={orderSearchParams}>
          Tổng tiền
        </HeaderColumn>
      ),
      cell: ({ row }) => {
        return <div className='pl-7'>{formatNumberToVnCurrency(row.original.totalPrice)}</div>
      }
    },
    {
      accessorKey: 'status',
      header: ({ column }) => (
        <HeaderColumn column={column} searchParams={orderSearchParams}>
          Trạng thái
        </HeaderColumn>
      ),
      cell: ({ row }) => {
        const status: OrderStatus = row.original.status
        return (
          <div className='pl-5'>
            <Badge variant={getBadgeVariant(status)}>{getVietnameseOrderStatus(status)}</Badge>
          </div>
        )
      }
    },
    {
      id: 'viewMore',
      enableHiding: false,
      cell: ({ row }) => {
        return (
          <div className='flex items-center gap-x-2'>
            <Link href={`/dashboard/orders/${row.original._id}`}>
              <Button size={'icon'} variant={'ghost'}>
                <Eye />
              </Button>
            </Link>
            <Button size={'icon'} variant={'ghost'}>
              <Ellipsis />
            </Button>
          </div>
        )
      }
    }
  ]
  return columns
}
