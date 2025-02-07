'use client'

import envConfig from '@/config'
import { useLogoutMutation } from '@/hooks/api/useAuth'
import { useRouter, useSearchParams } from 'next/navigation'
import React from 'react'

export default function LogoutPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { mutateAsync } = useLogoutMutation()
  const logoutSecret = searchParams.get('logoutSecretKey')

  React.useEffect(() => {
    if (logoutSecret !== envConfig.NEXT_PUBLIC_LOGOUT_SECRET_KEY) return
    mutateAsync()
      .catch(console.log)
      .finally(() => {
        router.push('/login')
      })
  }, [router, mutateAsync, logoutSecret])

  return <div>Logout...</div>
}
