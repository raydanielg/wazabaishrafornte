"use client";

/* eslint-disable react-hooks/set-state-in-effect -- fetch loading states */

import { useEffect, useState } from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  AlertCircleIcon,
  SearchIcon,
  ArrowLeft01Icon,
  ArrowRight01Icon,
} from "@hugeicons/core-free-icons";
import { Button } from "@workspace/ui/components/button";
import { Input } from "@workspace/ui/components/input";
import { Skeleton } from "@workspace/ui/components/skeleton";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@workspace/ui/components/alert-dialog";
import { Textarea } from "@workspace/ui/components/textarea";
import { Label } from "@workspace/ui/components/label";
import { cn } from "@workspace/ui/lib/utils";
import type { Paged } from "@/lib/admin-api";


/* ---------- Page header (§66) ---------- */
export function PageHeader({
  title,
  description,
  actions,
}: {
  title: string;
  description?: string;
  actions?: React.ReactNode;
}) {
  return (
    <div className="flex flex-wrap items-start justify-between gap-3">
      <div>
        <h1 className="text-xl font-semibold tracking-tight">{title}</h1>
        {description && (
          <p className="mt-0.5 text-sm text-muted-foreground">{description}</p>
        )}
      </div>
      {actions && <div className="flex items-center gap-2">{actions}</div>}
    </div>
  );
}

/* ---------- Status badge ---------- */
const STATUS_TONE: Record<string, string> = {
  active: "bg-emerald-100 text-emerald-800 dark:bg-emerald-950/50 dark:text-emerald-300",
  trialing: "bg-sky-100 text-sky-800 dark:bg-sky-950/50 dark:text-sky-300",
  invited: "bg-sky-100 text-sky-800 dark:bg-sky-950/50 dark:text-sky-300",
  past_due: "bg-amber-100 text-amber-800 dark:bg-amber-950/50 dark:text-amber-300",
  suspended: "bg-amber-100 text-amber-800 dark:bg-amber-950/50 dark:text-amber-300",
  partial: "bg-amber-100 text-amber-800 dark:bg-amber-950/50 dark:text-amber-300",
  pending: "bg-amber-100 text-amber-800 dark:bg-amber-950/50 dark:text-amber-300",
  expired: "bg-red-100 text-red-800 dark:bg-red-950/50 dark:text-red-300",
  cancelled: "bg-red-100 text-red-800 dark:bg-red-950/50 dark:text-red-300",
  failed: "bg-red-100 text-red-800 dark:bg-red-950/50 dark:text-red-300",
  blocked: "bg-red-100 text-red-800 dark:bg-red-950/50 dark:text-red-300",
  inactive: "bg-muted text-muted-foreground",
  removed: "bg-muted text-muted-foreground",
  open: "bg-sky-100 text-sky-800 dark:bg-sky-950/50 dark:text-sky-300",
  in_progress: "bg-sky-100 text-sky-800 dark:bg-sky-950/50 dark:text-sky-300",
  waiting: "bg-amber-100 text-amber-800 dark:bg-amber-950/50 dark:text-amber-300",
  resolved: "bg-emerald-100 text-emerald-800 dark:bg-emerald-950/50 dark:text-emerald-300",
  closed: "bg-muted text-muted-foreground",
  draft: "bg-muted text-muted-foreground",
  sent: "bg-emerald-100 text-emerald-800 dark:bg-emerald-950/50 dark:text-emerald-300",
  scheduled: "bg-sky-100 text-sky-800 dark:bg-sky-950/50 dark:text-sky-300",
  completed: "bg-emerald-100 text-emerald-800 dark:bg-emerald-950/50 dark:text-emerald-300",
  running: "bg-sky-100 text-sky-800 dark:bg-sky-950/50 dark:text-sky-300",
  urgent: "bg-red-100 text-red-800 dark:bg-red-950/50 dark:text-red-300",
  high: "bg-amber-100 text-amber-800 dark:bg-amber-950/50 dark:text-amber-300",
  normal: "bg-muted text-muted-foreground",
  low: "bg-muted text-muted-foreground",
  info: "bg-sky-100 text-sky-800 dark:bg-sky-950/50 dark:text-sky-300",
  warn: "bg-amber-100 text-amber-800 dark:bg-amber-950/50 dark:text-amber-300",
  error: "bg-red-100 text-red-800 dark:bg-red-950/50 dark:text-red-300",
};

export function StatusBadge({ status }: { status: string }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium capitalize",
        STATUS_TONE[status] ?? "bg-muted text-muted-foreground",
      )}
    >
      {status.replace(/_/g, " ")}
    </span>
  );
}

/* ---------- Stat card (§10) ---------- */
export function StatCard({
  label,
  value,
  hint,
  href,
  loading,
}: {
  label: string;
  value: React.ReactNode;
  hint?: string;
  href?: string;
  loading?: boolean;
}) {
  const inner = (
    <div className="rounded-xl border border-border bg-card p-4 transition-colors hover:bg-muted/40">
      <p className="text-xs text-muted-foreground">{label}</p>
      {loading ? (
        <Skeleton className="mt-2 h-7 w-20" />
      ) : (
        <p className="mt-1 text-2xl font-semibold tracking-tight tabular-nums">
          {value}
        </p>
      )}
      {hint && <p className="mt-1 text-xs text-muted-foreground">{hint}</p>}
    </div>
  );
  return href ? <a href={href}>{inner}</a> : inner;
}

