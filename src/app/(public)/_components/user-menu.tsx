import LogoutButton from '@/app/(public)/_components/logout-button'
import { getAuthSession } from '@/auth'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'
import { User } from 'lucide-react'
import Link from 'next/link'

export default async function UserMenu() {
  const session = await getAuthSession()
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
        {session && <LogoutButton session={session} />}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
