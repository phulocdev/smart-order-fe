import { Badge } from '@/components/ui/badge'
import { formatNumberToVnCurrency } from '@/lib/utils'
import { IOrderItem } from '@/types/backend.type'
import Image from 'next/image'
import React from 'react'

interface Props {
  item: IOrderItem
}

export default function OrderItemRow({ item }: Props) {
  const { dish } = item
  return (
    <div className='grid grid-cols-8 gap-4'>
      <div className='col-span-1'>
        <Image
          src={dish.imageUrl}
          alt={dish.title}
          width={0}
          height={0}
          sizes='100%'
          className='aspect-square w-full rounded-lg object-cover'
        />
      </div>
      <div className='col-span-7'>
        <div className='flex w-full items-center justify-between'>
          <h4>{dish.title}</h4>
          <Badge>Trạng thái: {item.status}</Badge>
        </div>
        <div className='flex w-full items-center justify-between'>
          <span className='block text-sm font-medium italic'>x{item.quantity}</span>
          <span className='mt-2 font-medium'>{formatNumberToVnCurrency(item.price)}</span>
        </div>
      </div>
    </div>
  )
}
