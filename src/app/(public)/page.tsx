import { Button } from '@/components/ui/button'
import Link from 'next/link'
import React from 'react'

export default function Page() {
  return (
    <div className='bg-zinc-950'>
      <Button>Hello world</Button>
      <Link href={'/login'}>Login</Link>
    </div>
  )
}
