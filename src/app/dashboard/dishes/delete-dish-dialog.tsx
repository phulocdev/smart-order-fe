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
import { IDish } from '@/types/backend.type'
import { useRemoveDishMutation } from '@/hooks/api/useDish'
import { handleApiError } from '@/lib/utils'

interface DeleteDishDialogProps extends React.ComponentPropsWithoutRef<typeof Dialog> {
  dish?: Row<IDish>['original']
  showTrigger?: boolean
  onSuccess?: () => void
}

export function DeleteDishDialog({ dish, showTrigger = true, onSuccess, ...props }: DeleteDishDialogProps) {
  const removeDishMutation = useRemoveDishMutation()
  const isDesktop = useMediaQuery('(min-width: 640px)')

  async function onDelete() {
    try {
      if (!dish) return
      await removeDishMutation.mutateAsync(dish._id)
      onSuccess?.()
    } catch (error) {
      handleApiError({ error })
    }
  }

  if (isDesktop) {
    return (
      <Dialog {...props}>
        {showTrigger ? (
          <DialogTrigger asChild>
            <Button variant='outline' size='sm'>
              <Trash className='mr-2 size-4' aria-hidden='true' />
              {/* Xóa ({dish.length}) */}
            </Button>
          </DialogTrigger>
        ) : null}
        <DialogContent>
          <DialogHeader>
            <DialogTitle className='max-w-[90%] leading-6'>Bạn có chắc chắn muốn xóa món {dish?.title} ?</DialogTitle>
            <DialogDescription>
              Hành động này không thể được hoàn tác. Thao tác này sẽ xóa vĩnh viễn xóa 1 món ăn khỏi máy chủ.
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
              disabled={removeDishMutation.isPending}
            >
              {removeDishMutation.isPending && <Loader className='mr-2 size-4 animate-spin' aria-hidden='true' />}
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
            Xóa món ăn
          </Button>
        </DrawerTrigger>
      ) : null}
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>Bạn có chắc chắn muốn xóa món ăn không?</DrawerTitle>
          <DrawerDescription>
            Hành động này không thể được hoàn tác. Thao tác này sẽ xóa vĩnh viễn xóa 1 món ăn khỏi máy chủ.
          </DrawerDescription>
        </DrawerHeader>
        <DrawerFooter className='gap-2 sm:space-x-0'>
          <DrawerClose asChild>
            <Button variant='outline'>Hủy</Button>
          </DrawerClose>
          <Button
            aria-label='Delete selected rows'
            variant='destructive'
            onClick={onDelete}
            disabled={removeDishMutation.isPending}
          >
            {removeDishMutation.isPending && <Loader className='mr-2 size-4 animate-spin' aria-hidden='true' />}
            Xóa
          </Button>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  )
}
