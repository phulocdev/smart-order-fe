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

export default function LogoutButton({ session }: { session: Session }) {
  const { refreshToken } = session
  const clearOrderInCart = useAppStore((state) => state.clearOrderInCart)

  const onLogout = async () => {
    try {
      if (session.account) {
        // Không dùng redirect: false ở đây, vì nó sẽ k  reload lại page -> vẫn ở page đang thực hiện logout
        // Ko dung promise.all boi vi trong th AT het hạn thi login khong thanh cong
        // await Promise.all([signOut({ callbackUrl: '/login' }), authApiRequest.logout(refreshToken)])
        await signOut({ callbackUrl: '/login' })
        await authApiRequest.logout(refreshToken)
      } else {
        // await Promise.all([signOut({ callbackUrl: '/' }), customerApiRequest.logout(refreshToken)])
        await signOut({ callbackUrl: '/' })
        clearOrderInCart()
        await customerApiRequest.logout(refreshToken)
      }
    } catch (error) {
      handleApiError({ error })
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
