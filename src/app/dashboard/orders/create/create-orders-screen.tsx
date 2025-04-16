'use client'

import OrderNote from '@/app/(public)/_components/order-note'
import DishCard from '@/app/dashboard/orders/_components/dish-card'
import TableCard from '@/app/dashboard/orders/_components/table-card'
import QuantitySelect from '@/components/quantity-select'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHeader, TableRow } from '@/components/ui/table'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useCreateOrderMutation } from '@/hooks/api/useOrder'
import { cn, formatNumberToVnCurrency, getVietnameseTableStatusList, handleApiError } from '@/lib/utils'
import { useAppStore } from '@/providers/zustand-provider'
import { OrderItemDto } from '@/types/backend.dto'
import { IDish, ITable } from '@/types/backend.type'
import { PaginatedResponse } from '@/types/response.type'
import { Loader, Trash, X } from 'lucide-react'
import Image from 'next/image'
import React from 'react'
import { toast } from 'sonner'

interface CreateOrdersScreenProps {
  promises: Promise<[Awaited<PaginatedResponse<IDish>>, Awaited<PaginatedResponse<ITable>>]>
}

export default function CreateOrderScreen({ promises }: CreateOrdersScreenProps) {
  const [{ data: dishData }, { data: tableData }] = React.use(promises)
  const [currentTableNumber, setCurrentTableNumber] = React.useState<number | undefined>()
  const orderItemsState = useAppStore((state) => state.orderItems)
  const orderItemsHasOrders = orderItemsState.filter((order) => order.items.length > 0)
  const updateOrderItem = useAppStore((state) => state.updateOrderItem)
  const removeOrderItem = useAppStore((state) => state.removeOrderItem)
  const clearOrderInCart = useAppStore((state) => state.clearOrderInCart)
  const createOrderMutation = useCreateOrderMutation()

  React.useEffect(() => {
    const savedTable = localStorage.getItem('currentServingTable')
    if (!currentTableNumber && savedTable) {
      setCurrentTableNumber(parseInt(savedTable, 10))
    }
  }, [currentTableNumber])

  const selectCurrentTableNumber = (tableNumber: number) => {
    setCurrentTableNumber(tableNumber)
    localStorage.setItem('currentServingTable', tableNumber.toString())
  }

  async function confirmOrders(tableNumber: number) {
    const selectedOrderItems = orderItemsHasOrders.find((order) => order.tableNumber === tableNumber)?.items ?? []

    try {
      if (selectedOrderItems.length === 0) {
        toast.error('Vui lòng chọn món ăn!')
        return
      }
      const items: OrderItemDto[] = selectedOrderItems.map((item) => ({ ...item, dish: item.dish._id }))

      await createOrderMutation.mutateAsync({ tableNumber, items })
      clearOrderInCart(tableNumber)
      toast.success('Tạo mới đơn hàng thành công')
    } catch (error) {
      handleApiError({ error })
    }
  }

  return (
    <div className='grid grid-cols-12'>
      <div className='col-span-7'>
        <Card className='m-5 py-4'>
          <CardContent>
            <Tabs defaultValue='table'>
              <TabsList>
                <TabsTrigger value='table'>Bàn ăn</TabsTrigger>
                <TabsTrigger value='menu'>Thực đơn</TabsTrigger>
              </TabsList>
              <TabsContent value='table'>
                {/* Filter table by status */}
                {/* <div className='flex items-center gap-x-4 pb-5 pt-2'>
                  {getVietnameseTableStatusList().map(({ label, value }) => (
                    <Button className='capitalize' key={value} variant={'outline'}>
                      {label}
                    </Button>
                  ))}
                </div> */}
                <div className='grid h-[78vh] cursor-pointer grid-cols-5 gap-4 overflow-y-scroll [&::-webkit-scrollbar]:w-0'>
                  {tableData.map((table) => (
                    <TableCard
                      key={table._id}
                      table={table}
                      onSelectTable={selectCurrentTableNumber}
                      isSelected={
                        table.number === currentTableNumber ||
                        orderItemsHasOrders.some((order) => order.tableNumber === table.number)
                      }
                      isServing={currentTableNumber === table.number}
                    />
                  ))}
                </div>
              </TabsContent>
              <TabsContent value='menu'>
                <div className='grid h-[78vh] cursor-pointer grid-cols-5 gap-4 overflow-y-scroll [&::-webkit-scrollbar]:w-0'>
                  {dishData.map((dish) => (
                    <DishCard key={dish._id} dish={dish} currentTableNumber={currentTableNumber} />
                  ))}
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
      <div className='col-span-5'>
        <Card className='m-5 py-4'>
          <CardContent>
            <Tabs defaultValue={undefined}>
              <TabsList
                className={cn(
                  'h-full w-full justify-start gap-x-5 overflow-x-scroll px-2 pb-3 pt-5 [&::-webkit-scrollbar]:h-0 [&::-webkit-scrollbar]:w-0',
                  {
                    'p-0': orderItemsHasOrders.length === 0
                  }
                )}
              >
                {/* {orderItemsHasOrders.length === 0 && (
                <Button variant={'outline'} size={'icon'}>
                  <Plus />
                </Button>
              )} */}
                {orderItemsHasOrders.map((orderItems, index) => {
                  return (
                    <TabsTrigger key={index} value={orderItems.tableNumber.toString()} className='relative'>
                      Bàn số {orderItems.tableNumber}
                      <div
                        onClick={() => {
                          clearOrderInCart(orderItems.tableNumber)
                        }}
                        className='absolute -right-2.5 -top-3.5 flex aspect-square w-6 items-center justify-center rounded-full border border-gray-300 bg-white shadow-sm hover:bg-gray-200'
                      >
                        <X size={14} />
                      </div>
                    </TabsTrigger>
                  )
                })}
              </TabsList>
              {orderItemsHasOrders.length === 0 && (
                <div className='flex h-[80vh] items-center justify-center'>Vui lòng chọn bàn để có thể đặt món !</div>
              )}
              {orderItemsHasOrders.map((order) => {
                const totalPortion = order.items.reduce((result, order) => result + order.quantity, 0)
                const totalPrice = order.items.reduce((result, order) => result + order.quantity * order.dish.price, 0)
                return (
                  <TabsContent value={order.tableNumber.toString()} key={order.tableNumber}>
                    <div className='h-[78vh]'>
                      <Table divClassname='h-[66vh] custom-scrollbar rounded-sm overflow-y-scroll [&::-webkit-scrollbar]:h-0'>
                        <TableHeader className='sticky top-0 rounded-sm bg-gray-100'></TableHeader>
                        <TableBody>
                          {order.items.map((item) => {
                            return (
                              <TableRow key={`${order.tableNumber}${item.dish._id}`}>
                                <TableCell>
                                  <div className='py-4 text-base'>
                                    <div className='flex items-center gap-x-3'>
                                      <OrderNote
                                        initialValue={item.note}
                                        dishTitle={item.dish.title}
                                        onSubmit={(noteContext) => {
                                          updateOrderItem(order.tableNumber, item.dish._id, { note: noteContext })
                                        }}
                                      />
                                      <h3 className='line-clamp-2 w-52'>{item.dish?.title}</h3>
                                    </div>
                                  </div>
                                </TableCell>
                                <TableCell>
                                  <QuantitySelect
                                    initialValue={item.quantity}
                                    max={70}
                                    onChange={(quantity) => {
                                      updateOrderItem(order.tableNumber, item.dish._id, { quantity, note: '' })
                                    }}
                                  />
                                </TableCell>
                                <TableCell>
                                  <div className='text-right text-[15px] font-semibold'>
                                    {formatNumberToVnCurrency(item.price)}
                                  </div>
                                </TableCell>
                                <TableCell>
                                  <div className='flex justify-end'>
                                    <Button
                                      size={'icon'}
                                      variant={'outline'}
                                      onClick={() => {
                                        if (order.items.length === 1) {
                                          clearOrderInCart(order.tableNumber)
                                          if (currentTableNumber === order.tableNumber) {
                                            setCurrentTableNumber(undefined)
                                          }
                                        } else {
                                          removeOrderItem(order.tableNumber, item.dish._id)
                                        }
                                      }}
                                    >
                                      <Trash />
                                    </Button>
                                  </div>
                                </TableCell>
                              </TableRow>
                            )
                          })}
                        </TableBody>
                      </Table>

                      {/* Footer */}
                      <div className='mt-auto border-t border-t-gray-300 bg-white px-3 py-5'>
                        <div className='flex items-start justify-between pb-6'>
                          <div className='flex items-center gap-x-3'>
                            <Image
                              src={'/table-unselect.png'}
                              width={20}
                              height={20}
                              className='h-5 w-5 object-cover'
                              alt='table-icon'
                            />
                            <div className='font-semibold'>Bàn {order.tableNumber}</div>
                          </div>
                          <div>
                            <span className='pr-2 font-medium'>Tổng tiền:</span>
                            <span className='text-xl font-bold text-red-600'>
                              {formatNumberToVnCurrency(totalPrice)}
                            </span>
                            <div className='text-right text-sm font-semibold'>({totalPortion} phần)</div>
                          </div>
                        </div>
                        <Button
                          onClick={() => {
                            confirmOrders(order.tableNumber)
                          }}
                          className={cn('w-full', { 'cursor-not-allowed opacity-90': createOrderMutation.isPending })}
                        >
                          {createOrderMutation.isPending && (
                            <Loader className='mr-2 size-4 animate-spin' aria-hidden='true' />
                          )}
                          Xác nhận
                        </Button>
                      </div>
                    </div>
                  </TabsContent>
                )
              })}
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
