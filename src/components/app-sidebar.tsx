'use client'

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem
} from '@/components/ui/sidebar'
import { Role } from '@/constants/enum'
import { ChartArea, NotepadText, ShoppingCart, Soup } from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

const items = [
  {
    title: 'Báo cáo',
    url: '/dashboard',
    icon: ChartArea,
    roles: [Role.Manager]
  },
  {
    title: 'Món ăn',
    url: '/dashboard/dishes',
    icon: Soup,
    roles: [Role.Manager, Role.Chef]
  },
  {
    title: 'Đơn hàng',
    url: '/dashboard/orders',
    icon: ShoppingCart
    // 3 Role đều vô được trang này
  },
  {
    title: 'Hóa đơn',
    url: '/dashboard/bills',
    icon: NotepadText,
    roles: [Role.Manager, Role.Waiter]
  }
]

export function AppSidebar({ role }: { role?: Role }) {
  const pathname = usePathname()

  return (
    <Sidebar collapsible='icon'>
      <SidebarContent>
        <SidebarHeader className='text-center'>
          <Link href={'/'} className='text-black'>
            SOA
          </Link>
        </SidebarHeader>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => {
                if (item.roles && role && !item.roles.includes(role)) {
                  return
                }
                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton isActive={pathname === item.url} asChild>
                      <Link href={item.url}>
                        <item.icon />
                        <span>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                )
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  )
}
