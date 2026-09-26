"use client";

/* eslint-disable react-hooks/set-state-in-effect -- fetch loading states */

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  AlertCircleIcon,
  AddCircleIcon,
  StoreIcon,
  UserMultipleIcon,
  BarChartIcon,
  AuditIcon,
  CheckIcon,
} from "@hugeicons/core-free-icons";
import { adminApi, type Paged } from "@/lib/admin-api";
import { useAdmin } from "@/components/admin/admin-gate";
import {
  PageHeader,
  StatCard,
  ErrorState,
} from "@/components/admin/ui";
import { Skeleton } from "@workspace/ui/components/skeleton";
import { fmtDateTime, timeAgo } from "@/lib/format";


interface Dashboard {
  periodDays: number;
  users: { total: number; new: number };
  businesses: { total: number; new: number; active: number };
  subscriptions: { trialing: number; active: number; expired: number };
  system: { failedJobs: number; smsSent: number; emailsSent: number };
}

interface AuditItem {
  id: string;
  action: string;
  createdAt: string;
  actor?: { name: string } | null;
  actorAdmin?: { name: string } | null;
}

const RANGES = [
  { label: "7 days", days: 7 },
  { label: "30 days", days: 30 },
  { label: "90 days", days: 90 },
];

export default function AdminDashboard() {
  const { can } = useAdmin();
  const pathname = usePathname();
  const locale = pathname.split("/")[1] ?? "en";
  const [days, setDays] = useState(30);
  const [stats, setStats] = useState<Dashboard | null>(null);
  const [activity, setActivity] = useState<AuditItem[]>([]);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let live = true;
    setLoading(true);
    setError(false);
    Promise.all([
      adminApi<Dashboard>("dashboard", { params: { days } }),
      adminApi<Paged<AuditItem>>("audit-logs", { params: { per_page: 8 } }).catch(
        () => null,
      ),
    ])
      .then(([d, a]) => {
        if (!live) return;
        setStats(d);
        setActivity(a?.items ?? []);
      })
      .catch(() => live && setError(true))
      .finally(() => live && setLoading(false));
    return () => {
      live = false;
    };
  }, [days]);

  const alerts = stats
    ? [
        stats.system.failedJobs > 0 && {
          label: `${stats.system.failedJobs} background job(s) failed`,
          href: `/${locale}/admin/audit-logs`,
        },
        stats.subscriptions.expired > 0 && {
          label: `${stats.subscriptions.expired} expired subscription(s)`,
          href: `/${locale}/admin/subscriptions?status=expired`,
        },
      ].filter(Boolean) as { label: string; href: string }[]
    : [];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Dashboard"
        description="What is happening on Wazabiashara right now."
        actions={
          <div className="flex gap-1 rounded-lg border border-border p-0.5">
            {RANGES.map((r) => (
              <button
                key={r.days}
                onClick={() => setDays(r.days)}
                className={`rounded-md px-3 py-1 text-xs font-medium transition-colors ${
                  days === r.days
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {r.label}
              </button>
            ))}
          </div>
        }
      />

      {error ? (
        <ErrorState onRetry={() => setDays((d) => d)} />
      ) : (
        <>
          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
            <StatCard
              label="Total Businesses"
              value={stats?.businesses.total ?? 0}
              hint={`+${stats?.businesses.new ?? 0} in ${days}d`}
              loading={loading}
              href={`/${locale}/admin/businesses`}
            />
            <StatCard
              label="Total Users"
              value={stats?.users.total ?? 0}
              hint={`+${stats?.users.new ?? 0} in ${days}d`}
              loading={loading}
              href={`/${locale}/admin/users`}
            />
            <StatCard
              label="Active Subscriptions"
              value={stats?.subscriptions.active ?? 0}
              hint={`${stats?.subscriptions.trialing ?? 0} trialing`}
              loading={loading}
              href={`/${locale}/admin/subscriptions`}
            />
            <StatCard
              label="Messages Sent"
              value={(stats?.system.smsSent ?? 0) + (stats?.system.emailsSent ?? 0)}
              hint="SMS + email"
              loading={loading}
            />
          </div>

          <div className="grid gap-4 lg:grid-cols-[1fr_1.4fr]">
            {/* Attention */}
            <div className="rounded-xl border border-border bg-card p-4">
              <h2 className="text-sm font-semibold">Needs attention</h2>
              <div className="mt-3 space-y-2">
                {loading ? (
                  <Skeleton className="h-16 w-full" />
                ) : alerts.length === 0 ? (
                  <div className="flex items-center gap-2 rounded-lg bg-emerald-50 px-3 py-3 text-xs text-emerald-800 dark:bg-emerald-950/30 dark:text-emerald-300">
                    <HugeiconsIcon icon={CheckIcon} className="size-4" strokeWidth={2.5} />
                    Everything looks good.
                  </div>
                ) : (
                  alerts.map((a) => (
                    <Link
                      key={a.label}
                      href={a.href}
                      className="flex items-center gap-2 rounded-lg border border-amber-200 bg-amber-50 px-3 py-2.5 text-xs font-medium text-amber-900 dark:border-amber-900 dark:bg-amber-950/30 dark:text-amber-200"
                    >
                      <HugeiconsIcon icon={AlertCircleIcon} className="size-4" strokeWidth={2} />
                      {a.label}
                    </Link>
                  ))
                )}
              </div>

              {/* Quick actions */}
              <h2 className="mt-6 text-sm font-semibold">Quick actions</h2>
              <div className="mt-3 grid grid-cols-2 gap-2">
                {can("admin.users.manage") && (
                  <QuickAction href={`/${locale}/admin/staff`} icon={AddCircleIcon} label="Add admin" />
                )}
                {can("admin.businesses.view") && (
                  <QuickAction href={`/${locale}/admin/businesses`} icon={StoreIcon} label="Businesses" />
                )}
                {can("admin.users.view") && (
                  <QuickAction href={`/${locale}/admin/users`} icon={UserMultipleIcon} label="Users" />
                )}
                {can("admin.packages.manage") && (
                  <QuickAction href={`/${locale}/admin/plans`} icon={BarChartIcon} label="Plans" />
                )}
                {can("admin.audit.view") && (
                  <QuickAction href={`/${locale}/admin/audit-logs`} icon={AuditIcon} label="Audit logs" />
                )}
              </div>
            </div>

            {/* Recent activity */}
            <div className="rounded-xl border border-border bg-card p-4">
              <h2 className="text-sm font-semibold">Recent activity</h2>
              <div className="mt-3 divide-y divide-border/60">
                {loading ? (
                  <div className="space-y-2 pt-1">
                    {[0, 1, 2, 3].map((i) => (
                      <Skeleton key={i} className="h-8 w-full" />
                    ))}
                  </div>
                ) : activity.length === 0 ? (
                  <p className="py-6 text-center text-xs text-muted-foreground">
                    No activity yet.
                  </p>
                ) : (
                  activity.map((a) => (
                    <div key={a.id} className="flex items-center justify-between gap-3 py-2.5">
                      <div className="min-w-0">
                        <p className="truncate text-xs font-medium">{a.action}</p>
                        <p className="text-[11px] text-muted-foreground">
                          {a.actor?.name ?? a.actorAdmin?.name ?? "System"}
                        </p>
                      </div>
                      <span className="shrink-0 text-[11px] text-muted-foreground" title={fmtDateTime(a.createdAt)}>
                        {timeAgo(a.createdAt)}
                      </span>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

function QuickAction({
  href,
  icon,
  label,
}: {
  href: string;
  icon: Parameters<typeof HugeiconsIcon>[0]["icon"];
  label: string;
}) {
  return (
    <Link
      href={href}
      className="flex items-center gap-2 rounded-lg border border-border px-3 py-2.5 text-xs font-medium transition-colors hover:bg-muted"
    >
      <HugeiconsIcon icon={icon} className="size-4 text-muted-foreground" strokeWidth={2} />
      {label}
    </Link>
  );
}
