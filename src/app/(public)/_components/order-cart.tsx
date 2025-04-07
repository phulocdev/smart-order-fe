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
import { Session } from 'next-auth'
import Image from 'next/image'
import { useRouter } from 'next/navigation'

const SHEET_FOOTER_HEIGHT = 220

export default function OrderCart({ session }: { session: Session | null }) {
  const orderItems = useAppStore((state) => state.orderItems)
  const updateOrderItem = useAppStore((state) => state.updateOrderItem)
  const removeOrderItem = useAppStore((state) => state.removeOrderItem)
  const clearOrderInCart = useAppStore((state) => state.clearOrderInCart)
  const totalPrice = orderItems.reduce((result, order) => result + order.price * order.quantity, 0)

  const router = useRouter()
  const createOrderMutation = useCreateOrderByCustomerMutation()

  const handleRemoveOrder = (dishId: string) => {
    removeOrderItem(dishId)
  }

  const onOrderNoteChange = (dishId: string) => (noteContent: string) => {
    updateOrderItem(dishId, { note: noteContent })
  }

  const onOrderQuantityChange = (dishId: string) => (quantity: number) => {
    updateOrderItem(dishId, { quantity })
  }

  const confirmOrders = async () => {
    try {
      const items: OrderItemDto[] = orderItems.map((order) => ({ ...order, dish: order.dish._id }))
      await createOrderMutation.mutateAsync({ items })
      clearOrderInCart()
      router.push('/customer/orders')
    } catch (error) {
      handleApiError({ error })
    }
  }

  if (!session?.customer) return
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
      <SheetContent className='w-[80%] md:w-[40%] xl:w-[450px] xl:max-w-none' side={'right'}>
        <SheetHeader>
          <SheetTitle>Món ăn đã chọn - {<span>Bàn số {session.customer.tableNumber}</span>}</SheetTitle>
        </SheetHeader>
        <ScrollArea className={`mt-5 flex h-[calc(100%-${SHEET_FOOTER_HEIGHT}px)] flex-col gap-5`}>
          {orderItems.length === 0 && <div className={`py-40 text-center`}>Bạn chưa chọn món!</div>}
          {orderItems.length > 0 &&
            orderItems.map((order, index) => (
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
                      onSubmit={onOrderNoteChange(order.dish._id)}
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
                  <div className='grid grid-cols-4 items-center gap-x-2'>
                    <div className='col-span-3 md:col-span-2'>
                      <QuantitySelect initialValue={order.quantity} onChange={onOrderQuantityChange(order.dish._id)} />
                    </div>
                    <div className='col-span-1 md:col-start-4'>
                      <div className='text-sm font-semibold text-red-600'>{formatNumberToVnCurrency(order.price)}</div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
        </ScrollArea>
        <div className='absolute bottom-3 left-0 right-0 px-3'>
          <div className='flex items-center justify-between border-t py-7'>
            <div className='flex items-center gap-x-2'>
              <span className='font-semibold uppercase'>Tổng</span>
              <Badge>{orderItems.length} món</Badge>
            </div>
            <span className='font-bold'>{formatNumberToVnCurrency(totalPrice)}</span>
          </div>
          <SheetFooter>
            <SheetClose asChild className='mt-3 md:mt-0'>
              <Button className='w-full' type='submit' variant={'outline'}>
                Thêm món
              </Button>
            </SheetClose>
            <SheetClose asChild>
              <Button className='w-full' type='submit' onClick={confirmOrders}>
                Xác nhận
              </Button>
            </SheetClose>
          </SheetFooter>
        </div>
      </SheetContent>
    </Sheet>
  )
}
