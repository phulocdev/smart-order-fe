'use client'
import React from 'react'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { notFound, useParams, useRouter } from 'next/navigation'
import { useGetOrderDetailQuery, useUpdateOrderMutation } from '@/hooks/api/useOrder'
import { Table, TableBody, TableCell, TableFooter, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { format, getDay } from 'date-fns'
import Image from 'next/image'
import {
  formatNumberToVnCurrency,
  getVietnameseOrderStatus,
  getVietnameseOrderStatusList,
  handleApiError
} from '@/lib/utils'
import { vi } from 'date-fns/locale'
import { Check, ChevronLeft, ChevronsUpDown } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Command, CommandGroup, CommandItem, CommandList } from '@/components/ui/command'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Button } from '@/components/ui/button'
import { OrderStatus } from '@/constants/enum'
import { toast } from '@/hooks/use-toast'
import Link from 'next/link'

const orderStatusList = getVietnameseOrderStatusList()
export default function Page() {
  const params = useParams()
  const id = params.id as string | undefined
  const [open, setOpen] = React.useState(false)
  const [orderStatus, setOrderStatus] = React.useState('')

  const updateOrderMutation = useUpdateOrderMutation()
  const { data: orderData, error } = useGetOrderDetailQuery(id)
  const order = orderData?.data

  if (error) {
    return <div>Đơn hàng không tồn tại</div>
  }

  const updateOrder = async () => {
    if (id) {
      try {
        await updateOrderMutation.mutateAsync({ id, body: { status: orderStatus as OrderStatus } })
        toast({ title: '✅ Cập nhật đơn hàng thành công' })
      } catch (error) {
        handleApiError({ error })
      }
    }
  }

  if (!order) return '... Loading'
  return (
    <div className='container mt-10'>
      <div className='mb-1 flex items-center gap-x-[2px] text-[13px]'>
        <ChevronLeft width={14} height={14} />
        <Link href={'/dashboard/orders'}>Quay lại</Link>
      </div>
      <div className='flex items-start justify-between'>
        <h2 className='text-xl font-medium'>Đơn hàng</h2>
        <Button onClick={updateOrder}>Cập nhật</Button>
      </div>
      <div className='mt-7 grid grid-cols-12 gap-x-8'>
        <div className='col-span-9'>
          <Card>
            <CardHeader className='flex flex-row items-center justify-between'>
              <CardTitle className='text-lg'>Mã đơn: {order.code}</CardTitle>
              <CardDescription>{format(order.createdAt, 'HH:mm:ss dd/M/yyyy', { locale: vi })}</CardDescription>
            </CardHeader>
            <CardContent>
              <Table className='overflow-hidden'>
                <TableHeader>
                  <TableRow>
                    <TableHead>Món ăn</TableHead>
                    <TableHead>Đơn giá</TableHead>
                    <TableHead>Số lượng</TableHead>
                    <TableHead className='text-right'>Tổng tiền</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {order.items.map((orderItem) => (
                    <TableRow key={orderItem._id}>
                      <TableCell>
                        <div className='flex items-start gap-x-3'>
                          <Image
                            src={orderItem.dish.imageUrl}
                            alt={orderItem.dish.title}
                            width={80}
                            height={80}
                            className='h-20 w-20 shrink-0 rounded-md object-cover'
                          />
                          <div className='line-clamp-2 text-sm'>{orderItem.dish.title}</div>
                        </div>
                      </TableCell>
                      <TableCell>{formatNumberToVnCurrency(orderItem.price)}</TableCell>
                      <TableCell className='text-center'>x{orderItem.quantity}</TableCell>
                      <TableCell className='text-right'>
                        {formatNumberToVnCurrency(orderItem.quantity * orderItem.price)}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
                <TableFooter>
                  <TableRow>
                    <TableCell colSpan={3} className='py-3 text-base'>
                      Tổng cộng
                    </TableCell>
                    <TableCell className='text-right text-lg'>{formatNumberToVnCurrency(order.totalPrice)}</TableCell>
                  </TableRow>
                </TableFooter>
              </Table>
            </CardContent>
          </Card>
        </div>
        <div className='col-span-3'>
          <Card>
            <CardContent className='pb-8 pt-5 text-[15px] text-gray-600'>
              <div className='mb-3'>Trạng thái đơn hàng</div>
              <Popover open={open} onOpenChange={setOpen}>
                <PopoverTrigger asChild>
                  <Button variant='outline' role='combobox' aria-expanded={open} className='w-full justify-between'>
                    {orderStatus
                      ? orderStatusList.find((status) => status.value === orderStatus)?.label
                      : getVietnameseOrderStatus(order.status)}
                    <ChevronsUpDown className='opacity-50' />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className='w-[230px] p-0'>
                  <Command>
                    <CommandList>
                      <CommandGroup>
                        {orderStatusList.map((status) => (
                          <CommandItem
                            key={status.value}
                            value={status.value}
                            onSelect={(currentValue) => {
                              setOrderStatus(currentValue === orderStatus ? '' : currentValue)
                              setOpen(false)
                            }}
                          >
                            {status.label}
                            <Check
                              className={cn('ml-auto', orderStatus === status.value ? 'opacity-100' : 'opacity-0')}
                            />
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
