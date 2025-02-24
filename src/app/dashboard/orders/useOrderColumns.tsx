'use client'
import React from 'react'
import { Button } from '@/components/ui/button'
import { formatNumberToVnCurrency, getVietnameseOrderStatus } from '@/lib/utils'
import { ColumnDef } from '@tanstack/react-table'
import { format } from 'date-fns'
import { IOrder } from '@/types/backend.type'
import { Badge } from '@/components/ui/badge'
import Link from 'next/link'
import { Ellipsis, Eye } from 'lucide-react'
import { usePathname, useRouter } from 'next/navigation'
import { OrderSearchParamsType } from '@/types/search-params.type'
import HeaderTable from '@/components/header-table'

export default function useOrderColumns({ orderSearchParams }: { orderSearchParams: OrderSearchParamsType }) {
  const router = useRouter()
  const pathname = usePathname()

  const columns: ColumnDef<IOrder>[] = [
    {
      accessorKey: 'code',
      header: ({ column }) => (
        <HeaderTable column={column} searchParams={orderSearchParams}>
          Mã đơn
        </HeaderTable>
      ),
      cell: ({ row }) => <Badge variant={'ghost'}>{row.original.code}</Badge>
    },
    {
      accessorKey: 'customer',
      header: 'Khách hàng',
      cell: ({ row }) => (
        <div>
          <div className='text-sm'>{row.original.customer.name}</div>
          <div className='text-xs text-gray-500'>Bàn số: {row.original.table.number}</div>
        </div>
      )
    },
    {
      accessorKey: 'createdAt',
      sortingFn: 'datetime',
      header: ({ column }) => (
        <HeaderTable column={column} searchParams={orderSearchParams}>
          <div> Ngày tạo</div>
        </HeaderTable>
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
        <HeaderTable column={column} searchParams={orderSearchParams}>
          Tổng tiền
        </HeaderTable>
      ),
      cell: ({ row }) => {
        return <div className='pl-5'>{formatNumberToVnCurrency(row.original.totalPrice)}</div>
      }
    },
    {
      accessorKey: 'status',
      header: ({ column }) => (
        <HeaderTable column={column} searchParams={orderSearchParams}>
          Trạng thái
        </HeaderTable>
      ),
      cell: ({ row }) => {
        return <Badge variant={'green'}>{getVietnameseOrderStatus(row.original.status)}</Badge>
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
