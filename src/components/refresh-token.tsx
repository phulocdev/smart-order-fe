'use client'

import { checkAndRefreshToken } from '@/lib/utils'
import React from 'react'
import { usePathname } from 'next/navigation'

const UNAUTHENTICATED_PATHS = ['/login', '/register']
const TIME_OUT = 60 * 1000 * 15 // < expiresIn của AT 15p

export default function RefreshToken() {
  const pathname = usePathname()

  React.useEffect(() => {
    let intervalId: NodeJS.Timeout | undefined = undefined
    if (UNAUTHENTICATED_PATHS.includes(pathname)) return

    checkAndRefreshToken()
    intervalId = setInterval(() => checkAndRefreshToken(), TIME_OUT)

    return () => {
      clearInterval(intervalId)
    }
  }, [pathname])
  return null
}
