'use client'
import ReactQueryProvider from '@/providers/react-query-provider'
import type { Session } from 'next-auth'
import { SessionProvider } from 'next-auth/react'
import { NuqsAdapter } from 'nuqs/adapters/next/app'
import React from 'react'
import { Toaster } from 'sonner'

export default function Providers({ session, children }: { session: Session | null; children: React.ReactNode }) {
  return (
    <SessionProvider session={session}>
      <ReactQueryProvider>
        <NuqsAdapter>
          <main>{children}</main>
          <Toaster />
        </NuqsAdapter>
      </ReactQueryProvider>
    </SessionProvider>
  )
}
