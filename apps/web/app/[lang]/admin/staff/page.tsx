"use client";

import { useState } from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import { AddCircleIcon, UserIcon, Mail01Icon, LockIcon } from "@hugeicons/core-free-icons";
import { Button } from "@workspace/ui/components/button";
import { toast } from "@workspace/ui/components/toast";
import { Input } from "@workspace/ui/components/input";
import { Label } from "@workspace/ui/components/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@workspace/ui/components/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@workspace/ui/components/select";
import { adminApi } from "@/lib/admin-api";
import {
  PageHeader,
  DataTable,
  StatusBadge,
  ConfirmDialog,
  type Column,
} from "@/components/admin/ui";
import { useAdminList } from "@/lib/use-admin-list";
import { fmtDateTime } from "@/lib/format";

interface StaffRow {
  id: string;
  name: string;
  email: string;
  status: string;
  lastLoginAt: string | null;
  createdAt: string;
  role: { key: string; name: string };
  _count?: { sessions: number };
}

const ROLES = [
  { key: "super_admin", label: "Super Admin" },
  { key: "support_admin", label: "Support Admin" },
  { key: "finance_admin", label: "Finance Admin" },
  { key: "ops_admin", label: "Operations Admin" },
];

export default function StaffPage() {
  const { data, loading, error, refresh } = useAdminList<StaffRow>("staff");
  const [inviteOpen, setInviteOpen] = useState(false);
  const [suspend, setSuspend] = useState<StaffRow | null>(null);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");

  async function toggleStatus(row: StaffRow) {
    setBusy(true);
    setErr("");
    try {
      await adminApi(`staff/${row.id}`, {
        method: "PATCH",
        body: { status: row.status === "active" ? "suspended" : "active" },
      });
      toast.add({ title: row.status === "active" ? "Admin suspended" : "Admin activated" });
      setSuspend(null);
      refresh();
    } catch (e) {
      setErr(e instanceof Error ? e.message : "Action failed");
    } finally {
      setBusy(false);
    }
  }

  const columns: Column<StaffRow>[] = [
    {
      header: "Admin",
      cell: (s) => (
        <div>
          <p className="font-medium">{s.name}</p>
          <p className="text-xs text-muted-foreground">{s.email}</p>
        </div>
      ),
    },
    { header: "Role", cell: (s) => s.role.name },
    { header: "Status", cell: (s) => <StatusBadge status={s.status} /> },
    {
      header: "Last login",
      cell: (s) => (
        <span className="text-muted-foreground">{fmtDateTime(s.lastLoginAt)}</span>
      ),
    },
    {
      header: "Actions",
      cell: (s) => (
        <Button
          variant="outline"
          size="xs"
          onClick={(e) => {
            e.stopPropagation();
            setSuspend(s);
          }}
        >
          {s.status === "active" ? "Suspend" : "Activate"}
        </Button>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Admin Team"
        description="Internal Wazabiashara administrators and their roles."
        actions={
          <Button size="sm" onClick={() => setInviteOpen(true)}>
            <HugeiconsIcon icon={AddCircleIcon} strokeWidth={2} />
            Invite admin
          </Button>
        }
      />
      {err && <p className="text-sm text-destructive">{err}</p>}
      <DataTable
        data={data}
        columns={columns}
        loading={loading}
        error={error}
        onRetry={refresh}
        emptyTitle="No admin staff yet"
      />

      <InviteDialog
        open={inviteOpen}
        onOpenChange={setInviteOpen}
        onDone={() => {
          setInviteOpen(false);
          refresh();
        }}
      />
      <ConfirmDialog
        open={!!suspend}
        onOpenChange={(v) => !v && setSuspend(null)}
        title={`${suspend?.status === "active" ? "Suspend" : "Activate"} ${suspend?.name}?`}
        description={
          suspend?.status === "active"
            ? "Their admin sessions will be revoked immediately."
            : "They will be able to sign in again."
        }
        confirmLabel={suspend?.status === "active" ? "Suspend" : "Activate"}
        destructive={suspend?.status === "active"}
        loading={busy}
        onConfirm={() => suspend && toggleStatus(suspend)}
      />
    </div>
  );
}

function InviteDialog({
  open,
  onOpenChange,
  onDone,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  onDone: () => void;
}) {
  const [role, setRole] = useState("support_admin");
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const f = e.currentTarget;
    setBusy(true);
    setErr("");
    try {
      await adminApi("staff", {
        method: "POST",
        body: {
          name: (f.elements.namedItem("name") as HTMLInputElement).value,
          email: (f.elements.namedItem("email") as HTMLInputElement).value,
          password: (f.elements.namedItem("password") as HTMLInputElement).value,
          roleKey: role,
        },
      });
      toast.add({ title: "Admin invited" });
      onDone();
    } catch (e2) {
      setErr(e2 instanceof Error ? e2.message : "Failed to invite");
    } finally {
      setBusy(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Invite admin</DialogTitle>
          <DialogDescription>
            Create an internal administrator account.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={submit} className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="s-name">Name</Label>
            <Input density="compact" id="s-name" name="name" required placeholder="e.g. Neema Joseph" icon={<HugeiconsIcon icon={UserIcon} strokeWidth={2} />} />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="s-email">Email</Label>
            <Input density="compact" id="s-email" name="email" type="email" required placeholder="admin@wazabiashara.com" icon={<HugeiconsIcon icon={Mail01Icon} strokeWidth={2} />} />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="s-password">Temporary password</Label>
            <Input density="compact" id="s-password" name="password" type="password" required minLength={8} placeholder="At least 8 characters" icon={<HugeiconsIcon icon={LockIcon} strokeWidth={2} />} />
          </div>
          <div className="space-y-1.5">
            <Label>Role</Label>
            <Select value={role} onValueChange={(v) => v && setRole(v)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {ROLES.map((r) => (
                  <SelectItem key={r.key} value={r.key}>
                    {r.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          {err && <p className="text-sm text-destructive">{err}</p>}
          <DialogFooter>
            <Button type="submit" disabled={busy}>
              {busy ? "Inviting…" : "Invite"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
