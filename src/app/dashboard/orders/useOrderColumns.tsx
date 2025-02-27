'use client'
import React from 'react'
import { Button } from '@/components/ui/button'
import { formatNumberToVnCurrency, getBadgeVariant, getVietnameseOrderStatus, removeVietNamAccent } from '@/lib/utils'
import { ColumnDef } from '@tanstack/react-table'
import { format } from 'date-fns'
import { IOrder } from '@/types/backend.type'
import { Badge } from '@/components/ui/badge'
import Link from 'next/link'
import { Ellipsis, Eye } from 'lucide-react'
import { OrderSearchParamsType } from '@/types/search-params.type'
import HeaderColumn from '@/components/header-column'
import { OrderStatus } from '@/constants/enum'

export default function useOrderColumns({ orderSearchParams }: { orderSearchParams: OrderSearchParamsType }) {
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
        const columnValue = removeVietNamAccent(`${row.original.customer.name}${row.original.table.number}`)
        return columnValue.includes(removeVietNamAccent(filterValue))
      },
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
        <HeaderColumn column={column} searchParams={orderSearchParams}>
          <div> Ngày tạo</div>
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
