"use client";

import {
  PageHeader,
  DataTable,
  StatCard,
  type Column,
} from "@/components/admin/ui";
import { useAdminList } from "@/lib/use-admin-list";
import { timeAgo } from "@/lib/format";

interface Notif {
  id: string;
  type: string;
  title: string;
  message: string;
  readAt: string | null;
  createdAt: string;
  user: { name: string; email: string };
}

export default function AdminNotificationsPage() {
  const { data, loading, error, refresh } = useAdminList<Notif, { byType: Record<string, number> }>("notifications");
  const byType = data?.byType ?? {};

  const columns: Column<Notif>[] = [
    {
      header: "Notification",
      cell: (n) => (
        <div>
          <p className="font-medium">{n.title}</p>
          <p className="line-clamp-1 text-xs text-muted-foreground">{n.message}</p>
        </div>
      ),
    },
    { header: "Type", cell: (n) => <span className="capitalize">{n.type}</span> },
    {
      header: "User",
      cell: (n) => (
        <div>
          <p className="text-sm">{n.user.name}</p>
          <p className="text-xs text-muted-foreground">{n.user.email}</p>
        </div>
      ),
    },
    {
      header: "Read",
      cell: (n) =>
        n.readAt ? (
          <span className="text-xs text-emerald-600">read</span>
        ) : (
          <span className="text-xs text-muted-foreground">unread</span>
        ),
    },
    {
      header: "Sent",
      cell: (n) => <span className="text-muted-foreground">{timeAgo(n.createdAt)}</span>,
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Notifications"
        description="All notifications delivered to users platform-wide."
      />
      {Object.keys(byType).length > 0 && (
        <div className="grid gap-3 sm:grid-cols-4">
          {Object.entries(byType).slice(0, 4).map(([type, count]) => (
            <StatCard key={type} label={type} value={count as number} />
          ))}
        </div>
      )}
      <DataTable
        data={data}
        columns={columns}
        loading={loading}
        error={error}
        onRetry={refresh}
        emptyTitle="No notifications sent yet"
      />
    </div>
  );
}
