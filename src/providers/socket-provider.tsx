'use client'

import envConfig from '@/config/env'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import React, { createContext, useContext, useEffect, useState } from 'react'
import { io, Socket } from 'socket.io-client'
import jwt from 'jsonwebtoken'

interface SocketContextType {
  socket: Socket | null
}

const SocketContext = createContext<SocketContextType | undefined>(undefined)

export const SocketProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [socket, setSocket] = useState<Socket | null>(null)
  const { data: session } = useSession()
  const accessToken = session?.accessToken ?? ''
  const decodedAccessToken = jwt.decode(accessToken) as { exp: number } | undefined
  const now = Math.floor(new Date().getTime() / 1000) // second
  const router = useRouter()

  useEffect(() => {
    if (
      !session
      // || (decodedAccessToken && decodedAccessToken.exp > now)
    )
      return

    // Trong trường hợp AT hết hạn thì vẫn tạo ra 1 instance có url connect thành công đến websocket server - Chỉ là chưa connect mà thôi
    const socketInstance = io(`${envConfig.NEXT_PUBLIC_WEBSOCKET_URL}`, {
      autoConnect: true,
      transports: ['websocket', 'polling'],
      auth: {
        role: session.account ? 'employee' : 'customer',
        authorization: accessToken
      }
    })

    setSocket(socketInstance)

    // socketInstance.on('logout', () => {
    //   router.push('/logout')
    // })

    return () => {
      // Disconnect from client
      socketInstance.disconnect()
      // socketInstance.off('logout')
    }
  }, [accessToken, session])

  return <SocketContext.Provider value={{ socket }}>{children}</SocketContext.Provider>
}

export const useSocket = (): Socket | null => {
  const context = useContext(SocketContext)
  if (!context) {
    throw new Error('useSocket must be used within a SocketProvider')
  }
  return context.socket
}
