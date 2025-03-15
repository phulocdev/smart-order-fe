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
import { SidebarProvider } from '@/components/ui/sidebar'

export default async function DashboardLayout({
  children
}: Readonly<{
  children: React.ReactNode
}>) {
  const session = await getAuthSession()
  return (
    <SidebarProvider defaultOpen={false}>
      <AppSidebar />
      <section className='grow'>
        <div className='flex justify-end gap-x-3 border-b py-3 pr-20 shadow dark:border-b-gray-500'>
          {/* <SidebarTrigger /> */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild className='cursor-pointer'>
              <Avatar>
                <AvatarImage src='https://github.com/shadcn.png' />
                <AvatarFallback>PL</AvatarFallback>
              </Avatar>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuLabel>Tài khoản của tôi</DropdownMenuLabel>
              <DropdownMenuSeparator />
              {session && <LogoutButton session={session} />}
            </DropdownMenuContent>
          </DropdownMenu>
          {/* Dark Mode Toggle */}
          <ModeToggle />
        </div>
        {children}
      </section>
    </SidebarProvider>
  )
}
