import orderApiRequest from '@/apiRequests/order.api'
import tableApiRequest from '@/apiRequests/table.api'
import { OrdersTable } from '@/app/dashboard/orders/_components/orders-table'
import { transformOrderQuery } from '@/app/dashboard/orders/_lib/utils'
import { DataTableSkeleton } from '@/components/data-table/data-table-skeleton'
import { DateRangePicker } from '@/components/date-range-picker'
import { Shell } from '@/components/shell'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import type { SearchParams } from '@/types/data-table.type'
import { CirclePlus } from 'lucide-react'
import Link from 'next/link'
import * as React from 'react'
import { searchParamsCache } from './_lib/validations'
import { getSession } from '@/auth'

interface IndexPageProps {
  searchParams: Promise<SearchParams>
}

export default async function IndexPage(props: IndexPageProps) {
  const session = await getSession()
  const accessToken = session?.accessToken ?? ''

  const searchParams = await props.searchParams
  const search = searchParamsCache.parse(searchParams)
  const params = transformOrderQuery(search)
  const promises = Promise.all([orderApiRequest.sGetList(accessToken, params), tableApiRequest.sGetList(accessToken)])
  return (
    <Shell className='gap-2'>
      <div className='mb-5 flex items-start justify-between'>
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
          triggerClassName='ml-auto w-56 sm:w-60'
          align='end'
          shallow={false}
          placeholder='Chọn ngày'
          // defaultDateRange={{
          //   from: startOfWeek(startOfToday(), { locale: vi }),
          //   to: endOfWeek(startOfToday(), { locale: vi })
          // }}
        />
      </React.Suspense>
      <React.Suspense
        fallback={
          <DataTableSkeleton
            columnCount={6}
            searchableColumnCount={2}
            filterableColumnCount={2}
            cellWidths={['10rem', '12rem', '12rem', '12rem', '8rem', '8rem']}
            shrinkZero
          />
        }
      >
        <OrdersTable promises={promises} />
      </React.Suspense>
    </Shell>
  )
}
