'use client'
import http from '@/lib/http'
import React, { useEffect } from 'react'

export default function ClientComponent() {
  useEffect(() => {
    http
      .get('')
      .then((res) => {
        console.log(res)
      })
      .catch(console.log)
  })
  return <div>ClientComponent</div>
}
