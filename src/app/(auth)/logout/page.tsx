'use client'

import envConfig from '@/config'
import { useLogoutMutation } from '@/hooks/api/useAuth'
import { removeAccessTokenFromLS, removeRefreshTokenFromLS } from '@/lib/utils'
import { useRouter, useSearchParams } from 'next/navigation'
import React from 'react'

export default function LogoutPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const logoutRequestRef = React.useRef<boolean>(null)

  const { mutateAsync } = useLogoutMutation()
  const logoutSecret = searchParams.get('logoutSecretKey')

  React.useEffect(() => {
    if (logoutSecret !== envConfig.NEXT_PUBLIC_LOGOUT_SECRET_KEY || logoutRequestRef.current?.valueOf()) {
      return
    }
    logoutRequestRef.current = true
    mutateAsync()
      .catch(console.log)
      .finally(() => {
        router.push('/login')
        logoutRequestRef.current = false
        removeAccessTokenFromLS()
        removeRefreshTokenFromLS()
      })
  }, [router, mutateAsync, logoutSecret])

  return <div>Logout...</div>
}
