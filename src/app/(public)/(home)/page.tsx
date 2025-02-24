import React from 'react'
import DishCard from '@/app/(public)/_components/dish-card'
import dishApiRequest from '@/apiRequests/dish.api'
import { IDish } from '@/types/backend.type'
import OrderCart from '@/app/(public)/_components/order-cart'

export default async function Page() {
  let dishList: IDish[] = []
  try {
    const res = await dishApiRequest.sGetList()
    dishList = res.data
  } catch (error) {
    console.log(error)
    // notFound()
  }
  return (
    <div className='mt-12'>
      <h2 className='mb-3 scroll-m-20 pb-2 text-3xl font-semibold tracking-tight first:mt-0'>
        Món ăn tại cửa hàng 123
      </h2>

      <div className='grid grid-cols-1 gap-x-8 md:grid-cols-2 lg:grid-cols-3'>
        {dishList.map((dish) => (
          <DishCard key={dish._id} dish={dish} />
        ))}
      </div>

      <div className='fixed bottom-[50%] right-2 z-20 translate-y-[50%]'>
        <OrderCart />
      </div>
    </div>
  )
}
