"use client";

 

import { useEffect, useState } from "react";
import { Button } from "@workspace/ui/components/button";
import { toast } from "@workspace/ui/components/toast";
import { Input } from "@workspace/ui/components/input";
import { Label } from "@workspace/ui/components/label";
import { Switch } from "@workspace/ui/components/switch";
import { adminApi } from "@/lib/admin-api";
import { PageHeader, ErrorState } from "@/components/admin/ui";
import { Skeleton } from "@workspace/ui/components/skeleton";

interface Setting {
  key: string;
  value: unknown;
  isSecret: boolean;
  updatedAt: string;
}

const KNOWN: { key: string; label: string; hint: string; type: "text" | "bool" }[] = [
  { key: "site.name", label: "Platform name", hint: "Shown in emails and receipts.", type: "text" },
  { key: "site.support_email", label: "Support email", hint: "Where users reach you.", type: "text" },
  { key: "defaults.currency", label: "Default currency", hint: "e.g. TZS", type: "text" },
  { key: "defaults.timezone", label: "Default timezone", hint: "e.g. Africa/Dar_es_Salaam", type: "text" },
  { key: "registration.open", label: "Open registration", hint: "Allow new sign-ups.", type: "bool" },
  { key: "maintenance.mode", label: "Maintenance mode", hint: "Temporarily block API access.", type: "bool" },
];

export default function SettingsPage() {
  const [settings, setSettings] = useState<Setting[] | null>(null);
  const [error, setError] = useState(false);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState("");
  const [tick, setTick] = useState(0);
  const [form, setForm] = useState<Record<string, unknown>>({});

  useEffect(() => {
    let live = true;
    adminApi<Setting[]>("settings")
      .then((s) => {
        if (!live) return;
        setSettings(s);
        const f: Record<string, unknown> = {};
        for (const it of s) if (!it.isSecret) f[it.key] = it.value;
        setForm(f);
      })
      .catch(() => live && setError(true));
    return () => {
      live = false;
    };
  }, [tick]);

  async function save() {
    setSaving(true);
    setMsg("");
    try {
      await adminApi("settings", {
        method: "PUT",
        body: {
          settings: KNOWN.filter((k) => form[k.key] !== undefined).map((k) => ({
            key: k.key,
            value: form[k.key],
          })),
        },
      });
      setMsg("Settings saved.");
      toast.add({ title: "Settings saved" });
      setTick((t) => t + 1);
    } catch (e) {
      setMsg(e instanceof Error ? e.message : "Save failed");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Settings"
        description="Platform-wide configuration. Changes apply immediately."
      />
      {error ? (
        <ErrorState onRetry={() => setTick((t) => t + 1)} />
      ) : !settings ? (
        <Skeleton className="h-72 w-full rounded-xl" />
      ) : (
        <div className="max-w-xl space-y-5 rounded-xl border border-border bg-card p-6">
          {KNOWN.map((k) => (
            <div key={k.key} className="space-y-1.5">
              {k.type === "bool" ? (
                <label className="flex items-center justify-between gap-3">
                  <div>
                    <p className="text-sm font-medium">{k.label}</p>
                    <p className="text-xs text-muted-foreground">{k.hint}</p>
                  </div>
                  <Switch
                    checked={form[k.key] === true}
                    onCheckedChange={(v) => setForm((f) => ({ ...f, [k.key]: v }))}
                  />
                </label>
              ) : (
                <>
                  <Label htmlFor={`s-${k.key}`}>{k.label}</Label>
                  <Input
                    density="compact"
                    id={`s-${k.key}`}
                    value={String(form[k.key] ?? "")}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, [k.key]: e.target.value }))
                    }
                  />
                  <p className="text-xs text-muted-foreground">{k.hint}</p>
                </>
              )}
            </div>
          ))}
          <div className="flex items-center gap-3 border-t border-border pt-4">
            <Button onClick={save} disabled={saving}>
              {saving ? "Saving…" : "Save settings"}
            </Button>
            {msg && <p className="text-sm text-muted-foreground">{msg}</p>}
          </div>
        </div>
      )}
    </div>
  );
}
