"use client";

 

import { useCallback, useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { toast } from "@workspace/ui/components/toast";
import { Button } from "@workspace/ui/components/button";
import { Textarea } from "@workspace/ui/components/textarea";
import { Skeleton } from "@workspace/ui/components/skeleton";
import { adminApi } from "@/lib/admin-api";
import { PageHeader, StatusBadge, ErrorState } from "@/components/admin/ui";
import { fmtDateTime } from "@/lib/format";
import { cn } from "@workspace/ui/lib/utils";

interface Ticket {
  id: string;
  subject: string;
  category: string;
  status: string;
  priority: string;
  createdAt: string;
  user: { id: string; name: string; email: string };
  business?: { id: string; name: string } | null;
  replies: { id: string; authorId: string; isAdmin: boolean; body: string; createdAt: string }[];
}

const STATUSES = ["open", "in_progress", "waiting", "resolved", "closed"];
const PRIORITIES = ["low", "normal", "high", "urgent"];

export default function TicketDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [ticket, setTicket] = useState<Ticket | null>(null);
  const [error, setError] = useState(false);
  const [reply, setReply] = useState("");
  const [sending, setSending] = useState(false);

  const load = useCallback(() => {
    adminApi<Ticket>(`support/${id}`)
      .then(setTicket)
      .catch(() => setError(true));
  }, [id]);
  useEffect(load, [load]);

  async function patch(data: Record<string, string>) {
    await adminApi(`support/${id}`, { method: "PATCH", body: data });
    toast.add({ title: "Ticket updated" });
    load();
  }

  async function sendReply(e: React.FormEvent) {
    e.preventDefault();
    if (!reply.trim()) return;
    setSending(true);
    try {
      await adminApi(`support/${id}/replies`, {
        method: "POST",
        body: { body: reply.trim() },
      });
      setReply("");
      toast.add({ title: "Reply sent" });
      load();
    } catch {
      toast.add({ title: "Failed to send" });
    } finally {
      setSending(false);
    }
  }

  if (error) return <ErrorState onRetry={load} />;
  if (!ticket) return <Skeleton className="h-96 w-full rounded-xl" />;

  return (
    <div className="max-w-3xl space-y-6">
      <PageHeader
        title={ticket.subject}
        description={`${ticket.user.name} · ${ticket.user.email}${ticket.business ? ` · ${ticket.business.name}` : ""}`}
        actions={
          <div className="flex items-center gap-2">
            <StatusBadge status={ticket.status} />
            <StatusBadge status={ticket.priority} />
          </div>
        }
      />
      <div className="flex flex-wrap items-center gap-3 text-sm">
        <label className="flex items-center gap-1.5 text-muted-foreground">
          Status
          <select
            value={ticket.status}
            onChange={(e) => patch({ status: e.target.value })}
            className="h-8 rounded-lg border border-input bg-transparent px-2 text-sm text-foreground"
          >
            {STATUSES.map((s) => (
              <option key={s} value={s}>{s.replace(/_/g, " ")}</option>
            ))}
          </select>
        </label>
        <label className="flex items-center gap-1.5 text-muted-foreground">
          Priority
          <select
            value={ticket.priority}
            onChange={(e) => patch({ priority: e.target.value })}
            className="h-8 rounded-lg border border-input bg-transparent px-2 text-sm text-foreground"
          >
            {PRIORITIES.map((p) => (
              <option key={p} value={p}>{p}</option>
            ))}
          </select>
        </label>
      </div>
      <div className="space-y-3">
        {ticket.replies.map((r) => (
          <div
            key={r.id}
            className={cn(
              "max-w-[85%] rounded-xl px-4 py-3 text-sm",
              r.isAdmin
                ? "ms-auto bg-primary text-primary-foreground"
                : "border border-border bg-card",
            )}
          >
            <p className="whitespace-pre-wrap">{r.body}</p>
            <p
              className={cn(
                "mt-1.5 text-[10px]",
                r.isAdmin ? "text-primary-foreground/70" : "text-muted-foreground",
              )}
            >
              {r.isAdmin ? "Support" : ticket.user.name} · {fmtDateTime(r.createdAt)}
            </p>
          </div>
        ))}
      </div>
      <form onSubmit={sendReply} className="space-y-3">
        <Textarea
          value={reply}
          onChange={(e) => setReply(e.target.value)}
          placeholder="Reply to user…"
          className="rounded-lg"
          rows={3}
          required
          minLength={1}
        />
        <Button type="submit" size="sm" disabled={sending || !reply.trim()}>
          {sending ? "Sending…" : "Send reply"}
        </Button>
      </form>
    </div>
  );
}
