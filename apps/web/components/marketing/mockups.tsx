import { HugeiconsIcon } from "@hugeicons/react";
import {
  HomeIcon,
  ShoppingCartIcon,
  PackageIcon,
  UserMultipleIcon,
  BarChartIcon,
  AlertCircleIcon,
} from "@hugeicons/core-free-icons";
import { cn } from "@workspace/ui/lib/utils";
import type { Dictionary } from "@/lib/i18n";

/**
 * Lightweight product mockups (§9, §50) — CSS-only, realistic TZ data.
 * Illustrative marketing visuals, not the real app.
 */

const fmt = (n: number) => `TZS ${n.toLocaleString("en-US")}`;

export function DashboardMockup({
  dict,
  className,
}: {
  dict: Dictionary;
  className?: string;
}) {
  const stats = [
    { label: dict.hero.mock.today, value: fmt(845000) },
    { label: dict.hero.mock.expenses, value: fmt(120000) },
    { label: dict.hero.mock.profit, value: fmt(185000) },
  ];
  const sales = [
    { name: "Coca Cola ×2", amount: fmt(3000) },
    { name: "Mchele 5kg", amount: fmt(17500) },
    { name: "Cooking Oil 2L", amount: fmt(14000) },
    { name: "Sabuni ×3", amount: fmt(4500) },
  ];
  return (
    <div
      className={cn(
        "overflow-hidden rounded-xl border border-border bg-card text-left shadow-sm",
        className,
      )}
      aria-hidden="true"
    >
      {/* window chrome */}
      <div className="flex items-center gap-1.5 border-b border-border bg-muted/50 px-4 py-2.5">
        <span className="size-2.5 rounded-full bg-border" />
        <span className="size-2.5 rounded-full bg-border" />
        <span className="size-2.5 rounded-full bg-border" />
        <span className="ml-3 text-[11px] font-medium text-muted-foreground">
          Mwanza Mini Mart
        </span>
      </div>
      <div className="flex">
        {/* mini sidebar */}
        <div className="hidden w-32 shrink-0 space-y-1 border-r border-border bg-muted/30 p-3 sm:block">
          {[
            { icon: HomeIcon, label: dict.showcase.tabs.dashboard, active: true },
            { icon: ShoppingCartIcon, label: dict.showcase.tabs.sales },
            { icon: PackageIcon, label: dict.showcase.tabs.products },
            { icon: UserMultipleIcon, label: dict.showcase.tabs.customers },
            { icon: BarChartIcon, label: dict.showcase.tabs.reports },
          ].map((i) => (
            <div
              key={i.label}
              className={cn(
                "flex items-center gap-2 rounded-md px-2 py-1.5 text-[11px]",
                i.active
                  ? "bg-primary/20 font-medium text-foreground"
                  : "text-muted-foreground",
              )}
            >
              <HugeiconsIcon icon={i.icon} className="size-3.5" strokeWidth={2} />
              {i.label}
            </div>
          ))}
        </div>
        {/* content */}
        <div className="min-w-0 flex-1 p-4">
          <div className="grid grid-cols-3 gap-2">
            {stats.map((s) => (
              <div
                key={s.label}
                className="rounded-lg border border-border bg-background p-2.5"
              >
                <p className="truncate text-[10px] text-muted-foreground">
                  {s.label}
                </p>
                <p className="mt-0.5 truncate text-xs font-semibold sm:text-sm">
                  {s.value}
                </p>
              </div>
            ))}
          </div>
          <div className="mt-3 rounded-lg border border-border bg-background">
            <div className="flex items-center justify-between border-b border-border px-3 py-2">
              <p className="text-[11px] font-medium">{dict.hero.mock.recentSales}</p>
            </div>
            {sales.map((s, i) => (
              <div
                key={s.name}
                className={cn(
                  "flex items-center justify-between px-3 py-2 text-[11px]",
                  i !== sales.length - 1 && "border-b border-border/60",
                )}
              >
                <span className="text-muted-foreground">{s.name}</span>
                <span className="font-medium tabular-nums">{s.amount}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export function PhoneMockup({
  dict,
  className,
}: {
  dict: Dictionary;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "w-44 overflow-hidden rounded-[1.75rem] border-[5px] border-foreground/85 bg-card shadow-md",
        className,
      )}
      aria-hidden="true"
    >
      {/* notch */}
      <div className="flex justify-center bg-foreground/85 pb-1.5">
        <div className="h-3.5 w-16 rounded-b-lg bg-foreground/85" />
      </div>
      <div className="p-3">
        <p className="text-[10px] text-muted-foreground">{dict.hero.mock.today}</p>
        <p className="text-base font-bold tabular-nums">{fmt(845000)}</p>
        <div className="mt-2.5 space-y-1.5">
          {[
            { l: dict.hero.mock.expenses, v: fmt(120000) },
            { l: dict.hero.mock.profit, v: fmt(185000) },
          ].map((r) => (
            <div
              key={r.l}
              className="flex items-center justify-between rounded-md bg-muted/60 px-2 py-1.5 text-[10px]"
            >
              <span className="text-muted-foreground">{r.l}</span>
              <span className="font-medium tabular-nums">{r.v}</span>
            </div>
          ))}
        </div>
        <div className="mt-2.5 flex items-center gap-1.5 rounded-md border border-border px-2 py-1.5 text-[10px]">
          <HugeiconsIcon
            icon={AlertCircleIcon}
            className="size-3 text-amber-600"
            strokeWidth={2}
          />
          <span className="truncate text-muted-foreground">
            {dict.hero.mock.lowStock}: Maji 1.5L
          </span>
        </div>
      </div>
      {/* bottom nav */}
      <div className="flex justify-around border-t border-border px-2 py-2">
        {[HomeIcon, ShoppingCartIcon, PackageIcon, UserMultipleIcon].map(
          (Icon, i) => (
            <HugeiconsIcon
              key={i}
              icon={Icon}
              className={cn(
                "size-3.5",
                i === 0 ? "text-foreground" : "text-muted-foreground",
              )}
              strokeWidth={2}
            />
          ),
        )}
      </div>
    </div>
  );
}

/** Compact list mockup used in feature blocks. */
export function ListMockup({
  rows,
  className,
}: {
  rows: { label: string; value: string; muted?: boolean }[];
  className?: string;
}) {
  return (
    <div
      className={cn(
        "w-full overflow-hidden rounded-xl border border-border bg-card shadow-sm",
        className,
      )}
      aria-hidden="true"
    >
      {rows.map((r, i) => (
        <div
          key={r.label}
          className={cn(
            "flex items-center justify-between px-4 py-3 text-sm",
            i !== rows.length - 1 && "border-b border-border/60",
          )}
        >
          <span className="text-muted-foreground">{r.label}</span>
          <span
            className={cn(
              "font-medium tabular-nums",
              r.muted && "text-muted-foreground",
            )}
          >
            {r.value}
          </span>
        </div>
      ))}
    </div>
  );
}
