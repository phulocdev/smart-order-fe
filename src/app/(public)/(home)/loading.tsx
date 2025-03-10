import React from 'react'
import DishCardSkeleton from '@/components/dish-card-skeleton'

export default function Loading() {
  return (
    <div className='mt-12'>
      <div className='grid grid-cols-1 gap-x-8 gap-y-5 lg:grid-cols-3'>
        {Array(3)
          .fill(0)
          .map((_, index) => (
            <DishCardSkeleton key={index} />
          ))}
      </div>
    </div>
  )
}
