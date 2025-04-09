import Providers from '@/providers/providers'
import { SocketProvider } from '@/providers/socket-provider'
import { ThemeProvider } from '@/providers/theme-provider'
import type { Metadata } from 'next'
import { Oswald, Quicksand } from 'next/font/google'
import './globals.css'

const quicksand = Quicksand({
  subsets: ['latin'],
  variable: '--font-quicksand'
})

const oswald = Oswald({
  subsets: ['latin'],
  variable: '--font-oswald',
  weight: ['400', '500', '700']
})
export const metadata: Metadata = {
  title: 'Smart Order',
  description: 'Demo dự án giữa kì môn Kiến trúc hướng dịch vụ'
}

export default async function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang='en' suppressHydrationWarning>
      <body
        className={`${quicksand.className} ${quicksand.variable} ${oswald.variable} relative flex min-h-screen flex-col [&::-webkit-scrollbar]:w-0`}
      >
        <Providers>
          <SocketProvider>
            <ThemeProvider attribute='class' defaultTheme='light' enableSystem disableTransitionOnChange>
              {children}
            </ThemeProvider>
          </SocketProvider>
        </Providers>
      </body>
    </html>
  )
}
