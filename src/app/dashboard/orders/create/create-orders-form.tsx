'use client'

import { CreateOrdersTable } from '@/app/dashboard/orders/create/create-orders-table'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { useCreateOrderMutation } from '@/hooks/api/useOrder'
import { cn, getIconOfTableStatus, handleApiError } from '@/lib/utils'
import { useAppStore } from '@/providers/zustand-provider'
import { CreateCustomerBodyType, customerSchema } from '@/schemaValidations/customer.schema'
import { OrderItemDto } from '@/types/backend.dto'
import { IDish, ITable } from '@/types/backend.type'
import { PaginatedResponse } from '@/types/response.type'
import { zodResolver } from '@hookform/resolvers/zod'
import { Check, ChevronLeft, ChevronsUpDown } from 'lucide-react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import * as React from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'

interface CreateOrdersFormProps {
  promises: Promise<[Awaited<PaginatedResponse<IDish>>, Awaited<PaginatedResponse<ITable>>]>
}

export default function CreateOrdersForm({ promises }: CreateOrdersFormProps) {
  const selectedOrderItems = useAppStore((state) => state.orderItems)
  const clearOrderInCart = useAppStore((state) => state.clearOrderInCart)
  const searchParams = useSearchParams()
  const tableNumber = searchParams.get('tableNumber') ?? ''

  const [{ data: dishData }, { data: tableData }] = React.use(promises)
  const tableList = tableData.map((table) => ({
    label: `Bàn số ${table.number}`,
    value: table.number,
    icon: getIconOfTableStatus(table.status),
    status: table.status
  }))

  const createOrderMutation = useCreateOrderMutation()
  // const totalPrice = orderItems.reduce((result, orderItem) => (result += orderItem.price * orderItem.quantity), 0)

  const form = useForm<CreateCustomerBodyType>({
    resolver: zodResolver(customerSchema),
    defaultValues: {
      tableNumber: +tableNumber
    }
  })

  async function onSubmit(values: CreateCustomerBodyType) {
    try {
      const { tableNumber } = values
      if (selectedOrderItems.length === 0) {
        toast.error('Vui lòng chọn món ăn!')
        return
      }
      const items: OrderItemDto[] = selectedOrderItems.map((orderItem) => ({ ...orderItem, dish: orderItem.dish._id }))

      await createOrderMutation.mutateAsync({ tableNumber, items })
      clearOrderInCart()
      toast.success('Tạo mới đơn hàng thành công')
    } catch (error) {
      handleApiError({ error })
    }
  }

  return (
    // <Shell className='gap-2'>
    <div className='p-8'>
      <div className='mb-1 flex items-center gap-x-[2px] text-[13px]'>
        <ChevronLeft width={14} height={14} />
        <Link href={'/dashboard/orders'}>Quay lại</Link>
      </div>
      <div className='flex items-start justify-between'>
        <h2 className='text-xl font-semibold'>Tạo đơn hàng</h2>
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
                              <CommandInput placeholder='Nhập số bàn...' className='h-9' />
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
                                        {table.icon && <table.icon />}
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
                          <CreateOrdersTable dishData={dishData} />
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
    </div>
    // </Shell>
  )
}
