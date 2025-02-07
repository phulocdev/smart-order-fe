'use client'

import useAccountsQuery from '@/hooks/api/useAccount'
import React from 'react'

export default function OrdersPage() {
  const accountQuery = useAccountsQuery()
  return (
    <div>
      <div>Orders of Customer</div>
      <div>{accountQuery.data?.data.map((account) => <div key={account._id}>{account.email}</div>)}</div>
    </div>
  )
}
