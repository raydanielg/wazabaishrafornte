"use client";

import {
  PageHeader,
  DataTable,
  StatusBadge,
  StatCard,
  type Column,
} from "@/components/admin/ui";
import { useAdminList } from "@/lib/use-admin-list";
import { fmtDateTime } from "@/lib/format";

interface SysLog {
  id: string;
  kind: string;
  name: string;
  severity: "info" | "warn" | "error";
  detail: string | null;
  status: string;
  attempts: number;
  at: string;
  runAt: string;
}

export default function SystemLogsPage() {
  const { data, loading, error, refresh } = useAdminList<SysLog, { summary: { jobs: Record<string, number>; failedSms: number; failedEmail: number } }>("system-logs");

  const columns: Column<SysLog>[] = [
    {
      header: "Job",
      cell: (l) => (
        <div>
          <p className="font-medium">{l.name}</p>
          {l.detail && (
            <p className="line-clamp-1 text-xs text-destructive">{l.detail}</p>
          )}
        </div>
      ),
    },
    { header: "Severity", cell: (l) => <StatusBadge status={l.severity} /> },
    { header: "Status", cell: (l) => <StatusBadge status={l.status} /> },
    { header: "Attempts", cell: (l) => l.attempts },
    {
      header: "Run at",
      cell: (l) => <span className="text-muted-foreground">{fmtDateTime(l.runAt)}</span>,
    },
  ];

  const s = data?.summary;

  return (
    <div className="space-y-6">
      <PageHeader
        title="System Logs"
        description="Background jobs and message delivery health."
      />
      {s && (
        <div className="grid gap-3 sm:grid-cols-4">
          <StatCard label="Jobs completed" value={s.jobs?.completed ?? 0} />
          <StatCard label="Jobs pending" value={s.jobs?.pending ?? 0} />
          <StatCard label="Failed SMS" value={s.failedSms ?? 0} />
          <StatCard label="Failed emails" value={s.failedEmail ?? 0} />
        </div>
      )}
      <DataTable
        data={data}
        columns={columns}
        loading={loading}
        error={error}
        onRetry={refresh}
        emptyTitle="No system events yet"
      />
    </div>
  );
}
