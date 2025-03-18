'use client'

import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { formatNumberToVnCurrency } from '@/lib/utils'
import Image from 'next/image'
import QuantitySelect from '@/components/quantity-select'
import { IDish } from '@/types/backend.type'
import { useAppStore } from '@/providers/zustand-provider'
import OrderNote from '@/app/(public)/_components/order-note'
import { toast } from 'sonner'
import { Session } from 'next-auth'

interface Props {
  dish: IDish
  session: Session | null
}

export default function DishCard({ dish, session }: Props) {
  const orderItems = useAppStore((state) => state.orderItems)
  const addOrderItem = useAppStore((state) => state.addOrderItem)
  const updateOrderItem = useAppStore((state) => state.updateOrderItem)
  const [quantity, setQuantity] = useState<number>(1)
  const [note, setNote] = useState<string>('')

  const onQuantityChange = (newQuantity: number) => {
    setQuantity(newQuantity)
  }

  const onOrderNoteSubmit = (noteContent: string) => {
    setNote(noteContent)
    updateOrderItem(dish._id, { note: noteContent })
  }

  const handleSelectDish = () => {
    if (!session?.customer) {
      toast.error('Vui lòng quét mã QR để có thể đặt món', { icon: '❌' })
      return
    }

    const isExist = orderItems.some((order) => order.dish._id === dish._id)
    if (isExist) {
      updateOrderItem(dish._id, { quantity })
    } else {
      addOrderItem({ dish, note, quantity, price: dish.price })
    }
    setQuantity(1)
    setNote('')
    toast(`🟢 Đã thêm món ăn vào giỏ hàng`, { position: 'top-right' })
  }

  return (
    <div className='grid grid-cols-5 rounded-lg border shadow-sm'>
      <div className='col-span-3'>
        <Image
          src={dish.imageUrl}
          alt={dish.title}
          width={0}
          height={0}
          sizes='100vw'
          className='aspect-square w-full rounded-bl-lg rounded-tl-lg object-cover'
        />
      </div>
      <div className='col-span-2'>
        <div className='px-3 py-1'>
          {/* Note Butotn */}
          <div className='text-right'>
            <OrderNote initialValue={note} onSubmit={onOrderNoteSubmit} dishTitle={dish.title} />
          </div>

          {/* Dish Info */}
          <h4 className='line-clamp-2 h-12 scroll-m-20 font-medium tracking-tight'>{dish.title}</h4>
          <div className='mt-1 text-[15px]'>
            <span>Giá: </span>
            <span className='font-semibold text-red-600'>{formatNumberToVnCurrency(dish.price)}</span>
          </div>
          {/* Quantity Select */}
          <div className='mt-4'>
            <QuantitySelect initialValue={quantity} onChange={onQuantityChange} />
          </div>
          {/* Order Button */}
          <Button onClick={handleSelectDish} className='mt-2 w-full'>
            Đặt món
          </Button>
        </div>
      </div>
    </div>
  )
}
