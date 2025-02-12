'use client'

import React from 'react'
import { Button } from '@/components/ui/button'
import { formatNumberToVnCurrency } from '@/lib/utils'
import { NotebookPen } from 'lucide-react'
import Image from 'next/image'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger
} from '@/components/ui/alert-dialog'

import { Textarea } from '@/components/ui/textarea'
import QuantitySelect from '@/components/quantity-select'
import { IDish } from '@/types/backend.type'

interface Props {
  dish: IDish
}

export default function DishCard({ dish }: Props) {
  return (
    <div className='col-span-4'>
      <div className='grid grid-cols-5 rounded-lg border shadow-sm'>
        <div className='col-span-3'>
          <Image
            src={dish.imageUrl}
            alt={dish.title}
            width={0}
            height={0}
            sizes='100vw'
            className='aspect-square w-full rounded-bl-lg rounded-tl-lg object-cover'
          />
        </div>
        <div className='col-span-2'>
          <div className='px-3 py-1'>
            {/* Note Butotn */}
            <div className='text-right'>
              <AlertDialog>
                <AlertDialogTrigger>
                  <div className='rounded-md p-2 hover:bg-gray-100'>
                    <NotebookPen size={15} />
                  </div>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Ghi chú: {dish.title}</AlertDialogTitle>
                    <AlertDialogDescription>
                      <Textarea placeholder='Hãy nhập ghi chú' rows={4} className='text-black' />
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Hủy</AlertDialogCancel>
                    <AlertDialogAction>Xác nhận</AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>

            {/* Dish Info */}
            <h4 className='line-clamp-2 h-12 scroll-m-20 font-semibold tracking-tight'>{dish.title}</h4>
            <div className='mt-1 text-[15px]'>
              <span>Giá: </span>
              <span className='font-semibold text-red-600'>{formatNumberToVnCurrency(dish.price)}</span>
            </div>
            {/* Quantity Select */}
            <div className='mt-4'>
              <QuantitySelect />
            </div>
            {/* Order Button */}
            <Button className='mt-2 w-full'>Đặt món</Button>
          </div>
        </div>
      </div>
    </div>
  )
}
