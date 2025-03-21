import dishApiRequest from '@/apiRequests/dish.api'
import { DishesTable } from '@/app/dashboard/dishes/dish-table'
import { getAuthSession } from '@/auth'
import { DataTableSkeleton } from '@/components/data-table/data-table-skeleton'
import React from 'react'

export default async function Page() {
  const session = await getAuthSession()
  const accessToken = session?.accessToken ?? ''
  const promise = dishApiRequest.getList(accessToken)
  return (
    <div className='px-2 py-5 md:px-4 lg:px-9'>
      <div className='mb-3 flex items-start justify-between'>
        <h2 className='text-2xl font-medium'>Danh sách món ăn</h2>
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
        <DishesTable promise={promise} />
      </React.Suspense>
    </div>
  )
}
