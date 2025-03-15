import LogoutComponent from '@/app/(public)/(auth)/logout/logout-comp'
import { getAuthSession } from '@/auth'
import React from 'react'

export default async function LogoutPage() {
  const session = await getAuthSession()
  return <LogoutComponent session={session} />
}
