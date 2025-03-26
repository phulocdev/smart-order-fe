'use client'

import React from 'react'
import { handleApiError } from '@/lib/utils'
import { useAppStore } from '@/providers/zustand-provider'
import { Session } from 'next-auth'
import { signOut } from 'next-auth/react'
import { useRouter } from 'next/navigation'

// Component này phục vụ cho việc force logout bởi vì RT hết hạn -> không cần gọi lên authApiRequest || customerApiRequest.logout
// Mà khi RT hết hạn thì AT chắc chắn cũng sẽ invalid
// Mà trong http lại cứ recall 1 api mà luôn trả về 401 -> đệ quy vô tạn
export default function LogoutComponent({ session }: { session: Session | null }) {
  const router = useRouter()
  const clearOrderInCart = useAppStore((state) => state.clearOrderInCart)

  React.useEffect(() => {
    async function handleLogout() {
      try {
        await signOut({ redirect: false })
        if (session?.customer) clearOrderInCart()
      } catch (error) {
        handleApiError({ error })
      } finally {
        router.replace('/login')
      }
    }
    handleLogout()
  }, [clearOrderInCart, router, session?.customer])
  return null
}
