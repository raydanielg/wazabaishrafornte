"use client";

/* eslint-disable react-hooks/set-state-in-effect -- fetch loading states */

import { useCallback, useEffect, useState } from "react";
import { Button } from "@workspace/ui/components/button";
import { toast } from "@workspace/ui/components/toast";
import { adminApi } from "@/lib/admin-api";
import { useAdmin } from "@/components/admin/admin-gate";
import {
  PageHeader,
  StatusBadge,
  ConfirmDialog,
  ErrorState,
} from "@/components/admin/ui";
import { Skeleton } from "@workspace/ui/components/skeleton";
import { fmtDate, fmtDateTime } from "@/lib/format";


interface BizDetail {
  id: string;
  name: string;
  slug: string;
  status: string;
  phone: string | null;
  email: string | null;
  createdAt: string;
  businessType?: { name: string } | null;
  subscription?: {
    status: string;
    startDate: string;
    endDate: string | null;
    package?: { name: string; price: string; currency: string } | null;
  } | null;
  memberships: {
    id: string;
    status: string;
    createdAt: string;
    user: { id: string; name: string; email: string | null; status: string };
    role: { key: string; name: string; isOwner: boolean };
  }[];
  auditLogs: { id: string; action: string; createdAt: string }[];
  _count?: { products: number; sales: number; customers: number };
}

