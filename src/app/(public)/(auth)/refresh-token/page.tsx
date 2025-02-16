'use client'

import authApiRequest from '@/apiRequests/auth.api'
import { useRouter, useSearchParams } from 'next/navigation'
import React, { Suspense, useEffect } from 'react'

function RefreshTokenComp() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const callbackURL = searchParams.get('callbackURL')
  useEffect(() => {
    authApiRequest.refreshToken().finally(() => {
      router.push(callbackURL || '/')
    })
  }, [callbackURL, router])

  return <div>Refresh token ...</div>
}

export default function RefreshTokenPage() {
  return (
    <Suspense>
      <RefreshTokenComp />
    </Suspense>
  )
}
