'use client'

import { Button } from '@/components/ui/button'
import { useRouter } from 'next/navigation'

export default function Error({ error }: { error: Error & { digest?: string } }) {
  const router = useRouter()

  return (
    <div className='flex h-screen flex-col items-center py-28'>
      <h1 className='py-6 text-3xl font-bold'>{error.message}</h1>
      <Button variant={'outline'} onClick={() => router.replace('/dashboard')}>
        Quay về trang quản lý
      </Button>
    </div>
  )
}
