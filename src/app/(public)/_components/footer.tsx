import Image from 'next/image'
import React from 'react'
import Link from 'next/link'

export default function Footer() {
  return (
    <div className='mt-10 border-t border-t-gray-300 py-12 text-center shadow-md dark:border-t-gray-700 md:mt-16'>
      <Image
        src={'/logo.svg'}
        alt='Smart-Order'
        width={160}
        height={44}
        className='mx-auto h-11 w-[160px] object-cover'
      />
      <p className='mt-4 text-sm font-semibold text-zinc-700 dark:text-white md:text-base'>
        Demo dự án giữa kì môn Kiến trúc hướng dịch vụ
      </p>
      <p className='pt-1 text-center text-xs italic md:text-sm'>CS504070 - Spring, 2025</p>
      <div className='mt-5 inline-flex items-center gap-x-5'>
        <Link href={'https://www.facebook.com/phamphulocc'} target='_blank'>
          <Image
            className='h-10 w-10 rounded-full object-cover'
            src={'/facebook.png'}
            width={40}
            height={40}
            alt='Facebook'
          />
        </Link>
        <Link href={'https://zalo.me/0862285763'} target='_blank'>
          <Image className='h-10 w-10 rounded-full object-cover' src={'/zalo.png'} width={40} height={40} alt='Zalo' />
        </Link>
        <Link href={'https://zalo.me/0862285763'} target='_blank'>
          <Image
            className='h-10 w-10 rounded-full object-cover'
            src={'/insta.webp'}
            width={40}
            height={40}
            alt='Instagram'
          />
        </Link>
      </div>
    </div>
  )
}
