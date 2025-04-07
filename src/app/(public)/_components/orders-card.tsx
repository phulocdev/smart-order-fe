'use client'
import QuantitySelect from '@/components/quantity-select'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger
} from '@/components/ui/drawer'
import { HEADER_HEIGHT, QUANTITY_SELECT_MAX } from '@/constants/internal-data'
import { useCreateOrderByCustomerMutation } from '@/hooks/api/useCustomer'
import { useMediaQuery } from '@/hooks/use-media-query'
import { cn, formatNumberToVnCurrency, handleApiError } from '@/lib/utils'
import { useAppStore } from '@/providers/zustand-provider'
import { OrderItemDto } from '@/types/backend.dto'
import { Loader, SquareX } from 'lucide-react'
import { Session } from 'next-auth'
import { useRouter } from 'next/navigation'
import React, { useMemo } from 'react'

interface Props {
  session: Session | null
}

export default function OrdersCard({ session }: Props) {
  const isDesktop = useMediaQuery('(min-width: 1024px)')
  const [open, setOpen] = React.useState(false)

  const orderItems = useAppStore((state) => state.orderItems)
  const totalPrice = useMemo(
    () => orderItems.reduce((result, orderItem) => result + orderItem.price * orderItem.quantity, 0),
    [orderItems]
  )
  const updateOrderItem = useAppStore((state) => state.updateOrderItem)
  const removeOrderItem = useAppStore((state) => state.removeOrderItem)
  const clearOrderInCart = useAppStore((state) => state.clearOrderInCart)

  const router = useRouter()
  const createOrderMutation = useCreateOrderByCustomerMutation()

  const handleRemoveOrder = (dishId: string) => {
    removeOrderItem(dishId)
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

  if (isDesktop) {
    return (
      <Card className={`sticky`} style={{ top: `calc(${HEADER_HEIGHT}px + 2rem)` }}>
        {!session?.customer && (
          <CardHeader>
            <CardTitle className='text-center font-normal'>Vui lòng quét mã QR để có thể gói món!</CardTitle>
          </CardHeader>
        )}
        {session?.customer && orderItems.length == 0 && (
          <CardHeader>
            <CardTitle className='text-center font-normal'>Giỏ hàng của bạn đang trống</CardTitle>
          </CardHeader>
        )}
        <CardContent className='pr-0'>
          <h3 className='py-3 text-center'>Bàn số: {session?.customer?.tableNumber}</h3>
          <div className='custom-scrollbar flex max-h-[350px] flex-col gap-y-2 pr-4 pt-2 text-sm'>
            {orderItems.map((orderItem, index) => (
              <div className='border-b border-b-gray-200 py-2.5 pb-3 last:border-b-0 last:pb-0' key={index}>
                <div className='flex items-start justify-between gap-x-7'>
                  <div>
                    <h3 className='line-clamp-2 font-medium'>{orderItem.dish.title}</h3>
                    <div className={cn('line-clamp-1 text-sm font-normal text-third', { 'mt-2': !!orderItem.note })}>
                      {orderItem.note}
                    </div>
                  </div>
                  <div className='text-[15px] font-extrabold'>
                    {formatNumberToVnCurrency(orderItem.dish.price * orderItem.quantity)}
                  </div>
                </div>
                <div className='mt-2 flex items-center justify-between'>
                  <Button
                    variant={'ghost'}
                    className='-ml-2 font-normal text-third'
                    onClick={() => {
                      handleRemoveOrder(orderItem.dish._id)
                    }}
                  >
                    <span>
                      <SquareX size={16} />
                    </span>
                    <span>Xóa</span>
                  </Button>
                  <QuantitySelect
                    initialValue={orderItem.quantity}
                    max={QUANTITY_SELECT_MAX}
                    onChange={onOrderQuantityChange(orderItem.dish._id)}
                  />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
        <div className='border-t border-t-gray-300 bg-[#F0F0F0] px-4 py-5'>
          <div className='flex justify-between'>
            <div className='text-[15px] font-medium text-neutral-800'>Tổng cộng ({orderItems.length} món):</div>
            <div className='text-lg font-bold text-red-600'>{formatNumberToVnCurrency(totalPrice)}</div>
          </div>
          <div className='pt-3'>
            <Button
              disabled={orderItems.length === 0}
              variant={'red'}
              className={cn('w-full', {
                'cursor-not-allowed opacity-90': orderItems.length === 0 || createOrderMutation.isPending
              })}
              onClick={confirmOrders}
            >
              {createOrderMutation.isPending && <Loader className='mr-2 size-4 animate-spin' aria-hidden='true' />}
              Gọi món
            </Button>
          </div>
        </div>
      </Card>
    )
  }
  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>
        <div
          className={cn(
            'fixed bottom-0 left-0 right-0 flex justify-between bg-third px-5 py-3 text-[13px] uppercase text-third-foreground opacity-95 lg:hidden'
            // { [`bottom-[${ORDER_DRAWER_HEIGHT}px] text-gray-50`]: open, 'bottom-0': !open }
          )}
        >
          <div>
            <span className='pr-1 font-bold'>{orderItems.length}</span>
            <span>món</span>
          </div>
          <span className='font-bold'>{formatNumberToVnCurrency(totalPrice)}</span>
          <span>Xem chi tiết</span>
        </div>
      </DrawerTrigger>
      <DrawerContent className='h-[60vh] rounded-none'>
        <DrawerTitle className=''></DrawerTitle>

        {!session?.customer && (
          <DrawerHeader>
            <DrawerTitle className='text-center text-base font-normal'>
              Vui lòng quét mã QR để có thể gói món!
            </DrawerTitle>
          </DrawerHeader>
        )}
        {session?.customer && orderItems.length == 0 && (
          <DrawerHeader>
            <DrawerTitle className='text-center font-normal'>Giỏ hàng của bạn đang trống</DrawerTitle>
          </DrawerHeader>
        )}

        <div className='custom-scrollbar overflow-y-scroll px-4 py-4'>
          <div className='flex flex-col gap-y-2 pt-2 text-sm'>
            {orderItems.map((orderItem, index) => (
              <div className='border-b border-b-gray-200 pb-7 last:border-b-0 last:pb-0' key={index}>
                <div className='flex items-start justify-between gap-x-7'>
                  <div>
                    <h3 className='line-clamp-2 text-base font-medium'>{orderItem.dish.title}</h3>
                    <div className={cn('line-clamp-1 text-sm font-normal text-third', { 'mt-2': !!orderItem.note })}>
                      {orderItem.note}
                    </div>
                  </div>
                  <div className='text-[15px] font-extrabold'>
                    {formatNumberToVnCurrency(orderItem.dish.price * orderItem.quantity)}
                  </div>
                </div>
                <div className='mt-2 flex items-center justify-between'>
                  <Button
                    variant={'ghost'}
                    className='-ml-2 font-normal text-third'
                    onClick={() => {
                      handleRemoveOrder(orderItem.dish._id)
                    }}
                  >
                    <span>
                      <SquareX size={16} />
                    </span>
                    <span>Xóa</span>
                  </Button>
                  <QuantitySelect
                    initialValue={orderItem.quantity}
                    max={QUANTITY_SELECT_MAX}
                    onChange={onOrderQuantityChange(orderItem.dish._id)}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        <DrawerFooter className='flex flex-row border-t border-t-gray-200 px-0 pb-0 pt-8'>
          <div className='grow border-t border-t-gray-300 bg-[#F0F0F0] px-4 py-5'>
            <div className='flex justify-between'>
              <div className='text-[15px] font-medium text-neutral-800'>Tổng cộng ({orderItems.length} món):</div>
              <div className='text-lg font-bold text-red-600'>{formatNumberToVnCurrency(totalPrice)}</div>
            </div>
            <div className='pt-3'>
              <DrawerClose asChild className='w-full'>
                <Button
                  disabled={orderItems.length === 0}
                  variant={'red'}
                  className={cn('w-full', {
                    'cursor-not-allowed opacity-90': orderItems.length === 0 || createOrderMutation.isPending
                  })}
                  onClick={confirmOrders}
                >
                  {createOrderMutation.isPending && <Loader className='mr-2 size-4 animate-spin' aria-hidden='true' />}
                  Gọi món
                </Button>
              </DrawerClose>
            </div>
          </div>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  )
}
