"use client";

import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import {
  PageHeader,
  DataTable,
  StatusBadge,
  StatCard,
  type Column,
} from "@/components/admin/ui";
import { useAdminList } from "@/lib/use-admin-list";
import { timeAgo } from "@/lib/format";
import { cn } from "@workspace/ui/lib/utils";

interface Ticket {
  id: string;
  subject: string;
  category: string;
  status: string;
  priority: string;
  updatedAt: string;
  user: { name: string; email: string };
  business?: { name: string } | null;
  _count: { replies: number };
}

const FILTERS = ["all", "open", "in_progress", "waiting", "resolved", "closed"];

export default function SupportPage() {
  const pathname = usePathname();
  const router = useRouter();
  const locale = pathname.split("/")[1] ?? "en";
  const [status, setStatus] = useState("all");
  const { data, loading, error, search, setSearch, refresh } =
    useAdminList<Ticket, { open: number; waiting: number }>("support", { status: status === "all" ? undefined : status });

  const columns: Column<Ticket>[] = [
    {
      header: "Ticket",
      cell: (t) => (
        <div>
          <p className="font-medium">{t.subject}</p>
          <p className="text-xs text-muted-foreground">
            {t.category} · {t._count.replies} replies
          </p>
        </div>
      ),
    },
    {
      header: "User",
      cell: (t) => (
        <div>
          <p className="text-sm">{t.user.name}</p>
          <p className="text-xs text-muted-foreground">{t.business?.name ?? "—"}</p>
        </div>
      ),
    },
    { header: "Status", cell: (t) => <StatusBadge status={t.status} /> },
    { header: "Priority", cell: (t) => <StatusBadge status={t.priority} /> },
    {
      header: "Updated",
      cell: (t) => <span className="text-muted-foreground">{timeAgo(t.updatedAt)}</span>,
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Support"
        description="User tickets — reply, prioritise and resolve."
      />
      {data && (
        <div className="grid gap-3 sm:grid-cols-3">
          <StatCard label="Total" value={data.total} />
          <StatCard label="Open" value={data.open ?? 0} />
          <StatCard label="Waiting on user" value={data.waiting ?? 0} />
        </div>
      )}
      <div className="flex flex-wrap gap-1.5">
        {FILTERS.map((f) => (
          <button
            key={f}
            onClick={() => setStatus(f)}
            className={cn(
              "rounded-full px-3 py-1 text-xs font-medium capitalize transition-colors",
              status === f
                ? "bg-primary text-primary-foreground"
                : "bg-muted text-muted-foreground hover:text-foreground",
            )}
          >
            {f.replace(/_/g, " ")}
          </button>
        ))}
      </div>
      <DataTable
        data={data}
        columns={columns}
        loading={loading}
        error={error}
        onRetry={refresh}
        search={search}
        onSearch={setSearch}
        searchPlaceholder="Search subject, user, email…"
        onRowClick={(t) => router.push(`/${locale}/admin/support/${t.id}`)}
        emptyTitle="No tickets found"
      />
    </div>
  );
}
