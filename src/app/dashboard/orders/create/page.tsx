'use client'

import getDishColumns from '@/app/dashboard/orders/create/get-dish-columns'
import { Shell } from '@/components/shell'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { TableStatus } from '@/constants/enum'
import { useCreateOrderMutation } from '@/hooks/api/useOrder'
import { useGetTableListQuery } from '@/hooks/api/useTable'
import { toast } from 'sonner'
import { cn, handleApiError } from '@/lib/utils'
import { OrderItemState } from '@/providers/zustand-provider'
import { CreateCustomerBodyType, customerSchema } from '@/schemaValidations/customer.schema'
import { OrderItemDto } from '@/types/backend.dto'
import { IDish } from '@/types/backend.type'
import { zodResolver } from '@hookform/resolvers/zod'
import { Check, CheckCircle, ChevronLeft, ChevronsUpDown, Users } from 'lucide-react'
import Link from 'next/link'
import { useCallback, useMemo, useState } from 'react'
import { useForm } from 'react-hook-form'
import { DishTableCreateOrder } from '@/app/dashboard/orders/create/dish-table-create-order'

const getStatusIcon = (status: TableStatus) => {
  switch (status) {
    case TableStatus.Available:
      return <CheckCircle />
    case TableStatus.Occupied:
      return <Users />
    default:
      return null
  }
}

export default function Page() {
  const [orderItems, setOrderItems] = useState<OrderItemState[]>([])
  const tableListQuery = useGetTableListQuery()
  const tableList = tableListQuery.data?.data
    ? tableListQuery.data.data.map((table) => ({
        label: `Bàn số ${table.number}`,
        value: table.number,
        icon: getStatusIcon(table.status),
        status: table.status
      }))
    : []

  const totalPrice = orderItems.reduce((result, orderItem) => (result += orderItem.price * orderItem.quantity), 0)
  const createOrderMutation = useCreateOrderMutation()

  const form = useForm<CreateCustomerBodyType>({
    resolver: zodResolver(customerSchema)
  })

  const handleSelectOrder = useCallback(
    (dish: IDish) => (quantity: number) => {
      if (quantity === 0) {
        // Xóa đơn hàng đó ra khỏi danh sách đang lựa chọn
        setOrderItems((prev) => prev.filter((orderItem) => orderItem.dish._id !== dish._id))
      } else {
        setOrderItems((prev) => {
          const targetOrderItemIdx = prev.findIndex((order) => order.dish._id === dish._id)
          if (targetOrderItemIdx < 0) {
            // Thêm mới đơn
            return [...prev, { dish, note: '', price: dish.price, quantity }]
          }
          //Cập nhật số lượng
          const targetOrderItem = prev[targetOrderItemIdx]
          prev[targetOrderItemIdx] = { ...targetOrderItem, quantity }
          return [...prev]
        })
      }
    },
    []
  )

  async function onSubmit(values: CreateCustomerBodyType) {
    try {
      const { tableNumber } = values
      if (orderItems.length === 0) {
        toast('Vui lòng chọn món ăn')
        return
      }
      const items: OrderItemDto[] = orderItems.map((order) => ({ ...order, dish: order.dish._id }))

      await createOrderMutation.mutateAsync({ tableNumber, items })
      toast('Tạo mới đơn hàng thành công')
    } catch (error) {
      handleApiError({ error })
    }
  }
  const columns = useMemo(() => getDishColumns({ handleSelectOrder, orderItems }), [handleSelectOrder, orderItems])
  return (
    <Shell className='gap-2'>
      <div className='mb-1 flex items-center gap-x-[2px] text-[13px]'>
        <ChevronLeft width={14} height={14} />
        <Link href={'/dashboard/orders'}>Quay lại</Link>
      </div>
      <div className='flex items-start justify-between'>
        <h2 className='text-xl font-medium'>Tạo đơn hàng</h2>
      </div>
      <div className='mt-5'>
        <Card>
          <CardContent>
            <div className='py-5'>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-6'>
                  <FormField
                    control={form.control}
                    name='tableNumber'
                    render={({ field }) => (
                      <FormItem className='flex flex-col'>
                        <FormLabel>Số bàn</FormLabel>
                        <Popover>
                          <PopoverTrigger asChild>
                            <FormControl>
                              <Button
                                variant='outline'
                                role='combobox'
                                className={cn('w-[300px] justify-between', !field.value && 'text-muted-foreground')}
                              >
                                {field.value
                                  ? tableList.find((table) => table.value === field.value)?.label
                                  : 'Chọn số bàn'}
                                <ChevronsUpDown className='opacity-50' />
                              </Button>
                            </FormControl>
                          </PopoverTrigger>
                          <PopoverContent className='w-[300px] p-0'>
                            <Command>
                              <CommandInput placeholder='Tìm số bàn...' className='h-9' />
                              <CommandList>
                                <CommandEmpty>Bàn không tồn tại</CommandEmpty>
                                <CommandGroup>
                                  {tableList.map((table) => (
                                    <CommandItem
                                      value={table.value.toString()}
                                      key={table.value}
                                      // className={cn(
                                      //   [TableStatus.Occupied, TableStatus.Reserved].includes(table.status) &&
                                      //     'pointer-events-none cursor-not-allowed'
                                      // )}
                                      onSelect={() => {
                                        form.setValue('tableNumber', table.value)
                                      }}
                                    >
                                      <div className='flex items-center gap-x-2'>
                                        {table.icon}
                                        {table.label}
                                      </div>
                                      <Check
                                        className={cn(
                                          'ml-auto',
                                          table.value === field.value ? 'opacity-100' : 'opacity-0'
                                        )}
                                      />
                                    </CommandItem>
                                  ))}
                                </CommandGroup>
                              </CommandList>
                            </Command>
                          </PopoverContent>
                        </Popover>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    name='orderItems'
                    render={() => (
                      <FormItem>
                        <FormLabel>Danh sách món ăn</FormLabel>
                        <FormControl>
                          <DishTableCreateOrder columns={columns} totalPrice={totalPrice} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <div className='text-right'>
                    <Button type='submit'>Tạo đơn</Button>
                  </div>
                </form>
              </Form>
            </div>
          </CardContent>
        </Card>
      </div>
    </Shell>
  )
}
