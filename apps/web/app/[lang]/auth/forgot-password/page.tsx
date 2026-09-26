"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { HugeiconsIcon } from "@hugeicons/react";
import { Mail01Icon, CheckIcon } from "@hugeicons/core-free-icons";
import { Button } from "@workspace/ui/components/button";
import { Input } from "@workspace/ui/components/input";
import { Label } from "@workspace/ui/components/label";
import { getDictionary, isLocale, localizedPath } from "@/lib/i18n";
import { AuthShell } from "@/components/marketing/auth-shell";

export default function ForgotPasswordPage() {
  const lang = usePathname().split("/")[1] ?? "en";
  const locale = isLocale(lang) ? lang : "en";
  const d = getDictionary(locale).authPages;
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [identifier, setIdentifier] = useState("");

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/app/v1/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ identifier }),
      });
      if (!res.ok) {
        const j = await res.json().catch(() => null);
        throw new Error(j?.error?.message ?? "Request failed");
      }
      setSent(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Request failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <AuthShell>
      <h1 className="text-lg font-semibold tracking-tight">{d.forgotTitle}</h1>
      <p className="mt-1 text-sm text-muted-foreground">{d.forgotDesc}</p>
      {sent ? (
        <div className="mt-6 space-y-4">
          <div className="flex items-center gap-2.5 rounded-xl bg-emerald-50 px-4 py-3 text-sm text-emerald-800 dark:bg-emerald-950/30 dark:text-emerald-300">
            <HugeiconsIcon icon={CheckIcon} className="size-4 shrink-0" strokeWidth={2.5} />
            {d.codeSent}
          </div>
          <Button className="w-full" render={
            <Link href={`/${locale}/auth/reset-password?identifier=${encodeURIComponent(identifier)}`} />
          }>
            {d.resetTitle}
          </Button>
        </div>
      ) : (
        <form onSubmit={onSubmit} className="mt-6 space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="fp-id">{d.identifier}</Label>
            <Input
              id="fp-id"
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
              required
              placeholder={d.identifierPlaceholder}
              icon={<HugeiconsIcon icon={Mail01Icon} strokeWidth={2} />}
            />
          </div>
          {error && <p className="text-sm text-destructive" role="alert">{error}</p>}
          <Button type="submit" className="w-full" size="lg" disabled={loading}>
            {loading ? "…" : d.sendCode}
          </Button>
        </form>
      )}
      <Link
        href={localizedPath(locale, "/login")}
        className="mt-5 block text-center text-sm text-muted-foreground underline-offset-4 hover:underline"
      >
        {d.backToLogin}
      </Link>
    </AuthShell>
  );
}
