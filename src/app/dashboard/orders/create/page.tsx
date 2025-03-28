import dishApiRequest from '@/apiRequests/dish.api'
import tableApiRequest from '@/apiRequests/table.api'
import CreateOrdersForm from '@/app/dashboard/orders/create/create-orders-form'
import { getAuthSession } from '@/auth'
import { Role } from '@/constants/enum'
import { redirect } from 'next/navigation'
import React from 'react'

export default async function Page() {
  const session = await getAuthSession()
  const accessToken = session?.accessToken ?? ''
  const promises = Promise.all([dishApiRequest.getList(accessToken), tableApiRequest.getList(accessToken)])

  if (session?.account?.role === Role.Chef) {
    redirect('/dashboard/orders')
  }

  return (
    <React.Suspense fallback={<div>...Loading</div>}>
      <CreateOrdersForm promises={promises} />
    </React.Suspense>
  )
}
