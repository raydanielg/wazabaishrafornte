"use client";

import { PageHeader, DataTable, type Column } from "@/components/admin/ui";
import { useAdminList } from "@/lib/use-admin-list";
import { fmtDateTime } from "@/lib/format";

interface AuditRow {
  id: string;
  action: string;
  entityType: string | null;
  entityId: string | null;
  ipAddress: string | null;
  createdAt: string;
  actor?: { name: string; email: string | null } | null;
  actorAdmin?: { name: string; email: string } | null;
}

export default function AuditLogsPage() {
  const { data, loading, error, search, setSearch, refresh } =
    useAdminList<AuditRow>("audit-logs", { action: undefined });

  const columns: Column<AuditRow>[] = [
    {
      header: "Actor",
      cell: (a) => (
        <div>
          <p className="font-medium">
            {a.actor?.name ?? a.actorAdmin?.name ?? "System"}
          </p>
          <p className="text-xs text-muted-foreground">
            {a.actorAdmin ? "admin" : a.actor?.email ?? ""}
          </p>
        </div>
      ),
    },
    { header: "Action", cell: (a) => <code className="text-xs">{a.action}</code> },
    {
      header: "Resource",
      cell: (a) => (
        <span className="text-muted-foreground">
          {a.entityType ? `${a.entityType}` : "—"}
          {a.entityId ? ` · ${a.entityId.slice(0, 8)}…` : ""}
        </span>
      ),
    },
    {
      header: "IP",
      cell: (a) => <span className="text-muted-foreground">{a.ipAddress ?? "—"}</span>,
    },
    {
      header: "Time",
      cell: (a) => (
        <span className="text-muted-foreground">{fmtDateTime(a.createdAt)}</span>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Audit Logs"
        description="Every administrative and sensitive action on the platform."
      />
      <DataTable
        data={data}
        columns={columns}
        loading={loading}
        error={error}
        onRetry={refresh}
        search={search}
        onSearch={setSearch}
        searchPlaceholder="Filter by action…"
        emptyTitle="No audit entries"
      />
    </div>
  );
}
