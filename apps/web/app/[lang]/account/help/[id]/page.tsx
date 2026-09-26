"use client";

 

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { useParams, usePathname } from "next/navigation";
import { HugeiconsIcon } from "@hugeicons/react";
import { ArrowLeft01Icon } from "@hugeicons/core-free-icons";
import { toast } from "@workspace/ui/components/toast";
import { Button } from "@workspace/ui/components/button";
import { Textarea } from "@workspace/ui/components/textarea";
import { Skeleton } from "@workspace/ui/components/skeleton";
import { isLocale } from "@/lib/i18n";
import { ErrorState, StatusBadge } from "@/components/admin/ui";
import { fmtDateTime } from "@/lib/format";
import { cn } from "@workspace/ui/lib/utils";

interface Ticket {
  id: string;
  subject: string;
  status: string;
  replies: { id: string; isAdmin: boolean; body: string; createdAt: string }[];
}

export default function UserTicketPage() {
  const { id } = useParams<{ id: string }>();
  const lang = usePathname().split("/")[1] ?? "en";
  const locale = isLocale(lang) ? lang : "en";
  const isSw = locale === "sw";
  const [ticket, setTicket] = useState<Ticket | null>(null);
  const [error, setError] = useState(false);
  const [reply, setReply] = useState("");
  const [sending, setSending] = useState(false);

  const load = useCallback(() => {
    fetch(`/api/app/v1/support/${id}`, { cache: "no-store" })
      .then((r) => (r.ok ? r.json() : Promise.reject()))
      .then((j) => setTicket(j.data))
      .catch(() => setError(true));
  }, [id]);
  useEffect(load, [load]);

  async function send(e: React.FormEvent) {
    e.preventDefault();
    if (!reply.trim()) return;
    setSending(true);
    try {
      const res = await fetch(`/api/app/v1/support/${id}/replies`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ body: reply.trim() }),
      });
      if (!res.ok) throw new Error();
      setReply("");
      load();
    } catch {
      toast.add({ title: isSw ? "Imeshindikana" : "Failed" });
    } finally {
      setSending(false);
    }
  }

  if (error) return <ErrorState onRetry={load} />;
  if (!ticket) return <Skeleton className="h-96 w-full rounded-xl" />;

  return (
    <div className="max-w-lg space-y-6">
      <Link
        href={`/${locale}/account/help`}
        className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground"
      >
        <HugeiconsIcon icon={ArrowLeft01Icon} className="size-3.5" strokeWidth={2} />
        {isSw ? "Tiketi" : "Tickets"}
      </Link>
      <div className="flex items-start justify-between gap-3">
        <h1 className="text-lg font-semibold tracking-tight">{ticket.subject}</h1>
        <StatusBadge status={ticket.status} />
      </div>
      <div className="space-y-3">
        {ticket.replies.map((r) => (
          <div
            key={r.id}
            className={cn(
              "max-w-[85%] rounded-xl px-4 py-3 text-sm",
              r.isAdmin
                ? "border border-border bg-card"
                : "ms-auto bg-primary text-primary-foreground",
            )}
          >
            <p className="whitespace-pre-wrap">{r.body}</p>
            <p className={cn("mt-1.5 text-[10px]", r.isAdmin ? "text-muted-foreground" : "text-primary-foreground/70")}>
              {r.isAdmin ? (isSw ? "Msaada" : "Support") : (isSw ? "Wewe" : "You")} · {fmtDateTime(r.createdAt)}
            </p>
          </div>
        ))}
      </div>
      {ticket.status !== "closed" && (
        <form onSubmit={send} className="space-y-3">
          <Textarea
            value={reply}
            onChange={(e) => setReply(e.target.value)}
            placeholder={isSw ? "Andika jibu…" : "Write a reply…"}
            rows={3}
            className="rounded-lg"
            required
          />
          <Button type="submit" size="sm" disabled={sending || !reply.trim()}>
            {sending ? "…" : isSw ? "Tuma" : "Send"}
          </Button>
        </form>
      )}
    </div>
  );
}
