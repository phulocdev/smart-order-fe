'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { Loader } from 'lucide-react'
import * as React from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'

import { Button } from '@/components/ui/button'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Sheet, SheetClose, SheetContent, SheetFooter, SheetHeader, SheetTitle } from '@/components/ui/sheet'
import { Textarea } from '@/components/ui/textarea'

import orderApiRequest from '@/apiRequests/order.api'
import { OrderStatus } from '@/constants/enum'
import { IOrder } from '@/types/backend.type'
import { type UpdateTaskSchema, updateTaskSchema } from '../_lib/validations'

interface UpdateOrderSheetProps extends React.ComponentPropsWithRef<typeof Sheet> {
  order: IOrder | null
}

export function UpdateOrderSheet({ order, ...props }: UpdateOrderSheetProps) {
  const [isUpdatePending, startUpdateTransition] = React.useTransition()

  const form = useForm<UpdateTaskSchema>({
    resolver: zodResolver(updateTaskSchema),
    defaultValues: {
      // title: order?.title ?? '',
      // label: order?.label,
      // status: order?.status,
      // priority: order?.priority
    }
  })

  function onSubmit(input: UpdateTaskSchema) {
    startUpdateTransition(async () => {
      if (!order) return
      try {
        await orderApiRequest.update({
          id: order._id,
          body: { status: OrderStatus.Paid }
        })
      } catch (error) {
        toast.error(error as any)
        return
      }

      form.reset()
      props.onOpenChange?.(false)
      toast.success('Đơn hàng cập nhật thành công')
    })
  }

  return (
    <Sheet {...props}>
      <SheetContent className='flex flex-col gap-6 sm:max-w-md'>
        <SheetHeader className='text-left'>
          <SheetTitle>Cập nhật đơn hàng</SheetTitle>
          {/* <SheetDescription>Update the task details and save the changes</SheetDescription> */}
        </SheetHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className='flex flex-col gap-4'>
            <FormField
              control={form.control}
              name='title'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Textarea placeholder='Do a kickflip' className='resize-none' {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {/* <FormField
              control={form.control}
              name='label'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Label</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger className='capitalize'>
                        <SelectValue placeholder='Select a label' />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectGroup>
                        {tasks.label.enumValues.map((item) => (
                          <SelectItem key={item} value={item} className='capitalize'>
                            {item}
                          </SelectItem>
                        ))}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='status'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Status</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger className='capitalize'>
                        <SelectValue placeholder='Select a status' />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectGroup>
                        {tasks.status.enumValues.map((item) => (
                          <SelectItem key={item} value={item} className='capitalize'>
                            {item}
                          </SelectItem>
                        ))}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='priority'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Priority</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger className='capitalize'>
                        <SelectValue placeholder='Select a priority' />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectGroup>
                        {tasks.priority.enumValues.map((item) => (
                          <SelectItem key={item} value={item} className='capitalize'>
                            {item}
                          </SelectItem>
                        ))}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            /> */}
            <SheetFooter className='gap-2 pt-2 sm:space-x-0'>
              <SheetClose asChild>
                <Button type='button' variant='outline'>
                  Hủy
                </Button>
              </SheetClose>
              <Button disabled={isUpdatePending}>
                {isUpdatePending && <Loader className='mr-2 size-4 animate-spin' aria-hidden='true' />}
                Lưu
              </Button>
            </SheetFooter>
          </form>
        </Form>
      </SheetContent>
    </Sheet>
  )
}