export default function BusinessDetailPage({
  params,
}: {
  params: Promise<{ id: string; lang: string }>;
}) {
  const [id, setId] = useState("");
  useEffect(() => {
    params.then((p) => {
      setId(p.id);
    });
  }, [params]);

  const { can } = useAdmin();
  const [biz, setBiz] = useState<BizDetail | null>(null);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(true);
  const [confirm, setConfirm] = useState<"suspend" | "activate" | null>(null);
  const [busy, setBusy] = useState(false);
  const [actionError, setActionError] = useState("");

  const load = useCallback(() => {
    if (!id) return;
    setLoading(true);
    setError(false);
    adminApi<BizDetail>(`businesses/${id}`)
      .then(setBiz)
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  }, [id]);

  useEffect(load, [load]);

  async function changeStatus(status: string, reason?: string) {
    setBusy(true);
    setActionError("");
    try {
      await adminApi(`businesses/${id}/status`, {
        method: "POST",
        body: { status, reason },
      });
      toast.add({ title: status === "active" ? "Business activated" : "Business suspended" });
      setConfirm(null);
      load();
    } catch (e) {
      setActionError(e instanceof Error ? e.message : "Action failed");
    } finally {
      setBusy(false);
    }
  }

  if (error) return <ErrorState onRetry={load} />;
  if (loading || !biz) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-10 w-64" />
        <Skeleton className="h-40 w-full" />
      </div>
    );
  }

  const owner = biz.memberships.find((m) => m.role.isOwner);

  return (
    <div className="space-y-6">
      <PageHeader
        title={biz.name}
        description={`Business ID: ${biz.id}`}
        actions={
          can("admin.businesses.manage") ? (
            biz.status === "active" ? (
              <Button
                variant="outline"
                size="sm"
                onClick={() => setConfirm("suspend")}
              >
                Suspend
              </Button>
            ) : (
              <Button size="sm" onClick={() => setConfirm("activate")}>
                Activate
              </Button>
            )
          ) : undefined
        }
      />
      {actionError && <p className="text-sm text-destructive">{actionError}</p>}

      <div className="grid gap-4 lg:grid-cols-3">
        {/* Overview */}
        <div className="rounded-xl border border-border bg-card p-5">
          <h2 className="text-sm font-semibold">Overview</h2>
          <dl className="mt-3 space-y-2.5 text-sm">
            <Row label="Status" value={<StatusBadge status={biz.status} />} />
            <Row label="Type" value={biz.businessType?.name ?? "—"} />
            <Row label="Phone" value={biz.phone ?? "—"} />
            <Row label="Email" value={biz.email ?? "—"} />
            <Row label="Created" value={fmtDate(biz.createdAt)} />
          </dl>
          <div className="mt-4 grid grid-cols-3 gap-2 border-t border-border pt-4 text-center">
            <Stat label="Products" value={biz._count?.products} />
            <Stat label="Sales" value={biz._count?.sales} />
            <Stat label="Customers" value={biz._count?.customers} />
          </div>
        </div>

        {/* Owner + subscription */}
        <div className="rounded-xl border border-border bg-card p-5">
          <h2 className="text-sm font-semibold">Owner & Subscription</h2>
          <dl className="mt-3 space-y-2.5 text-sm">
            <Row label="Owner" value={owner?.user.name ?? "—"} />
            <Row label="Owner email" value={owner?.user.email ?? "—"} />
            <Row
              label="Plan"
              value={biz.subscription?.package?.name ?? "—"}
            />
            <Row
              label="Sub status"
              value={<StatusBadge status={biz.subscription?.status ?? "none"} />}
            />
            <Row
              label="Price"
              value={
                biz.subscription?.package
                  ? `${biz.subscription.package.currency} ${Number(biz.subscription.package.price).toLocaleString()}`
                  : "—"
              }
            />
            <Row
              label="Ends"
              value={fmtDate(biz.subscription?.endDate)}
            />
          </dl>
        </div>

        {/* Recent audit */}
        <div className="rounded-xl border border-border bg-card p-5">
          <h2 className="text-sm font-semibold">Recent activity</h2>
          <div className="mt-3 space-y-2.5">
            {biz.auditLogs.length === 0 && (
              <p className="text-xs text-muted-foreground">No activity yet.</p>
            )}
            {biz.auditLogs.slice(0, 8).map((a) => (
              <div key={a.id} className="flex justify-between gap-3 text-xs">
                <span className="truncate">{a.action}</span>
                <span className="shrink-0 text-muted-foreground">
                  {fmtDateTime(a.createdAt)}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Members */}
      <div className="rounded-xl border border-border bg-card">
        <div className="border-b border-border px-5 py-3">
          <h2 className="text-sm font-semibold">
            Members ({biz.memberships.length})
          </h2>
        </div>
        <div className="divide-y divide-border/60">
          {biz.memberships.map((m) => (
            <div key={m.id} className="flex items-center justify-between px-5 py-3 text-sm">
              <div>
                <p className="font-medium">{m.user.name}</p>
                <p className="text-xs text-muted-foreground">{m.user.email}</p>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-xs text-muted-foreground">{m.role.name}</span>
                <StatusBadge status={m.status} />
              </div>
            </div>
          ))}
        </div>
      </div>

      <ConfirmDialog
        open={confirm === "suspend"}
        onOpenChange={(v) => !v && setConfirm(null)}
        title={`Suspend ${biz.name}?`}
        description="Members will not be able to operate this business while suspended."
        confirmLabel="Suspend business"
        destructive
        requireReason
        loading={busy}
        onConfirm={(reason) => changeStatus("suspended", reason)}
      />
      <ConfirmDialog
        open={confirm === "activate"}
        onOpenChange={(v) => !v && setConfirm(null)}
        title={`Activate ${biz.name}?`}
        confirmLabel="Activate business"
        requireReason
        loading={busy}
        onConfirm={(reason) => changeStatus("active", reason)}
      />
    </div>
  );
}

function Row({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between gap-3">
      <dt className="text-muted-foreground">{label}</dt>
      <dd className="text-right font-medium">{value}</dd>
    </div>
  );
}

function Stat({ label, value }: { label: string; value?: number }) {
  return (
    <div>
      <p className="text-lg font-semibold tabular-nums">{value ?? 0}</p>
      <p className="text-[11px] text-muted-foreground">{label}</p>
    </div>
  );
}
