'use client'

import Link from 'next/link'
import React from 'react'
import { User } from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'
import { Button } from '@/components/ui/button'
import LogoutButton from '@/app/(public)/_components/logout-button'
import { useAppStore } from '@/providers/zustand-provider'

export default function NavItems() {
  const customer = useAppStore((state) => state.customer)
  const account = useAppStore((state) => state.account)
  const isAuthenticated = Boolean(customer || account)
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant='outline' size='icon'>
          <User />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuLabel>Tài khoản của tôi</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {!isAuthenticated && (
          <DropdownMenuItem>
            <Link href={'/login'} className='w-full'>
              Đăng nhập
            </Link>
          </DropdownMenuItem>
        )}
        {account && (
          <DropdownMenuItem>
            <Link href={'/dashboard'} className='w-full'>
              Quản lý
            </Link>
          </DropdownMenuItem>
        )}
        {customer && (
          <DropdownMenuItem>
            <Link href={'/customer/orders'} className='w-full'>
              Đơn hàng
            </Link>
          </DropdownMenuItem>
        )}
        {isAuthenticated && <LogoutButton />}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
