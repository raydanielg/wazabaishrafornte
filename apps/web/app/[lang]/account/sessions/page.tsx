"use client";

/* eslint-disable react-hooks/set-state-in-effect -- fetch/loading states */

import { useCallback, useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { toast } from "@workspace/ui/components/toast";
import { Button } from "@workspace/ui/components/button";
import { HugeiconsIcon } from "@hugeicons/react";
import { ComputerIcon } from "@hugeicons/core-free-icons";
import { isLocale } from "@/lib/i18n";
import { Skeleton } from "@workspace/ui/components/skeleton";
import { EmptyState, ErrorState } from "@/components/admin/ui";
import { fmtDateTime } from "@/lib/format";

interface Session {
  id: string;
  token: string;
  createdAt: string;
  expiresAt: string;
  ipAddress?: string | null;
  userAgent?: string | null;
  current?: boolean;
}

export default function SessionsPage() {
  const lang = usePathname().split("/")[1] ?? "en";
  const isSw = (isLocale(lang) ? lang : "en") === "sw";
  const [sessions, setSessions] = useState<Session[] | null>(null);
  const [error, setError] = useState(false);
  const [busy, setBusy] = useState("");

  const load = useCallback(() => {
    setError(false);
    fetch("/api/app/auth/list-sessions", { cache: "no-store" })
      .then((r) => (r.ok ? r.json() : Promise.reject()))
      .then((j) => setSessions(Array.isArray(j) ? j : (j.sessions ?? [])))
      .catch(() => setError(true));
  }, []);
  useEffect(load, [load]);

  async function revoke(s: Session) {
    setBusy(s.id);
    try {
      await fetch("/api/app/auth/revoke-session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token: s.token }),
      });
      toast.add({ title: isSw ? "Kipindi kimeondolewa" : "Session revoked" });
      load();
    } catch {
      toast.add({ title: isSw ? "Imeshindikana" : "Failed", description: "" });
    } finally {
      setBusy("");
    }
  }

  return (
    <div className="max-w-lg space-y-6">
      <h1 className="text-xl font-semibold tracking-tight">
        {isSw ? "Vipindi" : "Sessions"}
      </h1>
      {error ? (
        <ErrorState onRetry={load} />
      ) : !sessions ? (
        <div className="space-y-2">
          {[0, 1, 2].map((i) => (
            <Skeleton key={i} className="h-16 w-full rounded-xl" />
          ))}
        </div>
      ) : sessions.length === 0 ? (
        <EmptyState title={isSw ? "Hakuna vipindi" : "No sessions"} />
      ) : (
        <div className="divide-y divide-border rounded-xl border border-border bg-card">
          {sessions.map((s) => (
            <div key={s.id} className="flex items-center justify-between gap-3 px-5 py-4">
              <div className="flex min-w-0 items-center gap-3">
                <HugeiconsIcon
                  icon={ComputerIcon}
                  className="size-5 shrink-0 text-muted-foreground"
                  strokeWidth={2}
                />
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium">
                    {s.userAgent?.slice(0, 50) ?? (isSw ? "Kifaa" : "Device")}
                    {s.current && (
                      <span className="ml-2 rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-medium text-emerald-800 dark:bg-emerald-950/50 dark:text-emerald-300">
                        {isSw ? "sasa" : "current"}
                      </span>
                    )}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {fmtDateTime(s.createdAt)}
                    {s.ipAddress ? ` · ${s.ipAddress}` : ""}
                  </p>
                </div>
              </div>
              {!s.current && (
                <Button
                  variant="outline"
                  size="xs"
                  disabled={busy === s.id}
                  onClick={() => revoke(s)}
                >
                  {isSw ? "Ondoa" : "Revoke"}
                </Button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
