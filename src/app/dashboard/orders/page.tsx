import orderApiRequest from '@/apiRequests/order.api'
import tableApiRequest from '@/apiRequests/table.api'
import { OrdersTable } from '@/app/dashboard/orders/_components/orders-table'
import { transformOrderQuery } from '@/app/dashboard/orders/_lib/utils'
import { DataTableSkeleton } from '@/components/data-table/data-table-skeleton'
import { DateRangePicker } from '@/components/date-range-picker'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import type { SearchParams } from '@/types/data-table.type'
import { CirclePlus } from 'lucide-react'
import Link from 'next/link'
import * as React from 'react'
import { getAuthSession } from '@/auth'
import { orderSearchParamsCache } from '@/app/dashboard/orders/_lib/validations'

interface IndexPageProps {
  searchParams: Promise<SearchParams>
}

export default async function IndexPage(props: IndexPageProps) {
  const session = await getAuthSession()
  const accessToken = session?.accessToken ?? ''
  const searchParams = await props.searchParams
  const search = orderSearchParamsCache.parse(searchParams)
  const params = transformOrderQuery(search)
  const promises = Promise.all([
    orderApiRequest.getList(accessToken, params),
    tableApiRequest.getList(accessToken),
    orderApiRequest.statisticsByTables(accessToken)
  ])
  return (
    // <Shell className='gap-2'>
    <div className='px-1 py-5 md:px-4 lg:px-6'>
      <div className='mb-3 flex items-start justify-between'>
        <h2 className='text-2xl font-medium'>Đơn hàng</h2>
        <Link href={'/dashboard/orders/create'}>
          <Button className='ml-auto'>
            <CirclePlus />
            <span>Tạo đơn hàng</span>
          </Button>
        </Link>
      </div>
      <React.Suspense fallback={<Skeleton className='h-7 w-52' />}>
        <DateRangePicker
          triggerSize='sm'
          triggerClassName='w-56 sm:w-60'
          align='start'
          shallow={false}
          placeholder='Chọn ngày'
          defaultDateRange={{
            from: search.from,
            to: search.to
          }}
        />
      </React.Suspense>
      <React.Suspense
        fallback={
          <DataTableSkeleton
            columnCount={9}
            searchableColumnCount={2}
            filterableColumnCount={2}
            cellWidths={['10rem', '12rem', '12rem', '8rem', '8rem', '8rem', '12rem', '8rem', '8rem']}
            shrinkZero
          />
        }
      >
        <OrdersTable promises={promises} />
      </React.Suspense>
    </div>
    // </Shell>
  )
}
