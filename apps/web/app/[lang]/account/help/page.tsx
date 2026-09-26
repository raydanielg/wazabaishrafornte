"use client";

/* eslint-disable react-hooks/set-state-in-effect -- fetch/loading states */

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { toast } from "@workspace/ui/components/toast";
import { Button } from "@workspace/ui/components/button";
import { Input } from "@workspace/ui/components/input";
import { Label } from "@workspace/ui/components/label";
import { Textarea } from "@workspace/ui/components/textarea";
import { Skeleton } from "@workspace/ui/components/skeleton";
import { isLocale } from "@/lib/i18n";
import { EmptyState, ErrorState, StatusBadge } from "@/components/admin/ui";
import { timeAgo } from "@/lib/format";

interface Ticket {
  id: string;
  subject: string;
  category: string;
  status: string;
  updatedAt: string;
  _count: { replies: number };
}

const CATEGORIES = ["account", "billing", "technical", "feature", "other"];

export default function AccountHelpPage() {
  const lang = usePathname().split("/")[1] ?? "en";
  const locale = isLocale(lang) ? lang : "en";
  const isSw = locale === "sw";
  const [items, setItems] = useState<Ticket[] | null>(null);
  const [error, setError] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [formErr, setFormErr] = useState("");

  const load = useCallback(() => {
    setError(false);
    fetch("/api/app/v1/support", { cache: "no-store" })
      .then((r) => (r.ok ? r.json() : Promise.reject()))
      .then((j) => setItems(j.data?.items ?? []))
      .catch(() => setError(true));
  }, []);
  useEffect(load, [load]);

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const f = e.currentTarget;
    const val = (n: string) => (f.elements.namedItem(n) as HTMLInputElement).value;
    setSaving(true);
    setFormErr("");
    try {
      const res = await fetch("/api/app/v1/support", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          subject: val("subject"),
          category: val("category"),
          message: val("message"),
        }),
      });
      if (!res.ok) {
        const j = await res.json().catch(() => null);
        throw new Error(j?.error?.message ?? "Failed");
      }
      toast.add({ title: isSw ? "Tiketi imetumwa" : "Ticket sent" });
      setShowForm(false);
      f.reset();
      load();
    } catch (err) {
      setFormErr(err instanceof Error ? err.message : "Failed");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="max-w-lg space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold tracking-tight">
          {isSw ? "Msaada" : "Help & support"}
        </h1>
        <div className="flex gap-2">
          <Button size="xs" variant="outline" render={<Link href={`/${locale}/help`} />}>
            {isSw ? "Kituo cha msaada" : "Help center"}
          </Button>
          <Button size="xs" onClick={() => setShowForm(!showForm)}>
            {isSw ? "Tiketi mpya" : "New ticket"}
          </Button>
        </div>
      </div>

      {showForm && (
        <form onSubmit={submit} className="space-y-3 rounded-xl border border-border bg-card p-5">
          <div className="space-y-1.5">
            <Label htmlFor="t-subject">{isSw ? "Kichwa" : "Subject"}</Label>
            <Input id="t-subject" name="subject" required minLength={3} maxLength={200} density="compact" />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="t-cat">{isSw ? "Aina" : "Category"}</Label>
            <select
              id="t-cat"
              name="category"
              className="h-9 w-full rounded-lg border border-input bg-transparent px-3 text-sm capitalize"
            >
              {CATEGORIES.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="t-msg">{isSw ? "Ujumbe" : "Message"}</Label>
            <Textarea
              id="t-msg"
              name="message"
              required
              minLength={10}
              rows={4}
              className="rounded-lg"
              placeholder={isSw ? "Eleza tatizo lako…" : "Describe your issue…"}
            />
          </div>
          {formErr && <p className="text-sm text-destructive">{formErr}</p>}
          <Button type="submit" size="sm" disabled={saving}>
            {saving ? "…" : isSw ? "Tuma" : "Submit"}
          </Button>
        </form>
      )}

      {error ? (
        <ErrorState onRetry={load} />
      ) : !items ? (
        <div className="space-y-2">
          {[0, 1].map((i) => (
            <Skeleton key={i} className="h-16 w-full rounded-xl" />
          ))}
        </div>
      ) : items.length === 0 ? (
        <EmptyState
          title={isSw ? "Hakuna tiketi" : "No tickets"}
          hint={isSw ? "Fungua tiketi ukipata tatizo." : "Open a ticket if you need help."}
        />
      ) : (
        <div className="divide-y divide-border rounded-xl border border-border bg-card">
          {items.map((t) => (
            <Link
              key={t.id}
              href={`/${locale}/account/help/${t.id}`}
              className="flex items-center justify-between gap-3 px-5 py-4 transition-colors hover:bg-muted/40"
            >
              <div className="min-w-0">
                <p className="truncate text-sm font-medium">{t.subject}</p>
                <p className="text-xs text-muted-foreground">
                  {t.category} · {t._count.replies} {isSw ? "majibu" : "replies"} · {timeAgo(t.updatedAt)}
                </p>
              </div>
              <StatusBadge status={t.status} />
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
