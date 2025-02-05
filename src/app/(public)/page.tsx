import { Button } from '@/components/ui/button'
import http from '@/lib/http'
import React from 'react'
import { Suspense } from 'react'

export default async function Page() {
  try {
    const res = await http.get<string>('')
    console.log(res)
  } catch (error) {
    console.log(error)
  }
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <div>
        <Button>Hello world Pham Phu Loc</Button>
      </div>
    </Suspense>
  )
}
