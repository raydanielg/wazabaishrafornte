"use client";

/* eslint-disable react-hooks/set-state-in-effect -- fetch/loading states */

import { useCallback, useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { HugeiconsIcon } from "@hugeicons/react";
import { StoreIcon } from "@hugeicons/core-free-icons";
import { isLocale } from "@/lib/i18n";
import { Skeleton } from "@workspace/ui/components/skeleton";
import { EmptyState, ErrorState, StatusBadge } from "@/components/admin/ui";

interface Membership {
  membershipId: string;
  status: string;
  role: { name: string; isOwner: boolean };
  business: {
    id: string;
    name: string;
    slug: string;
    status: string;
    type?: { name: string } | null;
  };
}

export default function AccountBusinessesPage() {
  const lang = usePathname().split("/")[1] ?? "en";
  const isSw = (isLocale(lang) ? lang : "en") === "sw";
  const [items, setItems] = useState<Membership[] | null>(null);
  const [error, setError] = useState(false);

  const load = useCallback(() => {
    setError(false);
    fetch("/api/app/v1/me", { cache: "no-store" })
      .then((r) => (r.ok ? r.json() : Promise.reject()))
      .then((j) => setItems(j.data?.businesses ?? []))
      .catch(() => setError(true));
  }, []);
  useEffect(load, [load]);

  return (
    <div className="max-w-lg space-y-6">
      <h1 className="text-xl font-semibold tracking-tight">
        {isSw ? "Biashara zangu" : "My businesses"}
      </h1>
      {error ? (
        <ErrorState onRetry={load} />
      ) : !items ? (
        <div className="space-y-2">
          {[0, 1].map((i) => (
            <Skeleton key={i} className="h-20 w-full rounded-xl" />
          ))}
        </div>
      ) : items.length === 0 ? (
        <EmptyState
          title={isSw ? "Hujajiunga na biashara" : "No businesses yet"}
          hint={isSw ? "Unda biashara yako ndani ya app." : "Create your business inside the app."}
        />
      ) : (
        <div className="divide-y divide-border rounded-xl border border-border bg-card">
          {items.map((m) => (
            <div key={m.membershipId} className="flex items-center justify-between gap-3 px-5 py-4">
              <div className="flex min-w-0 items-center gap-3">
                <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                  <HugeiconsIcon icon={StoreIcon} className="size-5" strokeWidth={2} />
                </div>
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium">{m.business.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {m.role.name}
                    {m.business.type?.name ? ` · ${m.business.type.name}` : ""}
                  </p>
                </div>
              </div>
              <StatusBadge status={m.business.status} />
            </div>
          ))}
        </div>
      )}
      <p className="text-xs text-muted-foreground">
        {isSw
          ? "Usimamizi wa biashara unafanyika ndani ya app ya Wazabiashara."
          : "Business management happens inside the Wazabiashara app."}
      </p>
    </div>
  );
}
