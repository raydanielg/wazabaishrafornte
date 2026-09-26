"use client";

import { usePathname, useRouter } from "next/navigation";
import {
  PageHeader,
  DataTable,
  StatusBadge,
  type Column,
} from "@/components/admin/ui";
import { useAdminList } from "@/lib/use-admin-list";
import { fmtDate } from "@/lib/format";

interface Biz {
  id: string;
  name: string;
  slug: string;
  status: string;
  createdAt: string;
  businessType?: { name: string } | null;
  subscription?: { status: string; package?: { name: string } | null } | null;
  _count?: { memberships: number };
}

export default function BusinessesPage() {
  const pathname = usePathname();
  const router = useRouter();
  const locale = pathname.split("/")[1] ?? "en";
  const { data, loading, error, search, setSearch, refresh } =
    useAdminList<Biz>("businesses");

  const columns: Column<Biz>[] = [
    {
      header: "Business",
      cell: (b) => (
        <div>
          <p className="font-medium">{b.name}</p>
          <p className="text-xs text-muted-foreground">{b.slug}</p>
        </div>
      ),
    },
    { header: "Type", cell: (b) => b.businessType?.name ?? "—" },
    { header: "Status", cell: (b) => <StatusBadge status={b.status} /> },
    {
      header: "Plan",
      cell: (b) => b.subscription?.package?.name ?? "—",
    },
    {
      header: "Members",
      cell: (b) => b._count?.memberships ?? "—",
      className: "text-right tabular-nums",
    },
    {
      header: "Created",
      cell: (b) => <span className="text-muted-foreground">{fmtDate(b.createdAt)}</span>,
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Businesses"
        description="Manage and monitor businesses on Wazabiashara."
      />
      <DataTable
        data={data}
        columns={columns}
        loading={loading}
        error={error}
        onRetry={refresh}
        search={search}
        onSearch={setSearch}
        searchPlaceholder="Search businesses…"
        onRowClick={(b) => router.push(`/${locale}/admin/businesses/${b.id}`)}
        emptyTitle="No businesses found"
      />
    </div>
  );
}
