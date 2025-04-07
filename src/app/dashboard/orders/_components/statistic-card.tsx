import { Card, CardContent } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { IStatisticOrders } from '@/types/backend.type'
import { Banknote, CookingPot, HandPlatter, Loader, Table } from 'lucide-react'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import React from 'react'
import { cn, formatNumberToVnCurrency, getIconOfOrderStatus, getVietnameseOrderStatus } from '@/lib/utils'
import { OrderStatus } from '@/constants/enum'
import { HoverCard, HoverCardContent, HoverCardTrigger } from '@/components/ui/hover-card'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import orderApiRequest from '@/apiRequests/order.api'
import { getErrorMessage } from '@/lib/handle-error'

export default function StatisticCard({ statistic }: { statistic: IStatisticOrders }) {
  const router = useRouter()
  const { tableNumber, orders: orderList, statusCounts } = statistic
  const customer = orderList.length > 0 ? orderList[0].customer : undefined
  const totalPrice = orderList.reduce((result, order) => result + order.totalPrice, 0)

  const [isCheckoutPending, startCheckoutTransition] = React.useTransition()
  const checkoutOrders = () => {
    if (!customer) return
    startCheckoutTransition(() => {
      toast.promise(
        orderApiRequest.checkout(customer._id).then(() => router.refresh()),
        {
          loading: 'Đang cập nhật...',
          success: 'Thanh toán thành công',
          error: (err) => getErrorMessage(err)
        }
      )
    })
  }

  return (
    <HoverCard>
      <HoverCardTrigger asChild>
        {/* Nếu không có đơn hàng thì đường link mới naviagte */}
        <Card
          onClick={() => {
            // if (orderList.length !== 0) return
            router.push(`/dashboard/orders/create?tableNumber=${tableNumber}`)
          }}
          key={statistic.tableNumber}
          className={cn('h-full shrink-0 text-sm', { 'cursor-pointer': orderList.length === 0 })}
        >
          <CardContent className='p-0'>
            <div className='flex h-full items-center gap-x-2 px-4 py-3'>
              <div className='shrink-0 font-medium'>
                <div className='flex items-center gap-x-1'>
                  <Table size={20} />
                  <div className='text-[17px]'>{tableNumber}</div>
                </div>
              </div>
              <Separator orientation='vertical' className='mx-1 h-20 w-[1.5px] shrink-0' />
              {orderList.length === 0 && (
                <div className='flex h-[92px] items-center pt-3 text-center text-[15px] capitalize'>Ready</div>
              )}
              {orderList.length > 0 && (
                <div className='flex flex-col gap-y-1'>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger>
                        <div className='flex items-center space-x-2'>
                          <Loader size={14} />
                          <span>{statusCounts.Pending}</span>
                        </div>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>{getVietnameseOrderStatus(OrderStatus.Pending)}</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger>
                        <div className='flex items-center space-x-2'>
                          <CookingPot size={14} />
                          <span>{statusCounts.Cooked}</span>
                        </div>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>{getVietnameseOrderStatus(OrderStatus.Cooked)}</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger>
                        <div className='flex items-center space-x-2'>
                          <HandPlatter size={14} />
                          <span>{statusCounts.Served}</span>
                        </div>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>{getVietnameseOrderStatus(OrderStatus.Served)}</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger>
                        <div className='flex items-center space-x-2'>
                          <Banknote size={14} />
                          <span>{statusCounts.Paid}</span>
                        </div>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>{getVietnameseOrderStatus(OrderStatus.Paid)}</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </HoverCardTrigger>
      {orderList.length > 0 && (
        <HoverCardContent className='w-fit text-sm'>
          <h3 className='pb-2 font-medium'>Chi tiết đơn hàng: Bàn số {tableNumber}</h3>
          <div className='custom-scrollbar flex max-h-36 flex-col gap-y-3 pr-2'>
            {orderList.map((order) => {
              const OrderIcon = getIconOfOrderStatus(order.status)
              const isPaid = order.status === OrderStatus.Paid
              return (
                <div key={order._id} className='flex items-center gap-x-2'>
                  {isPaid && (
                    <Image
                      alt='checkIcon'
                      src={'/check-icon.svg'}
                      width={20}
                      height={20}
                      className='aspect-square w-5 object-cover'
                    />
                  )}
                  {!isPaid && OrderIcon && (
                    <div className='aspect-square w-5'>
                      <OrderIcon size={14} />
                    </div>
                  )}
                  <div className='aspect-square w-8 shrink-0'>
                    <Image
                      src={order.dish?.imageUrl ?? ''}
                      alt={order.dish?.title ?? ''}
                      width={0}
                      height={0}
                      sizes='100vw'
                      className='aspect-square w-full rounded-sm object-cover'
                    />
                  </div>
                  <div>
                    <div className='line-clamp-2 w-40'>{order.dish?.title}</div>
                    <div className='text-xs italic'>x{order.quantity}</div>
                  </div>
                  <div className='text-[13px]'>{formatNumberToVnCurrency(order.price)}</div>
                </div>
              )
            })}
          </div>

          {/* Đơn hàng chưa hoàn tất việc thanh toán */}
          <>
            <div className='flex justify-between gap-x-4 pb-1 pt-3'>
              <div>Tổng tiền:</div>
              <Badge variant={'red'} className=''>
                {formatNumberToVnCurrency(totalPrice)}
              </Badge>
            </div>
            <Button
              disabled={isCheckoutPending}
              className='mt-2 w-full text-sm'
              variant={'outline'}
              onClick={checkoutOrders}
            >
              Thanh toán ({orderList.filter((order) => order.status !== OrderStatus.Paid).length}) đơn
            </Button>
          </>
        </HoverCardContent>
      )}
    </HoverCard>
  )
}
