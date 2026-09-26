"use client";

import { useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import {
  PageHeader,
  DataTable,
  StatusBadge,
  type Column,
} from "@/components/admin/ui";
import { useAdminList } from "@/lib/use-admin-list";
import { fmtDate, fmtTzs } from "@/lib/format";
import { cn } from "@workspace/ui/lib/utils";

interface Sub {
  id: string;
  status: string;
  startDate: string;
  endDate: string | null;
  trialEndsAt: string | null;
  business: { id: string; name: string; status: string };
  package: { name: string; price: string; currency: string };
}

const STATUSES = ["trialing", "active", "past_due", "expired", "cancelled"];

export default function SubscriptionsPage() {
  const pathname = usePathname();
  const router = useRouter();
  const locale = pathname.split("/")[1] ?? "en";
  const initial = new URLSearchParams(
    typeof window !== "undefined" ? window.location.search : "",
  ).get("status") ?? "";
  const [status, setStatus] = useState(initial);
  const { data, loading, error, search, setSearch, refresh } =
    useAdminList<Sub>("subscriptions", { status: status || undefined });

  const columns: Column<Sub>[] = [
    {
      header: "Business",
      cell: (s) => (
        <div>
          <p className="font-medium">{s.business.name}</p>
          <p className="text-xs text-muted-foreground">{s.business.status}</p>
        </div>
      ),
    },
    {
      header: "Plan",
      cell: (s) => (
        <div>
          <p>{s.package.name}</p>
          <p className="text-xs text-muted-foreground">{fmtTzs(s.package.price)}</p>
        </div>
      ),
    },
    { header: "Status", cell: (s) => <StatusBadge status={s.status} /> },
    {
      header: "Started",
      cell: (s) => <span className="text-muted-foreground">{fmtDate(s.startDate)}</span>,
    },
    {
      header: "Ends / Trial ends",
      cell: (s) => (
        <span className="text-muted-foreground">
          {fmtDate(s.endDate ?? s.trialEndsAt)}
        </span>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Subscriptions"
        description="Business subscription states across the platform."
      />
      <div className="flex flex-wrap gap-1.5">
        <FilterChip label="All" active={!status} onClick={() => setStatus("")} />
        {STATUSES.map((s) => (
          <FilterChip
            key={s}
            label={s.replace("_", " ")}
            active={status === s}
            onClick={() => setStatus(s)}
          />
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
        searchPlaceholder="Search by business…"
        onRowClick={(s) => router.push(`/${locale}/admin/businesses/${s.business.id}`)}
        emptyTitle="No subscriptions found"
      />
    </div>
  );
}

function FilterChip({
  label,
  active,
  onClick,
}: {
  label: string;
  active?: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "rounded-full border border-border px-3 py-1 text-xs font-medium capitalize transition-colors",
        active
          ? "bg-primary text-primary-foreground"
          : "text-muted-foreground hover:text-foreground",
      )}
    >
      {label}
    </button>
  );
}
