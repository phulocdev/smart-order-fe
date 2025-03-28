'use client'

import { Button } from '@/components/ui/button'
import Image from 'next/image'
import { useRouter } from 'next/navigation'

export default function Error({ error }: { error: Error & { digest?: string } }) {
  const router = useRouter()

  return (
    <div className='flex h-screen flex-col items-center py-28'>
      <Image
        src={'/error-image.webp'}
        alt='error'
        width={200}
        height={200}
        className='w-50 aspect-square object-cover'
      />
      <h1 className='py-4'>{error.message}</h1>
      <Button variant={'outline'} onClick={() => router.replace('/')}>
        Quay về trang chủ
      </Button>
    </div>
  )
}
