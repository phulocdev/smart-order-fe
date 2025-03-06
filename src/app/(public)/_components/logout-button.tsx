'use client'

import React from 'react'
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
import { useRouter } from 'next/navigation'
import authApiRequest from '@/apiRequests/auth.api'
import { useAppStore } from '@/providers/zustand-provider'
import customerApiRequest from '@/apiRequests/customer.api'

export default function LogoutButton() {
  const customer = useAppStore((state) => state.customer)
  const setAccount = useAppStore((state) => state.setAccount)
  const setCustomer = useAppStore((state) => state.setCustomer)
  const router = useRouter()
  const onLogout = async () => {
    try {
      if (customer) {
        setCustomer(null)
        await customerApiRequest.logout()
      } else {
        setAccount(null)
        await authApiRequest.logout()
      }
      router.push('/')
    } catch (error) {
      console.log(error)
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
          {customer && <AlertDialogDescription>Bạn sẽ không thể tiếp tục tự gọi món</AlertDialogDescription>}
          {!customer && (
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
