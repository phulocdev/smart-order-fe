import UserMenu from '@/app/(public)/_components/user-menu'
import { ModeToggle } from '@/components/theme-mode-toggle'
import Image from 'next/image'
import Link from 'next/link'

export default async function Header() {
  return (
    <div className='sticky top-0 z-20 bg-white shadow-md dark:border-b dark:border-b-gray-700 dark:bg-background'>
      <div className='flex h-8 items-center justify-center bg-third text-sm text-third-foreground'>
        Ưu đãi nhất năm - chọn món nhé
      </div>
      <div className='container mx-auto py-4'>
        <div className='flex items-center justify-between'>
          <Link href={'/'}>
            <Image
              src={'/logo.svg'}
              alt='Smart-Order'
              width={160}
              height={44}
              className='h-11 w-[160px] object-cover'
            />
          </Link>
          <div className='flex items-center gap-x-3'>
            <UserMenu />
            <ModeToggle />
          </div>
        </div>
      </div>
    </div>
  )
}
