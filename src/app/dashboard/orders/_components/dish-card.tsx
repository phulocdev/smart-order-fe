import { Badge } from '@/components/ui/badge'
import { formatNumberToVnCurrency } from '@/lib/utils'
import { useAppStore } from '@/providers/zustand-provider'
import { IDish } from '@/types/backend.type'
import Image from 'next/image'
import { toast } from 'sonner'

interface Props {
  dish: IDish
  currentTableNumber?: number
}

export default function DishCard({ dish, currentTableNumber }: Props) {
  const addOrderItem = useAppStore((state) => state.addOrderItem)

  return (
    <div
      className='aspect-square rounded-md border border-blue-200 bg-blue-50 pb-3'
      onClick={() => {
        if (currentTableNumber) {
          addOrderItem(currentTableNumber, { dish, note: '', price: dish.price, quantity: 1 })
          toast.success('Đã thêm món ăn vào giỏ hàng')
        } else {
          toast.error('Vui lòng chọn bàn trước khi thêm món')
        }
      }}
    >
      <div className='relative aspect-video'>
        <Image
          sizes='100vw'
          width={0}
          height={0}
          src={dish.imageUrl}
          alt={dish.title}
          className='h-full w-full rounded-md object-cover'
        />
        <Badge className='absolute -bottom-3 left-[50%] -translate-x-[50%]' variant={'red'}>
          {formatNumberToVnCurrency(dish.price)}
        </Badge>
      </div>
      <div className='line-clamp-2 h-12 px-2 py-3 text-center text-sm font-semibold'>{dish.title}</div>
    </div>
  )
}
