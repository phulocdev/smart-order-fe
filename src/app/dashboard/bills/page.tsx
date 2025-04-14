import { dashboardSearchParamsCache } from '@/app/dashboard/_lib/validation'
import { BillsTable } from '@/app/dashboard/bills/bills-table'
import { getAuthSession } from '@/auth'
import { DataTableSkeleton } from '@/components/data-table/data-table-skeleton'
import { Role } from '@/constants/enum'
import { redirect } from 'next/navigation'
import React from 'react'
import type { SearchParams } from '@/types/data-table.type'
import { format } from 'date-fns'
import billApiRequest from '@/apiRequests/bill.api'
import AdvanceDateRange from '@/components/advance-date-range'

interface Props {
  searchParams: Promise<SearchParams>
}

export default async function Page(props: Props) {
  const session = await getAuthSession()
  const accessToken = session?.accessToken ?? ''
  const searchParams = await props.searchParams

  if (session?.account?.role === Role.Chef) {
    redirect('/dashboard/orders')
  }

  const search = dashboardSearchParamsCache.parse(searchParams)
  const from = format(search.from, 'yyyy-MM-dd')
  const to = format(search.to, 'yyyy-MM-dd')

  const promise = billApiRequest.getList(accessToken, { from, to })

  return (
    <div className='p-8'>
      <div className='mb-3 flex items-start justify-between'>
        <h2 className='text-2xl'>Phiếu tính tiền</h2>
      </div>
      <div className='py-2'>
        <p className='pb-3 text-sm font-medium text-gray-600'>Chọn khoảng thời gian</p>
        <AdvanceDateRange from={search.from} to={search.to} />
      </div>
      <React.Suspense
        fallback={
          <DataTableSkeleton
            columnCount={6}
            searchableColumnCount={1}
            cellWidths={['10rem', '10rem', '10rem', '10rem', '10rem', '10rem']}
            shrinkZero
          />
        }
      >
        <BillsTable promise={promise} />
      </React.Suspense>
    </div>
  )
}
