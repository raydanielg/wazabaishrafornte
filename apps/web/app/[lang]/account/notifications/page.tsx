"use client";

/* eslint-disable react-hooks/set-state-in-effect -- fetch/loading states */

import { useCallback, useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { isLocale } from "@/lib/i18n";
import { Skeleton } from "@workspace/ui/components/skeleton";
import { EmptyState, ErrorState } from "@/components/admin/ui";
import { timeAgo } from "@/lib/format";
import { cn } from "@workspace/ui/lib/utils";

interface Notif {
  id: string;
  title: string;
  body: string;
  type?: string;
  readAt: string | null;
  createdAt: string;
}

export default function NotificationsPage() {
  const lang = usePathname().split("/")[1] ?? "en";
  const isSw = (isLocale(lang) ? lang : "en") === "sw";
  const [items, setItems] = useState<Notif[] | null>(null);
  const [error, setError] = useState(false);

  const load = useCallback(() => {
    setError(false);
    fetch("/api/app/v1/notifications?per_page=50", { cache: "no-store" })
      .then((r) => (r.ok ? r.json() : Promise.reject()))
      .then((j) => setItems(j.data?.items ?? j.data ?? []))
      .catch(() => setError(true));
  }, []);
  useEffect(load, [load]);

  async function markRead(n: Notif) {
    if (n.readAt) return;
    setItems((xs) => xs?.map((x) => (x.id === n.id ? { ...x, readAt: new Date().toISOString() } : x)) ?? xs);
    fetch(`/api/app/v1/notifications/${n.id}/read`, { method: "POST" }).catch(() => {});
  }

  const unread = items?.filter((n) => !n.readAt).length ?? 0;

  return (
    <div className="max-w-lg space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold tracking-tight">
          {isSw ? "Arifa" : "Notifications"}
        </h1>
        {unread > 0 && (
          <span className="rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-medium">
            {unread} {isSw ? "mbili" : "unread"}
          </span>
        )}
      </div>
      {error ? (
        <ErrorState onRetry={load} />
      ) : !items ? (
        <div className="space-y-2">
          {[0, 1, 2].map((i) => (
            <Skeleton key={i} className="h-16 w-full rounded-xl" />
          ))}
        </div>
      ) : items.length === 0 ? (
        <EmptyState title={isSw ? "Hakuna arifa" : "No notifications"} />
      ) : (
        <div className="divide-y divide-border rounded-xl border border-border bg-card">
          {items.map((n) => (
            <button
              key={n.id}
              onClick={() => markRead(n)}
              className={cn(
                "block w-full px-5 py-4 text-left transition-colors hover:bg-muted/40",
                !n.readAt && "bg-primary/5",
              )}
            >
              <div className="flex items-start justify-between gap-3">
                <p className="text-sm font-medium">{n.title}</p>
                {!n.readAt && <span className="mt-1 size-2 shrink-0 rounded-full bg-primary" />}
              </div>
              <p className="mt-0.5 text-xs text-muted-foreground line-clamp-2">{n.body}</p>
              <p className="mt-1 text-[11px] text-muted-foreground/70">{timeAgo(n.createdAt)}</p>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
