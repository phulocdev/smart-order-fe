'use client'

import React from 'react'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { useGetOrdersByCustomerQuery } from '@/hooks/api/useCustomer'

export default function Page() {
  const { data: orderData, error } = useGetOrdersByCustomerQuery()

  // TODO
  if (error) {
    return <div>Bạn chưa gọi món</div>
  }

  const table = orderData?.data.table
  const orderItems = orderData?.data.items || []

  return (
    <Card className='mx-auto mt-12 max-w-[750px]'>
      <CardHeader>
        <CardTitle className='text-center text-2xl'>Món ăn đã gọi - Bàn số {table?.number}</CardTitle>
      </CardHeader>
      <CardContent></CardContent>
      <CardFooter className='flex-col items-start'></CardFooter>
    </Card>
  )
}
