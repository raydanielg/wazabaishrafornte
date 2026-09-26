"use client";

import { useState } from "react";
import { Button } from "@workspace/ui/components/button";
import { toast } from "@workspace/ui/components/toast";
import { adminApi } from "@/lib/admin-api";
import { useAdmin } from "@/components/admin/admin-gate";
import {
  PageHeader,
  DataTable,
  ConfirmDialog,
  type Column,
} from "@/components/admin/ui";
import { useAdminList } from "@/lib/use-admin-list";
import { fmtDateTime } from "@/lib/format";

interface SessionRow {
  id: string;
  createdAt: string;
  expiresAt: string;
  adminUser: { id: string; name: string; email: string };
}

export default function SecurityPage() {
  const { me } = useAdmin();
  const { data, loading, error, refresh } = useAdminList<SessionRow>("sessions");
  const [revoke, setRevoke] = useState<SessionRow | null>(null);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");

  async function doRevoke() {
    if (!revoke) return;
    setBusy(true);
    try {
      await adminApi(`sessions/${revoke.id}`, { method: "DELETE" });
      toast.add({ title: "Session revoked" });
      setRevoke(null);
      refresh();
    } catch (e) {
      setErr(e instanceof Error ? e.message : "Revoke failed");
    } finally {
      setBusy(false);
    }
  }

  const columns: Column<SessionRow>[] = [
    {
      header: "Admin",
      cell: (s) => (
        <div>
          <p className="font-medium">
            {s.adminUser.name}
            {s.adminUser.id === me.id && (
              <span className="ml-2 text-xs text-muted-foreground">(you)</span>
            )}
          </p>
          <p className="text-xs text-muted-foreground">{s.adminUser.email}</p>
        </div>
      ),
    },
    {
      header: "Created",
      cell: (s) => <span className="text-muted-foreground">{fmtDateTime(s.createdAt)}</span>,
    },
    {
      header: "Expires",
      cell: (s) => <span className="text-muted-foreground">{fmtDateTime(s.expiresAt)}</span>,
    },
    {
      header: "Actions",
      cell: (s) =>
        s.adminUser.id === me.id ? null : (
          <Button variant="outline" size="xs" onClick={() => setRevoke(s)}>
            Revoke
          </Button>
        ),
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Admin Sessions"
        description="Active administrator sessions. Revoke any session that should not remain signed in."
      />
      {err && <p className="text-sm text-destructive">{err}</p>}
      <DataTable
        data={data}
        columns={columns}
        loading={loading}
        error={error}
        onRetry={refresh}
        emptyTitle="No active sessions"
      />
      <ConfirmDialog
        open={!!revoke}
        onOpenChange={(v) => !v && setRevoke(null)}
        title={`Revoke session for ${revoke?.adminUser.name}?`}
        description="They will be signed out immediately on their next request."
        confirmLabel="Revoke session"
        destructive
        loading={busy}
        onConfirm={doRevoke}
      />
    </div>
  );
}
