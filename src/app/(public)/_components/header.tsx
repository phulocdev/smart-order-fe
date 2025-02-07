import React from 'react'
import logo from '@/public/logo.svg'
import Image from 'next/image'
import { User } from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'
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

import Link from 'next/link'
import { ModeToggle } from '@/components/theme-mode-toggle'
import { Button } from '@/components/ui/button'

export default function Header() {
  return (
    <div className='sticky top-0 bg-white py-4 shadow-md dark:border-b dark:border-b-gray-700 dark:bg-background'>
      <div className='container mx-auto'>
        <div className='flex items-center justify-between'>
          <Image src={logo} alt='Smart Order' width={160} priority />
          {/* Menu */}
          <div className='flex items-center gap-x-3'>
            <AlertDialog>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant='outline' size='icon'>
                    <User />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuLabel>Tài khoản của tôi</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>
                    <Link href={'/login'} className='w-full'>
                      Đăng nhập
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Link href={'/dashboard'} className='w-full'>
                      Quản lý
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Link href={'/customer/orders'} className='w-full'>
                      Đơn hàng
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <AlertDialogTrigger className='w-full text-left'>Đăng xuất</AlertDialogTrigger>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
              {/* Alert Dialog Logout */}
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Bạn có muốn đăng xuất?</AlertDialogTitle>
                  <AlertDialogDescription>Hành động này sẽ thoát khỏi phiên làm việc của bạn</AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Hủy</AlertDialogCancel>
                  <AlertDialogAction>Xác nhận</AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
            <ModeToggle />
          </div>
        </div>
      </div>
    </div>
  )
}
