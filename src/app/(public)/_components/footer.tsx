import Image from 'next/image'
import React from 'react'
import logo from '@/public/logo.svg'
import facebook from '@/public/facebook.png'
import zalo from '@/public/zalo.png'
import instagram from '@/public/insta.webp'
import Link from 'next/link'

export default function Footer() {
  return (
    <div className='border-t border-t-gray-300 py-12 text-center shadow-md dark:border-t-gray-700'>
      <Image src={logo} alt='Smart-Order' width={160} className='mx-auto' />
      <p className='mt-3 text-zinc-700 dark:text-white'>Demo dự án giữa kì môn Kiến trúc hướng dịch vụ</p>
      <div className='mt-5 inline-flex items-center gap-x-5'>
        <Link href={'https://www.facebook.com/phamphulocc'} target='_blank'>
          <Image className='h-10 w-10 rounded-full object-cover' src={facebook} alt='Facebook' />
        </Link>
        <Link href={'https://zalo.me/0862285763'} target='_blank'>
          <Image className='h-10 w-10 rounded-full object-cover' src={zalo} alt='Zalo' />
        </Link>
        <Link href={'https://zalo.me/0862285763'} target='_blank'>
          <Image className='h-10 w-10 rounded-full object-cover' src={instagram} alt='Instagram' />
        </Link>
      </div>
    </div>
  )
}
