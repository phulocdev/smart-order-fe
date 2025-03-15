'use client'

import authApiRequest from '@/apiRequests/auth.api'
import customerApiRequest from '@/apiRequests/customer.api'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger
} from '@/components/ui/alert-dialog'
import { DropdownMenuItem } from '@/components/ui/dropdown-menu'
import { handleApiError } from '@/lib/utils'
import { useAppStore } from '@/providers/zustand-provider'
import { Session } from 'next-auth'
import { signOut } from 'next-auth/react'
import { useRouter } from 'next/navigation'

export default function LogoutButton({ session }: { session: Session }) {
  const router = useRouter()
  const clearOrderInCart = useAppStore((state) => state.clearOrderInCart)
  const { refreshToken } = session

  const onLogout = async () => {
    try {
      if (session.account) {
        await Promise.all([signOut({ redirect: false }), authApiRequest.logout(refreshToken)])
      } else {
        await Promise.all([signOut({ redirect: false }), customerApiRequest.logout(refreshToken)])
      }
      if (session.customer) clearOrderInCart()
    } catch (error) {
      handleApiError({ error })
    } finally {
      router.replace('/login')
    }
  }
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild className='w-full text-left'>
        <DropdownMenuItem onSelect={(e) => e.preventDefault()}>Đăng xuất</DropdownMenuItem>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Bạn có muốn đăng xuất?</AlertDialogTitle>
          {session?.customer && <AlertDialogDescription>Bạn sẽ không thể tiếp tục tự gọi món</AlertDialogDescription>}
          {session?.account && (
            <AlertDialogDescription>Hành động này sẽ thoát khỏi phiên làm việc của bạn</AlertDialogDescription>
          )}
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Hủy</AlertDialogCancel>
          <AlertDialogAction onClick={onLogout}>Xác nhận</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
