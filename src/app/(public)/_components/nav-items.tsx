import Link from 'next/link'
import React from 'react'

export default function NavItems() {
  return (
    <ul className='flex items-center gap-x-6 text-[15px] font-bold leading-none text-muted-foreground'>
      <li>
        <Link href={'/customer/orders'}>Đơn hàng</Link>
      </li>
      <li>
        <Link href={'/dashboard'}>Quản lý</Link>
      </li>
      <li>
        <Link href={'/login'}>Đăng nhập</Link>
      </li>
      <li>
        <Link href={'/logout'}>Đăng xuất</Link>
      </li>
    </ul>
  )
}
