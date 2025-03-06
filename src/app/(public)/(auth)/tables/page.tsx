'use client'

import React from 'react'
import { useCustomerLoginMutation } from '@/hooks/api/useAuth'
import { handleApiError } from '@/lib/utils'
import { useRouter, useSearchParams } from 'next/navigation'
import { useAppStore } from '@/providers/zustand-provider'

export default function CustomerLoginPage() {
  const setCustomer = useAppStore((state) => state.setCustomer)
  const router = useRouter()
  const searchParams = useSearchParams()
  const { mutateAsync } = useCustomerLoginMutation()
  const tableToken = searchParams.get('token') || ''

  React.useEffect(() => {
    async function handleLogin() {
      try {
        const response = await mutateAsync({ tableToken })
        setCustomer(response.data.customer)
        router.push('/')
      } catch (error) {
        if (((error as any)?.digest as string)?.startsWith('NEXT_REDIRECT')) {
          throw error
        }
        handleApiError({ error })
      }
    }
    handleLogin()
  }, [mutateAsync, router, setCustomer, tableToken])

  return null
}
