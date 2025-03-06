'use client'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableFooter, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { useGetOrdersByCustomerQuery } from '@/hooks/api/useCustomer'
import { formatNumberToVnCurrency, getVietnameseOrderStatus } from '@/lib/utils'
import Image from 'next/image'
import Link from 'next/link'

export default function Page() {
  const { data: orderData, error, isPending } = useGetOrdersByCustomerQuery()

  if (error) {
    return <div>Bạn chưa gọi món</div>
  }

  const table = orderData?.data.table
  const order = orderData?.data
  const orderItems = order?.items || []

  if (!order || isPending) return <div>Loading...</div>
  return (
    <Card className='mx-auto mt-12 max-w-[750px]'>
      <CardHeader>
        <CardTitle className='text-center text-2xl'>Món ăn đã gọi - Bàn số {table?.number}</CardTitle>
        <div className='flex flex-row items-center justify-between pt-4 text-base'>
          <h2 className='font-medium'>Mã đơn: {order.code}</h2>
          <div className='flex items-center gap-x-1 text-sm'>
            <span className='font-medium'>Tình trạng đơn: </span>
            <Badge>{getVietnameseOrderStatus(order.status)}</Badge>
          </div>
        </div>
      </CardHeader>

      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Món ăn</TableHead>
              <TableHead>Đơn giá</TableHead>
              <TableHead>Số lượng</TableHead>
              <TableHead className='text-right'>Tổng tiền</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {orderItems.map((orderItem) => (
              <TableRow key={orderItem._id}>
                <TableCell>
                  <div className='flex items-start gap-x-2 font-normal'>
                    <Image
                      width={80}
                      height={80}
                      className='h-20 w-20 rounded-sm object-cover'
                      alt={orderItem.dish.title}
                      src={orderItem.dish.imageUrl}
                    />
                    <h3 className='line-clamp-2 w-[300px]'>{orderItem.dish.title}</h3>
                  </div>
                </TableCell>
                <TableCell>{formatNumberToVnCurrency(orderItem.price)}</TableCell>
                <TableCell className='text-center'>{orderItem.quantity}</TableCell>
                <TableCell className='text-right'>
                  {formatNumberToVnCurrency(orderItem.price * orderItem.quantity)}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
          <TableFooter>
            <TableRow>
              <TableCell colSpan={3}>Tổng ({orderItems.length} món):</TableCell>
              <TableCell className='text-right'>{formatNumberToVnCurrency(order.totalPrice)}</TableCell>
            </TableRow>
          </TableFooter>
        </Table>
      </CardContent>
      <CardFooter className='flex-col items-center'>
        <Link href={'/'}>
          <Button variant={'outline'}>Gọi thêm món</Button>
        </Link>
      </CardFooter>
    </Card>
  )
}
