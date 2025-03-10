import HeaderColumn from '@/components/header-column'
import QuantitySelect from '@/components/quantity-select'
import { formatNumberToVnCurrency, removeVietNamAccent } from '@/lib/utils'
import { OrderItemState } from '@/providers/zustand-provider'
import { IDish } from '@/types/backend.type'
import { ColumnDef } from '@tanstack/react-table'
import Image from 'next/image'

export default function getDishColumns({
  handleSelectOrder,
  orderItems
}: {
  handleSelectOrder: (dish: IDish) => (quantity: number) => void
  orderItems: OrderItemState[]
}) {
  const columns: ColumnDef<IDish>[] = [
    {
      accessorKey: 'title',
      header: 'Món ăn',
      filterFn: (row, _, filterValue) => {
        const columnValue = row.original.title
        return removeVietNamAccent(columnValue).includes(removeVietNamAccent(filterValue))
      },
      cell: ({ row }) => (
        <div className='flex items-start gap-x-3'>
          <Image
            width={80}
            height={80}
            className='aspect-square w-20 rounded-md object-cover'
            src={row.original.imageUrl}
            alt={row.original.title}
          />
          <div>
            <h3 className='text-sm'>{row.original.title}</h3>
          </div>
        </div>
      )
    },
    {
      accessorKey: 'price',
      header: ({ column }) => <HeaderColumn column={column}>Đơn giá</HeaderColumn>,
      cell: ({ row }) => <div className='max-w-[100px] text-right'>{formatNumberToVnCurrency(row.original.price)}</div>
    },
    {
      accessorKey: 'select',
      enableSorting: false,
      enableColumnFilter: false,
      header: () => <div className='text-left'>Số lượng</div>,
      cell: ({ row }) => (
        <div className='max-w-[150px]'>
          <QuantitySelect
            initialValue={orderItems.find((item) => item.dish._id === row.original._id)?.quantity ?? 0}
            min={0}
            onChange={handleSelectOrder(row.original)}
          />
        </div>
      )
    },
    {
      accessorKey: 'totalPrice',
      header: () => <div>Tổng tiền</div>,
      cell: ({ row }) => <div>{formatNumberToVnCurrency(row.original.price)}</div>
    }
  ]
  return columns
}
