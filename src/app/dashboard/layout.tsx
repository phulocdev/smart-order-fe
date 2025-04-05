import LogoutButton from '@/app/(public)/_components/logout-button'
import { getAuthSession } from '@/auth'
import { AppSidebar } from '@/components/app-sidebar'
import { ModeToggle } from '@/components/theme-mode-toggle'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar'

export default async function DashboardLayout({
  children
}: Readonly<{
  children: React.ReactNode
}>) {
  const session = await getAuthSession()
  const account = session?.account

  return (
    <SidebarProvider>
      <AppSidebar role={account?.role} />
      <section className='grow'>
        <div className='sticky flex justify-between gap-x-3 border-b py-3 pr-20 shadow dark:border-b-gray-500'>
          <SidebarTrigger />
          <div className='flex items-center gap-x-3'>
            <DropdownMenu>
              <DropdownMenuTrigger asChild className='cursor-pointer'>
                <Avatar>
                  <AvatarImage src={account?.avatarUrl} />
                  <AvatarFallback>{account?.fullName.substring(0, 2)}</AvatarFallback>
                </Avatar>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuLabel>Tài khoản của tôi</DropdownMenuLabel>
                <DropdownMenuSeparator />
                {session && <LogoutButton session={session} />}
              </DropdownMenuContent>
            </DropdownMenu>
            <ModeToggle />
          </div>
        </div>
        {children}
      </section>
    </SidebarProvider>
  )
}
