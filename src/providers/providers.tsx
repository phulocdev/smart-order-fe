'use client'
import ReactQueryProvider from '@/providers/react-query-provider'
import { Session } from 'next-auth'
import { SessionProvider } from 'next-auth/react'
import { NuqsAdapter } from 'nuqs/adapters/next/app'
import React from 'react'
import { Toaster } from 'sonner'

export default function Providers({ children, session }: { children: React.ReactNode; session: Session | null }) {
  return (
    <SessionProvider session={session} refetchOnWindowFocus={false}>
      <ReactQueryProvider>
        <NuqsAdapter>
          {children}
          <Toaster />
        </NuqsAdapter>
      </ReactQueryProvider>
    </SessionProvider>
  )
}
