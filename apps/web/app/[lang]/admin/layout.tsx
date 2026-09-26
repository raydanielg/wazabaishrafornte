import type { Metadata } from "next";
import { isLocale } from "@/lib/i18n";
import { noIndex } from "@/lib/seo";

export const metadata: Metadata = { robots: noIndex };
import { notFound } from "next/navigation";
import { SidebarProvider, SidebarInset } from "@workspace/ui/components/sidebar";
import { TooltipProvider } from "@workspace/ui/components/tooltip";
import { AdminGate } from "@/components/admin/admin-gate";
import { AdminSidebar } from "@/components/admin/app-sidebar";
import { AdminTopbar } from "@/components/admin/topbar";
import { AdminFooter } from "@/components/admin/admin-footer";

export default async function AdminLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();

  return (
    <AdminGate locale={lang}>
      <TooltipProvider>
        <SidebarProvider>
          <AdminSidebar locale={lang} />
          <SidebarInset>
            <AdminTopbar locale={lang} />
            <div className="flex flex-1 flex-col">
              <div className="flex-1 p-4 sm:p-6">{children}</div>
              <AdminFooter />
            </div>
          </SidebarInset>
        </SidebarProvider>
      </TooltipProvider>
    </AdminGate>
  );
}
