import { ChartArea, ShoppingCart, Soup } from 'lucide-react'
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
import Link from 'next/link'

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
  }
]

export function AppSidebar() {
  return (
    <Sidebar collapsible='icon'>
      <SidebarContent>
        <SidebarHeader className='text-center'>
          <Link href={'/'}>Smart Order</Link>
        </SidebarHeader>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <a href={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </a>
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
