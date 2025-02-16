import React from 'react'
import customerApiRequest from '@/apiRequests/customer.api'
import { cookies } from 'next/headers'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import OrderItemRow from '@/app/customer/_components/order-item-row'
import { formatNumberToVnCurrency } from '@/lib/utils'

export default async function Page() {
  const cookieStore = await cookies()
  const accessToken = cookieStore.get('accessToken')?.value || ''
  const response = await customerApiRequest.sGetOrders(accessToken)
  const orderItems = response.data.items

  // TODO
  if (!orderItems) return <div>Ban chua goi mons</div>

  const table = response.data.table
  return (
    <Card className='mx-auto mt-12 max-w-[750px]'>
      <CardHeader>
        <CardTitle className='text-center text-2xl'>Món ăn đã gọi - Bàn số {table.number}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className='flex flex-col gap-y-6'>
          {orderItems.map((item) => (
            <OrderItemRow key={item._id} item={item} />
          ))}
        </div>
      </CardContent>
      <CardFooter className='flex-col items-start'>
        <div className='flex w-full items-center justify-between'>
          <span className='font-semibold uppercase'>Chưa thanh toán (1 món): </span>
          <span className='text-xl font-bold text-red-600'> {formatNumberToVnCurrency(135000)}</span>
        </div>
        <div className='mt-2 flex w-full items-center justify-between'>
          <span className='font-semibold uppercase'>Đã thanh toán (2 món): </span>
          <span className='text-xl font-bold text-red-600'> {formatNumberToVnCurrency(335000)}</span>
        </div>
      </CardFooter>
    </Card>
  )
}
