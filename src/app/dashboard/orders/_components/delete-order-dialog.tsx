'use client'

import type { Row } from '@tanstack/react-table'
import { Loader, Trash } from 'lucide-react'
import * as React from 'react'

import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog'
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger
} from '@/components/ui/drawer'
import { useMediaQuery } from '@/hooks/use-media-query'
import { IOrder } from '@/types/backend.type'

interface DeleteOrdersDialogProps extends React.ComponentPropsWithoutRef<typeof Dialog> {
  orders: Row<IOrder>['original'][]
  showTrigger?: boolean
  onSuccess?: () => void
}

export function DeleteOrdersDialog({ orders, showTrigger = true, onSuccess, ...props }: DeleteOrdersDialogProps) {
  const [isDeletePending, startDeleteTransition] = React.useTransition()
  const isDesktop = useMediaQuery('(min-width: 640px)')

  function onDelete() {
    // TODO: Code logic delete
    // startDeleteTransition(async () => {
    //   const { error } = await deleteTasks({
    //     ids: tasks.map((task) => task.id)
    //   })
    //   if (error) {
    //     toast.error(error)
    //     return
    //   }
    //   props.onOpenChange?.(false)
    //   toast.success('Tasks deleted')
    //   onSuccess?.()
    // })
  }

  if (isDesktop) {
    return (
      <Dialog {...props}>
        {showTrigger ? (
          <DialogTrigger asChild>
            <Button variant='outline' size='sm'>
              <Trash className='mr-2 size-4' aria-hidden='true' />
              Xóa ({orders.length})
            </Button>
          </DialogTrigger>
        ) : null}
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Bạn có chắc chắn muốn xóa đơn hàng không?</DialogTitle>
            <DialogDescription>
              Hành động này không thể được hoàn tác. Thao tác này sẽ xóa vĩnh viễn xóa 1 đơn hàng khỏi máy chủ.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className='gap-2 sm:space-x-0'>
            <DialogClose asChild>
              <Button variant='outline'>Hủy</Button>
            </DialogClose>
            <Button
              aria-label='Delete selected rows'
              variant='destructive'
              onClick={onDelete}
              disabled={isDeletePending}
            >
              {isDeletePending && <Loader className='mr-2 size-4 animate-spin' aria-hidden='true' />}
              Xóa
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    )
  }

  return (
    <Drawer {...props}>
      {showTrigger ? (
        <DrawerTrigger asChild>
          <Button variant='outline' size='sm'>
            <Trash className='mr-2 size-4' aria-hidden='true' />
            Xóa đơn hàng
          </Button>
        </DrawerTrigger>
      ) : null}
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>Bạn có chắc chắn muốn xóa đơn hàng không?</DrawerTitle>
          <DrawerDescription>
            Hành động này không thể được hoàn tác. Thao tác này sẽ xóa vĩnh viễn xóa 1 đơn hàng khỏi máy chủ.
          </DrawerDescription>
        </DrawerHeader>
        <DrawerFooter className='gap-2 sm:space-x-0'>
          <DrawerClose asChild>
            <Button variant='outline'>Hủy</Button>
          </DrawerClose>
          <Button aria-label='Delete selected rows' variant='destructive' onClick={onDelete} disabled={isDeletePending}>
            {isDeletePending && <Loader className='mr-2 size-4 animate-spin' aria-hidden='true' />}
            Xóa
          </Button>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  )
}
