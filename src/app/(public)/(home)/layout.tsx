import Footer from '@/app/(public)/_components/footer'
import Header from '@/app/(public)/_components/header'

export default function PublicLayout({
  children
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <>
      <Header />
      <main className='flex-grow'>{children}</main>
      <Footer />
    </>
  )
}
