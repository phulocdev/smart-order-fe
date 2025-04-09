'use client'
import ReactQueryProvider from '@/providers/react-query-provider'
import { SessionProvider } from 'next-auth/react'
import { NuqsAdapter } from 'nuqs/adapters/next/app'
import React from 'react'
import { Toaster } from 'sonner'

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider refetchOnWindowFocus={false}>
      <ReactQueryProvider>
        <NuqsAdapter>
          {children}
          <Toaster />
        </NuqsAdapter>
      </ReactQueryProvider>
    </SessionProvider>
  )
}
