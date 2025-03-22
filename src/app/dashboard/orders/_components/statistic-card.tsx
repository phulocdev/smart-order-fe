import { Card, CardContent } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { IStatisticOrders } from '@/types/backend.type'
import { Banknote, CookingPot, HandPlatter, Loader, Table } from 'lucide-react'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import React from 'react'
import { formatNumberToVnCurrency, getIconOfOrderStatus, getVietnameseOrderStatus } from '@/lib/utils'
import { OrderStatus } from '@/constants/enum'
import { HoverCard, HoverCardContent, HoverCardTrigger } from '@/components/ui/hover-card'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function StatisticCard({ statistic }: { statistic: IStatisticOrders }) {
  const { tableNumber, orders: orderList, statusCounts } = statistic
  const customerCode = orderList.length > 0 ? orderList[0].customer?.code : ''
  const totalPrice = orderList.reduce((result, order) => result + order.totalPrice, 0)
  const totalPaidPrice = orderList
    .filter((order) => order.status === OrderStatus.Paid)
    .reduce((result, order) => result + order.totalPrice, 0)
  const totalUnPaidPrice = totalPrice - totalPaidPrice

  return (
    <HoverCard>
      <HoverCardTrigger>
        <Link href={`/dashboard/orders/create?tableNumber=${tableNumber}`}>
          <Card key={statistic.tableNumber} className='h-full shrink-0 text-sm'>
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
        </Link>
      </HoverCardTrigger>
      {orderList.length > 0 && (
        <HoverCardContent className='w-fit text-sm'>
          <div className='flex justify-between'>
            <h3 className='pb-2 font-medium'>
              Bàn số {tableNumber} - {customerCode}
            </h3>
            <div>{}</div>
          </div>
          <div className='flex flex-col gap-y-3'>
            {orderList.map((order) => {
              const OrderIcon = getIconOfOrderStatus(order.status)
              return (
                <div key={order._id} className='flex items-center gap-x-2'>
                  {OrderIcon && <OrderIcon size={14} />}
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
                  <div className='text-xs'>{formatNumberToVnCurrency(order.price)}</div>
                </div>
              )
            })}
          </div>

          {totalUnPaidPrice > 0 && (
            <div className='flex justify-between pb-1 pt-3'>
              <Badge>Đã thanh toán: {formatNumberToVnCurrency(totalPaidPrice)}</Badge>
              <Badge variant={'destructive'}>Còn lại: {formatNumberToVnCurrency(totalUnPaidPrice)}</Badge>
            </div>
          )}

          {totalUnPaidPrice === 0 && (
            <div className='pb-1 pt-3'>
              <Badge variant={'green'}>Đã thanh toán</Badge>
            </div>
          )}
          {totalUnPaidPrice > 0 && (
            <Button className='mt-2 w-full text-sm' variant={'outline'}>
              Thanh toán ({orderList.length}) đơn
            </Button>
          )}
        </HoverCardContent>
      )}
    </HoverCard>
  )
}
