"use client";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { Role } from "@/constants/enum";
import { ROUTES } from "@/constants/constants";
import {
  ChartArea,
  NotepadText,
  ShoppingCart,
  Soup,
  Table,
  User,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const items = [
  {
    title: "Báo cáo",
    url: ROUTES.DASHBOARD.ROOT,
    icon: ChartArea,
    roles: [Role.Manager],
  },
  {
    title: "Món ăn",
    url: ROUTES.DASHBOARD.DISHES,
    icon: Soup,
    roles: [Role.Manager, Role.Chef],
  },
  {
    title: "Đơn hàng",
    url: ROUTES.DASHBOARD.ORDERS,
    icon: ShoppingCart,
    // 3 Role đều vô được trang này
  },
  {
    title: "Hóa đơn",
    url: ROUTES.DASHBOARD.BILLS,
    icon: NotepadText,
    roles: [Role.Manager, Role.Waiter],
  },
  {
    title: "Bàn ăn",
    url: ROUTES.DASHBOARD.TABLES,
    icon: Table,
    roles: [Role.Manager],
  },
  {
    title: "Tài khoản",
    url: ROUTES.DASHBOARD.ACCOUNTS,
    icon: User,
    roles: [Role.Manager],
  },
  {
    title: "Cài đặt",
    url: ROUTES.DASHBOARD.SETTINGS,
    icon: User, // You can use a different icon if preferred
    // No roles property means visible to all
  },
];

export function AppSidebar({ role }: { role?: Role }) {
  const pathname = usePathname();

  return (
    <Sidebar collapsible="icon">
      <SidebarContent>
        <SidebarHeader className="text-center">
          <Link href={ROUTES.HOME} className="text-black">
            SOA
          </Link>
        </SidebarHeader>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => {
                if (item.roles && role && !item.roles.includes(role)) {
                  return;
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
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
