"use client";

/* eslint-disable react-hooks/set-state-in-effect -- fetch/loading states */

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { isLocale } from "@/lib/i18n";
import { Skeleton } from "@workspace/ui/components/skeleton";
import { EmptyState, ErrorState, StatusBadge } from "@/components/admin/ui";
import { fmtDate, fmtTzs } from "@/lib/format";

interface BizPlan {
  membershipId: string;
  business: { id: string; name: string; status: string };
}

interface Plan {
  status: string;
  startDate: string;
  endDate: string | null;
  trialEndsAt: string | null;
  package: { name: string; price: string; currency: string; billingPeriod: string };
}

export default function SubscriptionPage() {
  const lang = usePathname().split("/")[1] ?? "en";
  const locale = isLocale(lang) ? lang : "en";
  const isSw = locale === "sw";
  const [rows, setRows] = useState<{ biz: BizPlan["business"]; plan: Plan | null }[] | null>(null);
  const [error, setError] = useState(false);

  const load = useCallback(async () => {
    setError(false);
    try {
      const me = await fetch("/api/app/v1/me", { cache: "no-store" }).then((r) => {
        if (!r.ok) throw new Error();
        return r.json();
      });
      const businesses: BizPlan[] = me.data?.businesses ?? [];
      const plans = await Promise.all(
        businesses.map((b) =>
          fetch(`/api/app/v1/businesses/${b.business.id}/plan`, { cache: "no-store" })
            .then((r) => (r.ok ? r.json() : null))
            .then((j) => ({ biz: b.business, plan: (j?.data?.subscription ?? j?.data ?? null) as Plan | null }))
            .catch(() => ({ biz: b.business, plan: null })),
        ),
      );
      setRows(plans);
    } catch {
      setError(true);
    }
  }, []);
  useEffect(() => {
    load();
  }, [load]);

  return (
    <div className="max-w-lg space-y-6">
      <h1 className="text-xl font-semibold tracking-tight">
        {isSw ? "Mfuko" : "Subscription"}
      </h1>
      {error ? (
        <ErrorState onRetry={load} />
      ) : !rows ? (
        <Skeleton className="h-32 w-full rounded-xl" />
      ) : rows.length === 0 ? (
        <EmptyState
          title={isSw ? "Hakuna biashara" : "No businesses"}
          hint={isSw ? "Unda biashara ndani ya app kwanza." : "Create a business in the app first."}
        />
      ) : (
        <div className="space-y-3">
          {rows.map(({ biz, plan }) => (
            <div key={biz.id} className="rounded-xl border border-border bg-card p-5">
              <div className="flex items-center justify-between">
                <p className="font-medium">{biz.name}</p>
                {plan && <StatusBadge status={plan.status} />}
              </div>
              {plan ? (
                <dl className="mt-3 space-y-2 text-sm">
                  <div className="flex justify-between">
                    <dt className="text-muted-foreground">{isSw ? "Mpango" : "Plan"}</dt>
                    <dd className="font-medium">
                      {plan.package.name} ·{" "}
                      {Number(plan.package.price) === 0
                        ? isSw ? "Bure" : "Free"
                        : `${fmtTzs(plan.package.price)}/${plan.package.billingPeriod}`}
                    </dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-muted-foreground">{isSw ? "Inaisha" : "Renews/Ends"}</dt>
                    <dd>{fmtDate(plan.endDate ?? plan.trialEndsAt)}</dd>
                  </div>
                </dl>
              ) : (
                <p className="mt-2 text-sm text-muted-foreground">
                  {isSw ? "Hakuna mpango" : "No subscription"}
                </p>
              )}
            </div>
          ))}
          <Link
            href={`/${locale}/pricing`}
            className="block text-sm text-muted-foreground underline-offset-4 hover:underline"
          >
            {isSw ? "Angalia mipango" : "View plans"} →
          </Link>
        </div>
      )}
    </div>
  );
}
