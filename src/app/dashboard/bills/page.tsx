import invoiceApiRequest from '@/apiRequests/bill.api'
import { BillsTable } from '@/app/dashboard/bills/bills-table'
import { getAuthSession } from '@/auth'
import { DataTableSkeleton } from '@/components/data-table/data-table-skeleton'
import React from 'react'

export default async function Page() {
  const session = await getAuthSession()
  const accessToken = session?.accessToken ?? ''
  const promise = invoiceApiRequest.getList(accessToken)
  return (
    <div className='p-8'>
      <div className='mb-3 flex items-start justify-between'>
        <h2 className='text-2xl font-medium'>Phiếu tính tiền</h2>
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
