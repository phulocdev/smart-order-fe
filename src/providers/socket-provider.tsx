'use client'

import envConfig from '@/config/env'
import React, { createContext, useContext, useEffect, useState } from 'react'
import { io, Socket } from 'socket.io-client'
import { useSession } from 'next-auth/react'
import jwt from 'jsonwebtoken'
import { useRouter } from 'next/navigation'
import { Session } from 'next-auth'

interface SocketContextType {
  socket: Socket | null
}

const SocketContext = createContext<SocketContextType | undefined>(undefined)

export const SocketProvider: React.FC<{ children: React.ReactNode; session: Session | null }> = ({
  children,
  session
}) => {
  const [socket, setSocket] = useState<Socket | null>(null)
  // const { data: session } = useSession()
  const accessToken = session?.accessToken ?? ''
  const now = Math.floor(new Date().getTime() / 1000) // second
  const router = useRouter()

  useEffect(() => {
    console.log({ accessToken })
    if (!session) return

    const socketInstance = io(`${envConfig.NEXT_PUBLIC_WEBSOCKET_URL}`, {
      autoConnect: true,
      transports: ['websocket', 'polling'],
      auth: {
        role: session.account ? 'employee' : 'customer',
        authorization: accessToken
      }
    })
    setSocket(socketInstance)

    return () => {
      // Disconnect from client
      socketInstance.disconnect()
    }
  }, [accessToken, now, router, session])

  return <SocketContext.Provider value={{ socket }}>{children}</SocketContext.Provider>
}

export const useSocket = (): Socket | null => {
  const context = useContext(SocketContext)
  if (!context) {
    throw new Error('useSocket must be used within a SocketProvider')
  }
  return context.socket
}
