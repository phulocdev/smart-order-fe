import accountApiRequest from '@/apiRequests/account.api'
import { IAccount } from '@/types/auth.type'
import { cookies } from 'next/headers'
import React from 'react'

export default async function DashboardPage() {
  const cookieStore = await cookies()
  const accessToken = cookieStore.get('accessToken')?.value || ''
  let accountList: IAccount[] = []

  try {
    const response = await accountApiRequest.sGetList(accessToken)
    accountList = response.data
  } catch (error) {
    if (((error as any)?.digest as string)?.startsWith('NEXT_REDIRECT')) {
      throw error
    }
    console.log(error)
  }
  return (
    <div>
      {accountList.map((account) => (
        <div key={account._id}>{account.fullName}</div>
      ))}
    </div>
  )
}
