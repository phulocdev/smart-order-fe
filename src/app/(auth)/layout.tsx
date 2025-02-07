export default function AuthLayout({
  children
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <section className='flex min-h-screen items-center justify-center bg-blue-50 dark:bg-zinc-950'>{children}</section>
  )
}
