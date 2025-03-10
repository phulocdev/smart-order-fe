import UserMenu from '@/app/(public)/_components/user-menu'
import { getSession } from '@/auth'
import { ModeToggle } from '@/components/theme-mode-toggle'
import logo from '@/public/logo.svg'
import Image from 'next/image'
import Link from 'next/link'

export default async function Header() {
  const session = await getSession()
  return (
    <div className='sticky top-0 z-20 bg-white py-4 shadow-md dark:border-b dark:border-b-gray-700 dark:bg-background'>
      <div className='container mx-auto'>
        <div className='flex items-center justify-between'>
          <Link href={'/'}>
            <Image src={logo} alt='Smart Order' width={160} priority />
          </Link>
          {/* Menu */}
          <div className='flex items-center gap-x-3'>
            <UserMenu />
            <ModeToggle />
          </div>
        </div>
      </div>
    </div>
  )
}
