import { getAuthSession } from '@/auth'
import Providers from '@/providers/providers'
import { SocketProvider } from '@/providers/socket-provider'
import { ThemeProvider } from '@/providers/theme-provider'
import type { Metadata } from 'next'
import { Inter, Roboto_Mono } from 'next/font/google'
import './globals.css'

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter'
})

const roboto_mono = Roboto_Mono({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-roboto-mono'
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
  const session = await getAuthSession()
  return (
    <html lang='en' suppressHydrationWarning>
      <body className={`${inter.className} ${inter.variable} ${roboto_mono.variable} custom-scrollbar`}>
        <Providers session={session}>
          <SocketProvider>
            <ThemeProvider attribute='class' defaultTheme='system' enableSystem disableTransitionOnChange>
              <main>{children}</main>
            </ThemeProvider>
          </SocketProvider>
        </Providers>
      </body>
    </html>
  )
}
