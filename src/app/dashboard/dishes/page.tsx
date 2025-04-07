import categoryApiRequest from '@/apiRequests/category.api'
import dishApiRequest from '@/apiRequests/dish.api'
import { DishesTable } from '@/app/dashboard/dishes/dishes-table'
import { getAuthSession } from '@/auth'
import { DataTableSkeleton } from '@/components/data-table/data-table-skeleton'
import { Role } from '@/constants/enum'
import { redirect } from 'next/navigation'
import React from 'react'

export default async function Page() {
  const session = await getAuthSession()
  const promises = Promise.all([dishApiRequest.getList(), categoryApiRequest.getList()])

  if (session?.account?.role === Role.Waiter) {
    redirect('/dashboard/orders')
  }

  return (
    <div className='p-8'>
      <div className='mb-3 flex items-start justify-between'>
        <h2 className='text-2xl font-semibold'>Danh sách món ăn</h2>
        {/* ------------------------- Add Button - Option 1 (Navigate to another page) ---------------------- */}
        {/* <Link href={'/dashboard/orders/create'}>
            <Button className='ml-auto'>
              <CirclePlus />
              <span>Tạo món ăn</span>
            </Button>
          </Link> */}
      </div>
      <React.Suspense
        fallback={
          <DataTableSkeleton
            columnCount={6}
            searchableColumnCount={1}
            cellWidths={['10rem', '12rem', '12rem', '8rem', '8rem', '8rem']}
            shrinkZero
          />
        }
      >
        <DishesTable promises={promises} />
      </React.Suspense>
    </div>
  )
}
