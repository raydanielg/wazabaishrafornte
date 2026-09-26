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


interface UserDetail {
  id: string;
  name: string;
  firstName: string | null;
  lastName: string | null;
  email: string | null;
  phoneNumber: string | null;
  status: string;
  emailVerified: boolean;
  phoneNumberVerified: boolean;
  createdAt: string;
  memberships: {
    id: string;
    status: string;
    createdAt: string;
    business: { id: string; name: string; slug: string; status: string };
    role: { key: string; name: string };
  }[];
  sessions: { createdAt: string; expiresAt: string; ipAddress: string | null; userAgent: string | null }[];
}

export default function UserDetailPage({
  params,
}: {
  params: Promise<{ id: string; lang: string }>;
}) {
  const [id, setId] = useState("");
  useEffect(() => {
    params.then((p) => setId(p.id));
  }, [params]);

  const { can } = useAdmin();
  const [user, setUser] = useState<UserDetail | null>(null);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(true);
  const [confirm, setConfirm] = useState<"suspend" | "activate" | null>(null);
  const [busy, setBusy] = useState(false);
  const [actionError, setActionError] = useState("");

  const load = useCallback(() => {
    if (!id) return;
    setLoading(true);
    setError(false);
    adminApi<UserDetail>(`users/${id}`)
      .then(setUser)
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  }, [id]);

  useEffect(load, [load]);

  async function changeStatus(status: string, reason?: string) {
    setBusy(true);
    setActionError("");
    try {
      await adminApi(`users/${id}/status`, { method: "POST", body: { status, reason } });
      toast.add({ title: status === "active" ? "User activated" : "User suspended" });
      setConfirm(null);
      load();
    } catch (e) {
      setActionError(e instanceof Error ? e.message : "Action failed");
    } finally {
      setBusy(false);
    }
  }

  if (error) return <ErrorState onRetry={load} />;
  if (loading || !user) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-10 w-64" />
        <Skeleton className="h-40 w-full" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title={user.name}
        description={user.email ?? user.phoneNumber ?? user.id}
        actions={
          can("admin.users.manage") ? (
            user.status === "active" ? (
              <Button variant="outline" size="sm" onClick={() => setConfirm("suspend")}>
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

      <div className="grid gap-4 lg:grid-cols-2">
        <div className="rounded-xl border border-border bg-card p-5">
          <h2 className="text-sm font-semibold">Profile</h2>
          <dl className="mt-3 space-y-2.5 text-sm">
            <Row label="Status" value={<StatusBadge status={user.status} />} />
            <Row label="Email" value={user.email ?? "—"} />
            <Row label="Phone" value={user.phoneNumber ?? "—"} />
            <Row label="Email verified" value={user.emailVerified ? "Yes" : "No"} />
            <Row label="Phone verified" value={user.phoneNumberVerified ? "Yes" : "No"} />
            <Row label="Joined" value={fmtDate(user.createdAt)} />
          </dl>
        </div>

        <div className="rounded-xl border border-border bg-card p-5">
          <h2 className="text-sm font-semibold">Recent sessions</h2>
          <div className="mt-3 space-y-2.5">
            {user.sessions.length === 0 && (
              <p className="text-xs text-muted-foreground">No sessions.</p>
            )}
            {user.sessions.map((s, i) => (
              <div key={i} className="flex justify-between gap-3 text-xs">
                <span className="truncate text-muted-foreground">
                  {s.userAgent?.slice(0, 60) ?? "Unknown device"}
                </span>
                <span className="shrink-0 text-muted-foreground">
                  {fmtDateTime(s.createdAt)}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="rounded-xl border border-border bg-card">
        <div className="border-b border-border px-5 py-3">
          <h2 className="text-sm font-semibold">
            Businesses ({user.memberships.length})
          </h2>
        </div>
        <div className="divide-y divide-border/60">
          {user.memberships.length === 0 && (
            <p className="px-5 py-6 text-xs text-muted-foreground">
              This user has no business memberships.
            </p>
          )}
          {user.memberships.map((m) => (
            <div key={m.id} className="flex items-center justify-between px-5 py-3 text-sm">
              <div>
                <p className="font-medium">{m.business.name}</p>
                <p className="text-xs text-muted-foreground">
                  {m.role.name} · joined {fmtDate(m.createdAt)}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <StatusBadge status={m.business.status} />
                <StatusBadge status={m.status} />
              </div>
            </div>
          ))}
        </div>
      </div>

      <ConfirmDialog
        open={confirm === "suspend"}
        onOpenChange={(v) => !v && setConfirm(null)}
        title={`Suspend ${user.name}?`}
        description="Their sessions will be revoked and they cannot sign in."
        confirmLabel="Suspend user"
        destructive
        requireReason
        loading={busy}
        onConfirm={(r) => changeStatus("suspended", r)}
      />
      <ConfirmDialog
        open={confirm === "activate"}
        onOpenChange={(v) => !v && setConfirm(null)}
        title={`Activate ${user.name}?`}
        confirmLabel="Activate user"
        requireReason
        loading={busy}
        onConfirm={(r) => changeStatus("active", r)}
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
