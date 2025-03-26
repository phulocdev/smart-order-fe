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
import { ChartArea, NotepadText, ShoppingCart, Soup } from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

const items = [
  {
    title: 'Báo cáo',
    url: '/dashboard',
    icon: ChartArea
  },
  {
    title: 'Món ăn',
    url: '/dashboard/dishes',
    icon: Soup
  },
  {
    title: 'Đơn hàng',
    url: '/dashboard/orders',
    icon: ShoppingCart
  },
  {
    title: 'Hóa đơn',
    url: '/dashboard/invoices',
    icon: NotepadText
  }
]

export function AppSidebar() {
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
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton isActive={pathname === item.url} asChild>
                    <Link href={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  )
}
