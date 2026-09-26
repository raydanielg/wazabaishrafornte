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

interface AdminUserRow {
  id: string;
  name: string;
  email: string | null;
  phoneNumber: string | null;
  status: string;
  emailVerified: boolean;
  createdAt: string;
  _count?: { memberships: number };
}

export default function UsersPage() {
  const pathname = usePathname();
  const router = useRouter();
  const locale = pathname.split("/")[1] ?? "en";
  const { data, loading, error, search, setSearch, refresh } =
    useAdminList<AdminUserRow>("users");

  const columns: Column<AdminUserRow>[] = [
    {
      header: "User",
      cell: (u) => (
        <div>
          <p className="font-medium">{u.name}</p>
          <p className="text-xs text-muted-foreground">
            {u.email ?? u.phoneNumber ?? u.id}
          </p>
        </div>
      ),
    },
    {
      header: "Verified",
      cell: (u) => (u.emailVerified ? "Email" : "—"),
    },
    { header: "Status", cell: (u) => <StatusBadge status={u.status} /> },
    {
      header: "Businesses",
      cell: (u) => u._count?.memberships ?? 0,
      className: "text-right tabular-nums",
    },
    {
      header: "Joined",
      cell: (u) => <span className="text-muted-foreground">{fmtDate(u.createdAt)}</span>,
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Users"
        description="All accounts registered on Wazabiashara."
      />
      <DataTable
        data={data}
        columns={columns}
        loading={loading}
        error={error}
        onRetry={refresh}
        search={search}
        onSearch={setSearch}
        searchPlaceholder="Search name, email, phone…"
        onRowClick={(u) => router.push(`/${locale}/admin/users/${u.id}`)}
        emptyTitle="No users found"
      />
    </div>
  );
}
