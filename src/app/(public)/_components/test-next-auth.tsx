'use client'

import React from 'react'
import { signIn, signOut, useSession } from 'next-auth/react'

export default function TestNextAuth() {
  const { data: session } = useSession()

  if (session) {
    return (
      <>
        {session.user?.name} <br />
        <button onClick={() => signOut()}>Sign out</button>
      </>
    )
  }
  return (
    <>
      Not signed in <br />
      <button onClick={() => signIn()}>Sign in</button>
    </>
  )
}
