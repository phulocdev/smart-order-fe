'use client'
import { useSocket } from '@/providers/socket-provider'
import * as React from 'react'

export default function SocketClientInstance() {
  const socket = useSocket()

  React.useEffect(() => {
    if (!socket) return

    socket.emit('messageToServer', 'Pham Phu Loc - 52200103')
    // await new Promise<void>((resolve) => {
    socket.on('messageToClient', (data: string) => {
      console.log('>>>> Message from server ', data)
      // expect(data).toBe('Hello world!')
      // resolve()
    })
    // })

    return () => {
      socket.off('messageToClient')
    }
  }, [socket])
  return null
}
