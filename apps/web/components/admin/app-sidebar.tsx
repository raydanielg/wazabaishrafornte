"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  DashboardSquareIcon,
  StoreIcon,
  UserMultipleIcon,
  ShieldUserIcon,
  PackageIcon,
  GridIcon,
  CreditCardIcon,
  MoneyIcon,
  AuditIcon,
  SecurityCheckIcon,
  Settings05Icon,
  ChartBarLineIcon,
  MessageQuestionIcon,
  MegaphoneIcon,
  ReceiptIcon,
  FileIcon,
} from "@hugeicons/core-free-icons";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@workspace/ui/components/sidebar";
import { cn } from "@workspace/ui/lib/utils";
import { useAdmin } from "./admin-gate";
import { NavUser } from "./nav-user";

interface NavItem {
  title: string;
  href: string;
  icon: React.ReactNode;
  permission?: string;
}

interface NavGroup {
  label: string;
  items: NavItem[];
}

const i = (icon: Parameters<typeof HugeiconsIcon>[0]["icon"]) => (
  <HugeiconsIcon icon={icon} strokeWidth={2} />
);

const NAV: NavGroup[] = [
  {
    label: "Overview",
    items: [
      {
        title: "Dashboard",
        href: "/admin/dashboard",
        icon: i(DashboardSquareIcon),
        permission: "admin.dashboard.view",
      },
    ],
  },
  {
    label: "Business",
    items: [
      { title: "Businesses", href: "/admin/businesses", icon: i(StoreIcon), permission: "admin.businesses.view" },
      { title: "Users", href: "/admin/users", icon: i(UserMultipleIcon), permission: "admin.users.view" },
      { title: "Admin Team", href: "/admin/staff", icon: i(ShieldUserIcon), permission: "admin.users.manage" },
    ],
  },
  {
    label: "Product",
    items: [
      { title: "Plans", href: "/admin/plans", icon: i(PackageIcon), permission: "admin.packages.manage" },
      { title: "Modules", href: "/admin/modules", icon: i(GridIcon), permission: "admin.modules.manage" },
      { title: "Subscriptions", href: "/admin/subscriptions", icon: i(CreditCardIcon), permission: "admin.subscriptions.manage" },
    ],
  },
  {
    label: "Operations",
    items: [
      { title: "Payments", href: "/admin/payments", icon: i(MoneyIcon), permission: "admin.businesses.view" },
      { title: "Transactions", href: "/admin/transactions", icon: i(ReceiptIcon), permission: "admin.transactions.view" },
      { title: "Reports", href: "/admin/reports", icon: i(ChartBarLineIcon), permission: "admin.reports.view" },
      { title: "Support", href: "/admin/support", icon: i(MessageQuestionIcon), permission: "admin.support.view" },
      { title: "Broadcasts", href: "/admin/broadcasts", icon: i(MegaphoneIcon), permission: "admin.broadcasts.manage" },
    ],
  },
  {
    label: "Security",
    items: [
      { title: "Audit Logs", href: "/admin/audit-logs", icon: i(AuditIcon), permission: "admin.audit.view" },
      { title: "Sessions", href: "/admin/security", icon: i(SecurityCheckIcon), permission: "admin.audit.view" },
      { title: "Notifications", href: "/admin/notifications", icon: i(FileIcon), permission: "admin.system.view" },
      { title: "System Logs", href: "/admin/system-logs", icon: i(FileIcon), permission: "admin.system.view" },
    ],
  },
  {
    label: "System",
    items: [
      { title: "Settings", href: "/admin/settings", icon: i(Settings05Icon), permission: "admin.settings.manage" },
    ],
  },
];

export function AdminSidebar({ locale }: { locale: string }) {
  const pathname = usePathname();
  const { me, can } = useAdmin();
  const base = `/${locale}`;

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              size="lg"
              render={<Link href={`${base}/admin/dashboard`} />}
            >
              <Image
                src="/brand/logo.png"
                alt=""
                width={32}
                height={32}
                className="size-8 rounded-md"
              />
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-semibold">Wazabiashara</span>
                <span className="truncate text-xs text-muted-foreground">
                  Admin
                </span>
              </div>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        {NAV.map((group) => {
          const items = group.items.filter(
            (it) => !it.permission || can(it.permission),
          );
          if (!items.length) return null;
          return (
            <SidebarGroup key={group.label}>
              <SidebarGroupLabel>{group.label}</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  {items.map((item) => {
                    const href = `${base}${item.href}`;
                    const active =
                      pathname === href || pathname.startsWith(`${href}/`);
                    return (
                      <SidebarMenuItem key={item.href}>
                        <SidebarMenuButton
                          tooltip={item.title}
                          isActive={active}
                          render={<Link href={href} />}
                          className={cn(active && "font-medium")}
                        >
                          {item.icon}
                          <span>{item.title}</span>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    );
                  })}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          );
        })}
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={{ name: me.name, email: me.email, role: me.roleName }} />
      </SidebarFooter>
    </Sidebar>
  );
}
