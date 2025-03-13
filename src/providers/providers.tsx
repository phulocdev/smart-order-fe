'use client'
import ReactQueryProvider from '@/providers/react-query-provider'
import { NuqsAdapter } from 'nuqs/adapters/next/app'
import React from 'react'
import { Toaster } from 'sonner'

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ReactQueryProvider>
      <NuqsAdapter>
        <main>{children}</main>
        <Toaster />
      </NuqsAdapter>
    </ReactQueryProvider>
  )
}
