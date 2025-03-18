'use client'
import { Spinner } from '@/components/ui/spinner'
import { handleApiError } from '@/lib/utils'
import { signIn } from 'next-auth/react'
import { useRouter, useSearchParams } from 'next/navigation'
import * as React from 'react'

export default function ReservationScreen() {
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
        router.replace('/')
      } catch (error) {
        handleApiError({ error, duration: Infinity })
      }
    }

    handleLogin()
  }, [router, tableToken])

  return (
    <div>
      {loading && (
        <div className='absolute inset-0 flex items-center justify-center bg-black opacity-30'>
          <Spinner size={'large'} className='text-white' />
        </div>
      )}
    </div>
  )
}