/* ---------- Empty / Error states (§50–51) ---------- */
export function EmptyState({
  title = "Nothing here yet",
  hint = "Try changing your filters or search.",
}: {
  title?: string;
  hint?: string;
}) {
  return (
    <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border py-14 text-center">
      <p className="text-sm font-medium text-foreground">{title}</p>
      <p className="mt-1 text-xs text-muted-foreground">{hint}</p>
    </div>
  );
}

export function ErrorState({ onRetry }: { onRetry?: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-destructive/40 py-14 text-center">
      <HugeiconsIcon
        icon={AlertCircleIcon}
        className="size-6 text-destructive"
        strokeWidth={2}
      />
      <p className="mt-2 text-sm font-medium">Something went wrong.</p>
      {onRetry && (
        <Button variant="outline" size="sm" className="mt-3" onClick={onRetry}>
          Try again
        </Button>
      )}
    </div>
  );
}

/* ---------- Data table (§45) ---------- */
export interface Column<T> {
  header: string;
  cell: (row: T) => React.ReactNode;
  className?: string;
}

export function DataTable<T>({
  data,
  columns,
  loading,
  error,
  onRetry,
  search,
  onSearch,
  searchPlaceholder = "Search…",
  onRowClick,
  emptyTitle,
}: {
  data: (Paged<T> & Record<string, unknown>) | null;
  columns: Column<T>[];
  loading?: boolean;
  error?: boolean;
  onRetry?: () => void;
  search?: string;
  onSearch?: (v: string) => void;
  searchPlaceholder?: string;
  onRowClick?: (row: T) => void;
  emptyTitle?: string;
}) {
  const [term, setTerm] = useState(search ?? "");
  useEffect(() => setTerm(search ?? ""), [search]);

  return (
    <div className="space-y-3">
      {onSearch && (
        <div className="max-w-xs">
          <Input
            value={term}
            onChange={(e) => {
              setTerm(e.target.value);
            }}
            onKeyDown={(e) => e.key === "Enter" && onSearch(term)}
            onBlur={() => onSearch(term)}
            placeholder={searchPlaceholder}
            density="compact"
            icon={<HugeiconsIcon icon={SearchIcon} strokeWidth={2} />}
          />
        </div>
      )}
      {error ? (
        <ErrorState onRetry={onRetry} />
      ) : loading ? (
        <div className="space-y-2">
          {[0, 1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-12 w-full rounded-lg" />
          ))}
        </div>
      ) : !data || data.items.length === 0 ? (
        <EmptyState title={emptyTitle} />
      ) : (
        <>
          <div className="overflow-x-auto rounded-xl border border-border">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-muted/40 text-left">
                  {columns.map((c) => (
                    <th
                      key={c.header}
                      className={cn(
                        "px-4 py-2.5 text-xs font-medium text-muted-foreground",
                        c.className,
                      )}
                    >
                      {c.header}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {data.items.map((row, i) => (
                  <tr
                    key={i}
                    onClick={onRowClick ? () => onRowClick(row) : undefined}
                    className={cn(
                      "border-b border-border/60 last:border-0",
                      onRowClick && "cursor-pointer hover:bg-muted/40",
                    )}
                  >
                    {columns.map((c) => (
                      <td key={c.header} className={cn("px-4 py-3", c.className)}>
                        {c.cell(row)}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <Pagination data={data} />
        </>
      )}
    </div>
  );
}

function Pagination<T>({ data }: { data: Paged<T> }) {
  const pages = Math.max(1, Math.ceil(data.total / data.per_page));
  if (pages <= 1) return null;
  const go = (p: number) => {
    const url = new URL(window.location.href);
    url.searchParams.set("page", String(p));
    window.history.pushState({}, "", url);
    window.dispatchEvent(new Event("wz:page"));
  };
  return (
    <div className="flex items-center justify-between text-xs text-muted-foreground">
      <span>
        Page {data.page} of {pages} · {data.total} total
      </span>
      <div className="flex gap-1">
        <Button
          variant="outline"
          size="icon-sm"
          disabled={data.page <= 1}
          onClick={() => go(data.page - 1)}
          aria-label="Previous page"
        >
          <HugeiconsIcon icon={ArrowLeft01Icon} strokeWidth={2} />
        </Button>
        <Button
          variant="outline"
          size="icon-sm"
          disabled={data.page >= pages}
          onClick={() => go(data.page + 1)}
          aria-label="Next page"
        >
          <HugeiconsIcon icon={ArrowRight01Icon} strokeWidth={2} />
        </Button>
      </div>
    </div>
  );
}

/* ---------- Confirm dialog (§47) ---------- */
export function ConfirmDialog({
  open,
  onOpenChange,
  title,
  description,
  confirmLabel = "Confirm",
  destructive,
  requireReason,
  loading,
  onConfirm,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  title: string;
  description?: string;
  confirmLabel?: string;
  destructive?: boolean;
  requireReason?: boolean;
  loading?: boolean;
  onConfirm: (reason?: string) => void;
}) {
  const [reason, setReason] = useState("");
  useEffect(() => {
    if (!open) setReason("");
  }, [open]);
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          {description && (
            <AlertDialogDescription>{description}</AlertDialogDescription>
          )}
        </AlertDialogHeader>
        {requireReason && (
          <div className="space-y-1.5">
            <Label htmlFor="confirm-reason">Reason</Label>
            <Textarea
              className="rounded-lg"
              id="confirm-reason"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              rows={2}
              placeholder="Why is this action being taken?"
            />
          </div>
        )}
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            variant={destructive ? "destructive" : "default"}
            disabled={loading || (requireReason && reason.trim().length < 3)}
            onClick={() => onConfirm(reason.trim() || undefined)}
          >
            {loading ? "Working…" : confirmLabel}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
