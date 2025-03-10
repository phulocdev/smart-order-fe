'use client'

import * as React from 'react'
import { useCustomerLoginMutation } from '@/hooks/api/useAuth'
import { getAccessTokenFromLS, handleApiError, setAccessTokenToLS } from '@/lib/utils'
import { useRouter, useSearchParams } from 'next/navigation'
import { useAppStore } from '@/providers/zustand-provider'
import { signIn, useSession } from 'next-auth/react'
import { Spinner } from '@/components/ui/spinner'

export default function CustomerLoginPage() {
  const { data: session } = useSession()
  const router = useRouter()
  const searchParams = useSearchParams()
  const tableToken = searchParams.get('token') || ''
  const [loading, setLoading] = React.useState(false)

  React.useEffect(() => {
    async function handleLogin() {
      try {
        setLoading(true)
        const response = await signIn('customer-credentials', { redirect: false, tableToken }).finally(() => {
          setLoading(false)
        })

        if (response?.error) {
          const error = JSON.parse(response.error)
          throw error
        }

        router.push('/')
      } catch (error) {
        handleApiError({ error, duration: Infinity })
      }
    }

    handleLogin()
  }, [tableToken])

  React.useEffect(() => {
    if (session && !getAccessTokenFromLS()) {
      setAccessTokenToLS(session.accessToken)
    }
  }, [session])

  return (
    <div>
      {loading && (
        <div className='absolute inset-0 flex items-center justify-center bg-black opacity-30'>
          <Spinner size={'large'} className='' />
        </div>
      )}
    </div>
  )
}
