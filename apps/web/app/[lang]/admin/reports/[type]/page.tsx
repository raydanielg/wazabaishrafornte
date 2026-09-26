"use client";

/* eslint-disable react-hooks/set-state-in-effect -- fetch/loading states */

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { useParams, usePathname } from "next/navigation";
import { HugeiconsIcon } from "@hugeicons/react";
import { ArrowLeft01Icon } from "@hugeicons/core-free-icons";
import { Skeleton } from "@workspace/ui/components/skeleton";
import { cn } from "@workspace/ui/lib/utils";
import { adminApi } from "@/lib/admin-api";
import { PageHeader, StatCard, ErrorState } from "@/components/admin/ui";
import { fmtTzs } from "@/lib/format";

const RANGES = [7, 30, 90] as const;
const TITLES: Record<string, string> = {
  revenue: "Revenue",
  sales: "Sales activity",
  users: "Users",
  businesses: "Businesses",
  subscriptions: "Subscriptions",
  financial: "Financial",
};

interface Daily { date: string; count: number; total: number }
interface Report {
  daily?: Daily[];
  total?: number | string;
  count?: number;
  active?: number;
  totals?: Record<string, number | string>;
  byStatus?: Record<string, number>;
  byPackage?: { name: string; count: number }[];
  revenue?: string | number;
  expenses?: string | number;
  outstandingDebt?: string | number;
}

export default function ReportPage() {
  const { type } = useParams<{ type: string }>();
  const locale = usePathname().split("/")[1] ?? "en";
  const [days, setDays] = useState<number>(30);
  const [report, setReport] = useState<Report | null>(null);
  const [error, setError] = useState(false);

  const load = useCallback(() => {
    setError(false);
    setReport(null);
    adminApi<Report>(`reports/${type}`, { params: { days } })
      .then(setReport)
      .catch(() => setError(true));
  }, [type, days]);
  useEffect(load, [load]);

  const daily = report?.daily ?? [];
  const max = Math.max(1, ...daily.map((d) => (type === "users" || type === "businesses" ? d.count : d.total || d.count)));
  const valueOf = (d: Daily) => (type === "users" || type === "businesses" ? d.count : d.total || d.count);

  return (
    <div className="space-y-6">
      <div>
        <Link
          href={`/${locale}/admin/reports`}
          className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground"
        >
          <HugeiconsIcon icon={ArrowLeft01Icon} className="size-3.5" strokeWidth={2} />
          Reports
        </Link>
        <PageHeader
          title={TITLES[type] ?? type}
          description={`Last ${days} days · live data`}
          actions={
            <div className="flex gap-1">
              {RANGES.map((r) => (
                <button
                  key={r}
                  onClick={() => setDays(r)}
                  className={cn(
                    "rounded-lg px-3 py-1.5 text-xs font-medium transition-colors",
                    days === r
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted text-muted-foreground hover:text-foreground",
                  )}
                >
                  {r}d
                </button>
              ))}
            </div>
          }
        />
      </div>

      {error ? (
        <ErrorState onRetry={load} />
      ) : !report ? (
        <Skeleton className="h-64 w-full rounded-xl" />
      ) : (
        <>
          {/* Totals row */}
          <div className="grid gap-3 sm:grid-cols-3">
            {report.totals &&
              Object.entries(report.totals).map(([k, v]) => (
                <StatCard
                  key={k}
                  label={k}
                  value={k === "revenue" ? fmtTzs(String(v)) : v}
                />
              ))}
            {report.total !== undefined && !report.totals && (
              <StatCard
                label={type === "revenue" || type === "sales" ? "Total" : "All time"}
                value={
                  type === "revenue" ? fmtTzs(String(report.total)) : report.total
                }
                hint={report.count !== undefined ? `${report.count} transactions` : undefined}
              />
            )}
            {report.active !== undefined && (
              <StatCard label="Active" value={report.active} />
            )}
            {report.revenue !== undefined && (
              <>
                <StatCard label="Revenue" value={fmtTzs(String(report.revenue))} />
                <StatCard label="Expenses" value={fmtTzs(String(report.expenses ?? 0))} />
                <StatCard label="Outstanding debt" value={fmtTzs(String(report.outstandingDebt ?? 0))} />
              </>
            )}
          </div>

          {/* Status/package breakdowns */}
          {(report.byStatus || report.byPackage) && (
            <div className="grid gap-3 sm:grid-cols-2">
              {report.byStatus && (
                <div className="rounded-xl border border-border bg-card p-5">
                  <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                    By status
                  </p>
                  <div className="mt-3 space-y-2">
                    {Object.entries(report.byStatus).map(([k, v]) => (
                      <div key={k} className="flex justify-between text-sm">
                        <span className="capitalize text-muted-foreground">{k.replace(/_/g, " ")}</span>
                        <span className="font-medium tabular-nums">{v}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              {report.byPackage && (
                <div className="rounded-xl border border-border bg-card p-5">
                  <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                    By plan
                  </p>
                  <div className="mt-3 space-y-2">
                    {report.byPackage.map((p) => (
                      <div key={p.name} className="flex justify-between text-sm">
                        <span className="text-muted-foreground">{p.name}</span>
                        <span className="font-medium tabular-nums">{p.count}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Daily chart — pure CSS bars, real data */}
          {daily.length > 0 && (
            <div className="rounded-xl border border-border bg-card p-5">
              <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                Daily
              </p>
              <div className="mt-4 flex h-40 items-end gap-px overflow-x-auto">
                {daily.map((d) => (
                  <div
                    key={d.date}
                    title={`${d.date}: ${type === "revenue" ? fmtTzs(String(d.total)) : valueOf(d)}`}
                    className="group relative min-w-2 flex-1 rounded-t bg-primary/70 transition-colors hover:bg-primary"
                    style={{ height: `${Math.max(2, (valueOf(d) / max) * 100)}%` }}
                  />
                ))}
              </div>
              <div className="mt-2 flex justify-between text-[10px] text-muted-foreground">
                <span>{daily[0]?.date}</span>
                <span>{daily[daily.length - 1]?.date}</span>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
