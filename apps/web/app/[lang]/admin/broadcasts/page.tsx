"use client";

import { useState } from "react";
import { toast } from "@workspace/ui/components/toast";
import { Button } from "@workspace/ui/components/button";
import { Input } from "@workspace/ui/components/input";
import { Label } from "@workspace/ui/components/label";
import { Textarea } from "@workspace/ui/components/textarea";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@workspace/ui/components/dialog";
import {
  PageHeader,
  DataTable,
  StatusBadge,
  ConfirmDialog,
  type Column,
} from "@/components/admin/ui";
import { useAdminList } from "@/lib/use-admin-list";
import { adminApi } from "@/lib/admin-api";
import { fmtDateTime } from "@/lib/format";

interface Broadcast {
  id: string;
  title: string;
  body: string;
  audience: string;
  status: string;
  recipientCount: number;
  sentAt: string | null;
  createdAt: string;
  createdBy: { name: string };
}

export default function BroadcastsPage() {
  const [createOpen, setCreateOpen] = useState(false);
  const [send, setSend] = useState<Broadcast | null>(null);
  const { data, loading, error, refresh } = useAdminList<Broadcast>("broadcasts");

  async function sendNow() {
    if (!send) return;
    try {
      const r = await adminApi<{ recipientCount: number }>(
        `broadcasts/${send.id}/send`,
        { method: "POST" },
      );
      toast.add({ title: `Sent to ${r.recipientCount} users` });
      setSend(null);
      refresh();
    } catch {
      toast.add({ title: "Send failed" });
    }
  }

  const columns: Column<Broadcast>[] = [
    {
      header: "Broadcast",
      cell: (b) => (
        <div>
          <p className="font-medium">{b.title}</p>
          <p className="line-clamp-1 text-xs text-muted-foreground">{b.body}</p>
        </div>
      ),
    },
    { header: "Audience", cell: (b) => <span className="capitalize">{b.audience}</span> },
    { header: "Status", cell: (b) => <StatusBadge status={b.status} /> },
    { header: "Recipients", cell: (b) => b.recipientCount || "—" },
    { header: "By", cell: (b) => <span className="text-muted-foreground">{b.createdBy.name}</span> },
    {
      header: "",
      cell: (b) =>
        b.status === "draft" ? (
          <Button size="xs" variant="outline" onClick={() => setSend(b)}>
            Send
          </Button>
        ) : (
          <span className="text-xs text-muted-foreground">
            {b.sentAt ? fmtDateTime(b.sentAt) : ""}
          </span>
        ),
      className: "text-right",
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Broadcasts"
        description="Send announcements to users — delivered as notifications."
        actions={
          <Button size="sm" onClick={() => setCreateOpen(true)}>
            New broadcast
          </Button>
        }
      />
      <DataTable
        data={data}
        columns={columns}
        loading={loading}
        error={error}
        onRetry={refresh}
        emptyTitle="No broadcasts yet"
      />
      <ConfirmDialog
        open={!!send}
        onOpenChange={() => setSend(null)}
        title="Send broadcast?"
        description={`"${send?.title}" will be sent to every ${send?.audience} user as a notification.`}
        confirmLabel="Send now"
        onConfirm={sendNow}
      />
      {createOpen && <CreateBroadcast open={createOpen} onClose={() => { setCreateOpen(false); refresh(); }} />}
    </div>
  );
}

function CreateBroadcast({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const f = e.currentTarget;
    setSaving(true);
    setError("");
    try {
      await adminApi("broadcasts", {
        method: "POST",
        body: {
          title: (f.elements.namedItem("title") as HTMLInputElement).value,
          body: (f.elements.namedItem("body") as HTMLTextAreaElement).value,
          audience: (f.elements.namedItem("audience") as HTMLSelectElement).value,
        },
      });
      toast.add({ title: "Broadcast created" });
      onClose();
    } catch {
      setError("Could not create broadcast");
    } finally {
      setSaving(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>New broadcast</DialogTitle>
        </DialogHeader>
        <form onSubmit={submit} className="space-y-4">
        <div className="space-y-1.5">
          <Label htmlFor="b-title">Title</Label>
          <Input id="b-title" name="title" required maxLength={200} density="compact" />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="b-body">Message</Label>
          <Textarea id="b-body" name="body" required maxLength={4000} rows={4} className="rounded-lg" />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="b-audience">Audience</Label>
          <select
            id="b-audience"
            name="audience"
            className="h-9 w-full rounded-lg border border-input bg-transparent px-3 text-sm"
          >
            <option value="all">All users</option>
            <option value="active">Active users</option>
            <option value="owners">Business owners</option>
          </select>
        </div>
          {error && <p className="text-sm text-destructive">{error}</p>}
          <DialogFooter>
            <Button type="button" variant="outline" size="sm" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" size="sm" disabled={saving}>
              {saving ? "…" : "Create draft"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
