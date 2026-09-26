"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@workspace/ui/components/breadcrumb";
import { Separator } from "@workspace/ui/components/separator";
import { SidebarTrigger } from "@workspace/ui/components/sidebar";
import { NotificationCenter } from "./notification-center";

const LABELS: Record<string, string> = {
  admin: "Admin",
  dashboard: "Dashboard",
  businesses: "Businesses",
  users: "Users",
  staff: "Admin Team",
  plans: "Plans",
  modules: "Modules",
  subscriptions: "Subscriptions",
  payments: "Payments",
  "audit-logs": "Audit Logs",
  security: "Sessions",
  settings: "Settings",
};

export function AdminTopbar({ locale }: { locale: string }) {
  const pathname = usePathname();
  const segs = pathname.split("/").filter(Boolean).slice(1); // drop locale
  const crumbs = segs.map((s, i) => ({
    label: LABELS[s] ?? s,
    href: `/${locale}/${segs.slice(0, i + 1).join("/")}`,
  }));

  return (
    <header className="sticky top-0 z-10 flex h-14 shrink-0 items-center gap-2 border-b border-border bg-background/95 backdrop-blur-sm">
      <div className="flex flex-1 items-center gap-2 px-4">
        <SidebarTrigger className="-ms-1" />
        <Separator
          orientation="vertical"
          className="me-2 data-vertical:h-4 data-vertical:self-auto"
        />
        <Breadcrumb>
          <BreadcrumbList>
            {crumbs.map((c, i) => (
              <BreadcrumbItem key={c.href}>
                {i === crumbs.length - 1 ? (
                  <BreadcrumbPage>{c.label}</BreadcrumbPage>
                ) : (
                  <>
                    <BreadcrumbLink
                      render={<Link href={c.href} />}
                      className="hidden md:block"
                    >
                      {c.label}
                    </BreadcrumbLink>
                    <BreadcrumbSeparator className="hidden md:block" />
                  </>
                )}
              </BreadcrumbItem>
            ))}
          </BreadcrumbList>
        </Breadcrumb>
      </div>
      <div className="flex items-center gap-1 px-4">
        <NotificationCenter />
      </div>
    </header>
  );
}
