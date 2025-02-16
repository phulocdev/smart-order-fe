import { AppSidebar } from '@/components/app-sidebar'
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar'

export default function DashboardLayout({
  children
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <SidebarProvider defaultOpen={true}>
      <AppSidebar />
      <section className='grow'>
        <SidebarTrigger />
        <div> {children}</div>
      </section>
    </SidebarProvider>
  )
}
