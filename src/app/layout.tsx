import Providers from '@/providers/providers'
import { ThemeProvider } from '@/providers/theme-provider'
import type { Metadata } from 'next'
import { Inter, Roboto_Mono } from 'next/font/google'
import './globals.css'
import { getSession } from '@/auth'

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
  const session = await getSession()
  return (
    <html lang='en' suppressHydrationWarning>
      <body
        className={`${inter.className} ${inter.variable} ${roboto_mono.variable} dark:[&::-webkit-scrollbar-thumb]:bg-neutral-500"> antialiased [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-gray-400 [&::-webkit-scrollbar-track]:rounded-full [&::-webkit-scrollbar-track]:bg-gray-100 dark:[&::-webkit-scrollbar-track]:bg-neutral-700 [&::-webkit-scrollbar]:w-2`}
      >
        <Providers session={session}>
          <ThemeProvider attribute='class' defaultTheme='system' enableSystem disableTransitionOnChange>
            <main>{children}</main>
          </ThemeProvider>
        </Providers>
      </body>
    </html>
  )
}
