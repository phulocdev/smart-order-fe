'use client'

import tableApiRequest from '@/apiRequests/table.api'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableFooter, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { OrderStatus } from '@/constants/enum'
import { useCheckoutOrdersMutation, useGetOrderListQuery } from '@/hooks/api/useOrder'
import { getErrorMessage } from '@/lib/handle-error'
import { formatNumberToVnCurrency, getBadgeVariantByOrderStatus, getVietnameseOrderStatus } from '@/lib/utils'
import Image from 'next/image'
import { useSearchParams } from 'next/navigation'
import React from 'react'
import { toast } from 'sonner'

export default function Page() {
  const [customerId, setCustomerId] = React.useState<string | undefined>()
  const searchParams = useSearchParams()
  const tableId = searchParams.get('tableId')

  const { data: orderListData } = useGetOrderListQuery({ customerId })
  const orderList = orderListData?.data ?? []
  const orderCanceledOrRejectedLength = orderList.filter((order) =>
    [OrderStatus.Canceled, OrderStatus.Rejected].includes(order.status)
  ).length
  const orderPaidLength = orderList.filter((order) => [OrderStatus.Paid].includes(order.status)).length
  const orderUnPaidLength = orderList.length - orderPaidLength - orderCanceledOrRejectedLength
  const canCompleteOrders = orderList.every((order) =>
    [OrderStatus.Canceled, OrderStatus.Paid, OrderStatus.Rejected, OrderStatus.Served].includes(order.status)
  )

  const tableNumber = orderList[0]?.tableNumber
  const code = orderList[0]?.code
  const totalQuantity = orderList.reduce((result, order) => result + order.quantity, 0)
  const totalPrice = orderList.reduce((result, order) => result + order.totalPrice, 0)

  React.useEffect(() => {
    if (!tableId) return

    const findCustomerId = async () => {
      const {
        data: { customer }
      } = await tableApiRequest.clientGetOne(tableId.toString())
      setCustomerId(customer)
    }

    findCustomerId()
  }, [tableId])

  const { isPending: isCheckoutPending, mutateAsync: checkoutMutateAsync } = useCheckoutOrdersMutation()
  const checkoutOrders = () => {
    if (!customerId) return
    if (orderList.length === orderCanceledOrRejectedLength) {
      toast.promise(checkoutMutateAsync(customerId), {
        loading: 'Đang hoàn tất đơn hàng...',
        success: 'Đã hoàn tất đơn hàng',
        error: (err) => getErrorMessage(err)
      })
      return
    }

    toast.promise(checkoutMutateAsync(customerId), {
      loading: orderUnPaidLength > 0 ? 'Đang thanh toán...' : 'Đang xuất hóa đơn...',
      success: orderUnPaidLength > 0 ? 'Thanh toán thành công' : 'Xuất hóa đơn thành công',
      error: (err) => getErrorMessage(err)
    })
  }
  return (
    <Card className='mx-5 my-12 max-w-[750px] md:mx-auto'>
      <CardHeader>
        <CardTitle className='text-center text-xl md:text-2xl'>Thanh toán - Bàn số {tableNumber}</CardTitle>
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
        <>
          {/* <div className='flex justify-between gap-x-4 pb-1 pt-3'>
            <div>Tổng tiền:</div>
            <Badge variant={'red'} className=''>
              {formatNumberToVnCurrency(totalPrice)}
            </Badge>
          </div> */}
          {/* TH: Tất cả các đơn hàng đã bị HỦY hoặc TỪ CHỐI thì cần hoàn thành đơn hàng */}
          {canCompleteOrders && orderList.length === orderCanceledOrRejectedLength && (
            <Button disabled={isCheckoutPending} className='mt-2 text-sm' onClick={checkoutOrders}>
              Hoàn tất đơn hàng
            </Button>
          )}

          {/* Trong trường hợp mà còn đơn CHƯA THANH TOÁN hoặc ĐÃ THANH TOÁN TẤT CẢ -> cần xuất hóa đơn */}
          {canCompleteOrders && orderList.length !== orderCanceledOrRejectedLength && (
            <Button disabled={isCheckoutPending} className='mt-2 text-sm' onClick={checkoutOrders}>
              {orderUnPaidLength > 0 ? `Thanh toán (${orderUnPaidLength}) phần` : 'Xuất hóa đơn'}
            </Button>
          )}
        </>
      </CardFooter>
    </Card>
  )
}
