"use client";

 

import { useState } from "react";
import { toast } from "@workspace/ui/components/toast";
import { Button } from "@workspace/ui/components/button";
import { Input } from "@workspace/ui/components/input";
import { Label } from "@workspace/ui/components/label";
import { usePathname } from "next/navigation";
import { HugeiconsIcon } from "@hugeicons/react";
import { LockIcon } from "@hugeicons/core-free-icons";
import { isLocale } from "@/lib/i18n";

export default function SecurityPage() {
  const lang = usePathname().split("/")[1] ?? "en";
  const isSw = (isLocale(lang) ? lang : "en") === "sw";
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  async function changePassword(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const f = e.currentTarget;
    const currentPassword = (f.elements.namedItem("current") as HTMLInputElement).value;
    const newPassword = (f.elements.namedItem("next") as HTMLInputElement).value;
    const confirm = (f.elements.namedItem("confirm") as HTMLInputElement).value;
    if (newPassword !== confirm) {
      setError(isSw ? "Nywila hazifanani" : "Passwords do not match");
      return;
    }
    setSaving(true);
    setError("");
    try {
      const res = await fetch("/api/app/auth/change-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          currentPassword,
          newPassword,
          revokeOtherSessions: true,
        }),
      });
      if (!res.ok) {
        const j = await res.json().catch(() => null);
        throw new Error(j?.message ?? (isSw ? "Imeshindikana" : "Failed"));
      }
      toast.add({ title: isSw ? "Nywila imebadilishwa" : "Password changed" });
      f.reset();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="max-w-lg space-y-6">
      <h1 className="text-xl font-semibold tracking-tight">
        {isSw ? "Usalama" : "Security"}
      </h1>
      <form onSubmit={changePassword} className="space-y-4 rounded-xl border border-border bg-card p-5">
        <div className="space-y-1.5">
          <Label htmlFor="s-cur">{isSw ? "Nywila ya sasa" : "Current password"}</Label>
          <Input
            id="s-cur"
            name="current"
            type="password"
            required
            autoComplete="current-password"
            icon={<HugeiconsIcon icon={LockIcon} strokeWidth={2} />}
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="s-new">{isSw ? "Nywila mpya" : "New password"}</Label>
          <Input
            id="s-new"
            name="next"
            type="password"
            required
            minLength={8}
            autoComplete="new-password"
            icon={<HugeiconsIcon icon={LockIcon} strokeWidth={2} />}
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="s-cfm">{isSw ? "Thibitisha nywila" : "Confirm new password"}</Label>
          <Input
            id="s-cfm"
            name="confirm"
            type="password"
            required
            minLength={8}
            autoComplete="new-password"
            icon={<HugeiconsIcon icon={LockIcon} strokeWidth={2} />}
          />
        </div>
        <p className="text-xs text-muted-foreground">
          {isSw
            ? "Vipindi vingine vitaondolewa baada ya kubadilisha nywila."
            : "Other sessions will be signed out after changing your password."}
        </p>
        {error && <p className="text-sm text-destructive" role="alert">{error}</p>}
        <Button type="submit" disabled={saving}>
          {saving ? "…" : isSw ? "Badilisha nywila" : "Change password"}
        </Button>
      </form>
    </div>
  );
}
