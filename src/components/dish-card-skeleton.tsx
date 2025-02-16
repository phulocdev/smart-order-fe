import React from 'react'
import { Skeleton } from '@/components/ui/skeleton'

export default function DishCardSkeleton() {
  return (
    <div className='grid grid-cols-5 rounded-lg'>
      <div className='col-span-3'>
        <Skeleton className='aspect-square w-full rounded-bl-lg rounded-tl-lg object-cover' />
      </div>
      <div className='col-span-2'>
        <div className='px-3 py-1'>
          <div className='space-y-2'>
            <Skeleton className='h-4' />
            <Skeleton className='h-4' />
          </div>
        </div>
      </div>
    </div>
  )
}
