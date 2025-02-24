'use client'

import OrderNote from '@/app/(public)/_components/order-note'
import QuantitySelect from '@/components/quantity-select'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger
} from '@/components/ui/sheet'
import { useCreateOrderByCustomerMutation } from '@/hooks/api/useCustomer'
import { formatNumberToVnCurrency, handleApiError } from '@/lib/utils'
import { useAppStore } from '@/providers/zustand-provider'
import { OrderItemDto } from '@/types/backend.dto'
import { ShoppingCart, Trash } from 'lucide-react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import React from 'react'

export default function OrderCart() {
  const customer = useAppStore((state) => state.customer)
  const orderItems = useAppStore((state) => state.orderItems)
  const updateOrderItem = useAppStore((state) => state.updateOrderItem)
  const removeOrderItem = useAppStore((state) => state.removeOrderItem)
  const totalPrice = orderItems.reduce((result, order) => (result += order.price * order.quantity), 0)

  const router = useRouter()
  const createOrder = useCreateOrderByCustomerMutation()

  const handleRemoveOrder = (dishId: string) => {
    removeOrderItem(dishId)
  }

  const onChangeOrderNote = (dishId: string) => (noteContent: string) => {
    updateOrderItem(dishId, { note: noteContent })
  }

  const onChangeOrderQuantity = (dishId: string) => (quantity: number) => {
    updateOrderItem(dishId, { quantity })
  }

  const handleOrder = async () => {
    try {
      const items: OrderItemDto[] = orderItems.map((order) => ({ ...order, dish: order.dish._id }))
      await createOrder.mutateAsync({ items })
      router.push('/customer/orders')
    } catch (error) {
      handleApiError({ error })
    }
  }

  if (!customer) return
  return (
    <Sheet>
      <SheetTrigger>
        <div className='motion-preset-bounce flex h-14 w-14 items-center justify-center rounded-md bg-blue-600 text-white'>
          <ShoppingCart size={18} />
          {/* Order Badge (Count) */}
          <div className='motion-preset-pop absolute -left-2 -top-2 flex h-6 w-6 items-center justify-center rounded-full bg-red-500 text-sm text-white'>
            {orderItems.length}
          </div>
        </div>
      </SheetTrigger>
      <SheetContent className='sm:w-[400px] sm:max-w-[540px] xl:w-[450px] xl:max-w-none' side={'right'}>
        <SheetHeader>
          <SheetTitle>Món ăn đã chọn - {customer && <span>Bàn số {customer.table}</span>}</SheetTitle>
        </SheetHeader>
        <ScrollArea className='mt-5 flex flex-col gap-5'>
          {orderItems.map((order, index) => (
            <div key={index} className='grid grid-cols-5 gap-x-2 px-[18px] py-1 first:pb-3 first:pt-5'>
              <div className='col-span-1'>
                <div className='relative'>
                  <Image
                    src={order.dish.imageUrl}
                    alt={order.dish.title}
                    width={0}
                    height={0}
                    sizes='100vw'
                    className='aspect-square w-full rounded-md object-cover'
                  />
                  <OrderNote
                    initialValue={order.note}
                    dishTitle={order.dish.title}
                    onSubmit={onChangeOrderNote(order.dish._id)}
                    className='absolute -left-4 -top-5 z-20 border border-gray-200 bg-white shadow-2xl'
                  />
                </div>
              </div>
              <div className='col-span-4'>
                <div className='flex items-start justify-between'>
                  <h5 className='line-clamp-1 text-[15px]'>{order.dish.title}</h5>
                  <Button onClick={() => handleRemoveOrder(order.dish._id)} variant={'ghost'} size={'icon'}>
                    <Trash />
                  </Button>
                </div>
                <div className='grid grid-cols-4 items-center'>
                  <div className='col-span-2'>
                    <QuantitySelect initialValue={order.quantity} onChange={onChangeOrderQuantity(order.dish._id)} />
                  </div>
                  <div className='col-span-1 col-start-4'>
                    <div className='text-sm font-semibold text-red-600'>{formatNumberToVnCurrency(order.price)}</div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </ScrollArea>
        <div className='absolute bottom-3 left-0 right-0 px-3'>
          <div className='sh flex items-center justify-between border-t py-7'>
            <div className='flex items-center gap-x-2'>
              <span className='font-semibold uppercase'>Tổng</span>
              <Badge>{orderItems.length} món</Badge>
            </div>
            <span className='font-bold'>{formatNumberToVnCurrency(totalPrice)}</span>
          </div>
          <SheetFooter>
            <SheetClose asChild>
              <Button className='w-full' type='submit' variant={'outline'}>
                Thêm món
              </Button>
            </SheetClose>
            <SheetClose asChild>
              <Button className='w-full' type='submit' onClick={handleOrder}>
                Xác nhận
              </Button>
            </SheetClose>
          </SheetFooter>
        </div>
      </SheetContent>
    </Sheet>
  )
}
