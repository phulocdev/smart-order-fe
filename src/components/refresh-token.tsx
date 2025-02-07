'use client'

import { getAccessTokenFromLS, getRefreshTokenFromLS } from '@/lib/utils'
import React from 'react'
import jwt from 'jsonwebtoken'
import { usePathname } from 'next/navigation'
import authApiRequest from '@/apiRequests/auth.api'

const UNAUTHENTICATED_PATHS = ['/login', '/register']
const TIME_OUT = 3000 // < expiresIn của AT

export default function RefreshToken() {
  const pathname = usePathname()
  const accessToken = getAccessTokenFromLS()
  const refreshToken = getRefreshTokenFromLS()

  React.useEffect(() => {
    let intervalId: NodeJS.Timeout | undefined = undefined
    if (UNAUTHENTICATED_PATHS.includes(pathname) || !accessToken || !refreshToken) return

    intervalId = setInterval(() => {
      const decodedAccessToken = jwt.decode(accessToken) as { iat: number; exp: number }
      const decodedRefreshToken = jwt.decode(refreshToken) as { iat: number; exp: number }
      const now = new Date().getTime() / 1000 // second

      // TH: RT hết hạn
      if (decodedRefreshToken.exp <= 0 - now) {
        authApiRequest.logout()
      }

      if (decodedAccessToken.exp - now < (decodedAccessToken.exp - decodedAccessToken.iat) / 3) {
        authApiRequest.refreshToken()
      }
    }, TIME_OUT)

    return () => {
      clearInterval(intervalId)
    }
  }, [pathname, refreshToken, accessToken])
  return null
}
