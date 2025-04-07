'use client'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableFooter, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { OrderStatus } from '@/constants/enum'
import { formatNumberToVnCurrency, getBadgeVariantByOrderStatus, getVietnameseOrderStatus } from '@/lib/utils'
import { useSocket } from '@/providers/socket-provider'
import { IOrder } from '@/types/backend.type'
import { PaginatedResponse } from '@/types/response.type'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import * as React from 'react'
import { toast } from 'sonner'

interface CustomerOrderProps {
  promise: Promise<Awaited<PaginatedResponse<IOrder>>>
}

export default function CustomerOrder({ promise }: CustomerOrderProps) {
  const { data: orderList } = React.use(promise)
  const socket = useSocket()
  const router = useRouter()

  const totalQuantity = orderList.reduce((result, order) => result + order.quantity, 0)
  const totalPrice = orderList.reduce((result, order) => result + order.totalPrice, 0)

  React.useEffect(() => {
    if (!socket) return

    // Trong trường hợp JWT Expired thì socket chưa connect đến server đâu nên ở đây sẽ re-connect lại
    if (!socket.connected) {
      router.refresh()
    }

    const onUpdatedOrder = ({ dishTitle, status }: { dishTitle: string; status: OrderStatus }) => {
      toast(`📢 Món "${dishTitle}" vừa được chuyển sang trạng thái "${getVietnameseOrderStatus(status)}"`)
      router.refresh()
    }

    socket.on('updatedOrder', onUpdatedOrder)

    return () => {
      socket.off('updatedOrder', onUpdatedOrder)
    }
  }, [router, socket])

  if (orderList.length === 0) {
    return (
      <div className='flex min-h-screen flex-col items-center justify-center gap-3 text-lg'>
        <div>Bạn chưa gọi món</div>
        <Link href={'/'}>
          <Button variant={'default'}>Gọi món tại đây</Button>
        </Link>
      </div>
    )
  }

  const { tableNumber, code } = orderList[0]

  return (
    <Card className='mx-5 my-12 max-w-[750px] md:mx-auto'>
      <CardHeader>
        <CardTitle className='text-center text-xl md:text-2xl'>Món ăn đã gọi - Bàn số {tableNumber}</CardTitle>
        <div className='flex flex-row items-center justify-between pt-4 text-base'>
          <h2 className='text-sm font-semibold md:text-base'>Mã đơn: {code}</h2>
        </div>
      </CardHeader>

      <CardContent>
        <Table divClassname='max-h-[65vh] custom-scrollbar rounded-sm'>
          <TableHeader className='sticky top-0 rounded-sm bg-gray-100'>
            <TableRow>
              <TableHead className='text-gray-700'>Món ăn</TableHead>
              <TableHead className='text-gray-700'>Đơn giá</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {orderList.map((order) => (
              <TableRow key={order._id}>
                <TableCell>
                  <div className='flex items-start gap-x-2 font-normal'>
                    <Image
                      width={80}
                      height={80}
                      sizes='100vw'
                      className='h-20 w-20 rounded-sm object-cover'
                      alt={order.dish?.title ?? ''}
                      src={order.dish?.imageUrl ?? ''}
                    />
                    <div>
                      <h3 className='line-clamp-2 w-52'>{order.dish?.title}</h3>
                      <Badge variant={getBadgeVariantByOrderStatus(order.status)} className='my-1'>
                        {getVietnameseOrderStatus(order.status)}
                      </Badge>
                      <div className='text-[13px] font-medium italic'>x{order.quantity}</div>
                    </div>
                  </div>
                </TableCell>
                <TableCell>{formatNumberToVnCurrency(order.price)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
          <TableFooter className='sticky bottom-0 rounded-sm bg-gray-100'>
            <TableRow>
              <TableCell colSpan={1}>Tổng ({totalQuantity} phần):</TableCell>
              <TableCell className='text-right text-lg font-bold text-red-600'>
                {formatNumberToVnCurrency(totalPrice)}
              </TableCell>
            </TableRow>
          </TableFooter>
        </Table>
      </CardContent>
      <CardFooter className='sticky bottom-0 flex-col items-center'>
        <Link href={'/'}>
          <Button variant={'green'} className=''>
            Gọi thêm món
          </Button>
        </Link>
      </CardFooter>
    </Card>
  )
}
