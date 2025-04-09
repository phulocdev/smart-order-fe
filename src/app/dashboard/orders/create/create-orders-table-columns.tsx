import OrderNote from '@/app/(public)/_components/order-note'
import { DataTableColumnHeader } from '@/components/data-table/data-table-column-header'
import QuantitySelect from '@/components/quantity-select'
import { formatNumberToVnCurrency, removeVietNamAccent, translateDishKey } from '@/lib/utils'
import { OrderItemState } from '@/providers/zustand-provider'
import { IDish } from '@/types/backend.type'
import { ColumnDef } from '@tanstack/react-table'
import Image from 'next/image'

interface GetColumnsProps {
  handleSelectOrder: (dish: IDish) => (quantity: number) => void
  selectedOrderItems: OrderItemState[]
}

export function getColumns({ handleSelectOrder, selectedOrderItems }: GetColumnsProps): ColumnDef<IDish>[] {
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
          <div className='relative'>
            <Image
              width={128}
              height={128}
              sizes='100vw'
              className='h-32 w-32 rounded-sm object-cover'
              alt={row.original.title}
              src={row.original.imageUrl}
            />
            <OrderNote className='absolute left-0 top-0' />
          </div>
          <div className='line-clamp-2'>{row.original.title}</div>
        </div>
      )
    },
    {
      accessorKey: 'price',
      enableSorting: true,
      header: ({ column }) => <DataTableColumnHeader column={column} title={translateDishKey('price')} />,
      cell: ({ row }) => <div>{formatNumberToVnCurrency(row.original.price)}</div>
    },
    {
      accessorKey: 'select',
      enableSorting: false,
      enableColumnFilter: false,
      header: 'Số lượng',
      cell: ({ row }) => (
        <div className='max-w-[150px]'>
          <QuantitySelect
            initialValue={selectedOrderItems.find((item) => item.dish._id === row.original._id)?.quantity ?? 0}
            min={0}
            onChange={handleSelectOrder(row.original)}
          />
        </div>
      )
    },
    {
      accessorKey: 'totalPrice',
      header: () => 'Tổng tiền',
      cell: ({ row }) => {
        const quantity = selectedOrderItems.find((orderItem) => orderItem.dish._id === row.original._id)?.quantity ?? 0
        return <div>{formatNumberToVnCurrency(quantity * row.original.price)}</div>
      }
    },
    { accessorKey: 'createdAt', header: '', cell: '', size: 0, enableHiding: false }
  ]
}
