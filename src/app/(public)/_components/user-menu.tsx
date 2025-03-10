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
import { useSession } from 'next-auth/react'

export default function UserMenu() {
  const { data: session } = useSession()
  const isEmployee = !!session?.account
  const isCustomer = !!session?.customer

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
        {!session && (
          <DropdownMenuItem>
            <Link href={'/login'} className='w-full'>
              Đăng nhập
            </Link>
          </DropdownMenuItem>
        )}
        {isEmployee && (
          <DropdownMenuItem>
            <Link href={'/dashboard'} className='w-full'>
              Quản lý
            </Link>
          </DropdownMenuItem>
        )}
        {isCustomer && (
          <DropdownMenuItem>
            <Link href={'/customer/orders'} className='w-full'>
              Đơn hàng
            </Link>
          </DropdownMenuItem>
        )}
        {session && <LogoutButton />}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
