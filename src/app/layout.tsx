import './globals.css'
import type { Metadata } from 'next'
import ReactQueryProvider from '@/providers/react-query-provider'
import { Toaster } from '@/components/ui/toaster'
import { Inter, Roboto_Mono } from 'next/font/google'
import { ThemeProvider } from '@/components/theme-provider'
import RefreshToken from '@/components/refresh-token'
import SetUser from '@/components/set-user'

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
  description: 'SOA TDTU Midterm Project'
}

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang='en' suppressHydrationWarning>
      <body
        className={`${inter.className} ${inter.variable} ${roboto_mono.variable} dark:[&::-webkit-scrollbar-thumb]:bg-neutral-500"> antialiased [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-gray-400 [&::-webkit-scrollbar-track]:rounded-full [&::-webkit-scrollbar-track]:bg-gray-100 dark:[&::-webkit-scrollbar-track]:bg-neutral-700 [&::-webkit-scrollbar]:w-2`}
      >
        <ReactQueryProvider>
          <ThemeProvider attribute='class' defaultTheme='system' enableSystem disableTransitionOnChange>
            <main>{children}</main>
            <Toaster />
            <RefreshToken />
            <SetUser />
          </ThemeProvider>
        </ReactQueryProvider>
      </body>
    </html>
  )
}
