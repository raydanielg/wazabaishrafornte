"use client";

import { Suspense, useState } from "react";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { HugeiconsIcon } from "@hugeicons/react";
import { Mail01Icon, LockIcon, TagIcon, CheckIcon } from "@hugeicons/core-free-icons";
import { Button } from "@workspace/ui/components/button";
import { Input } from "@workspace/ui/components/input";
import { Label } from "@workspace/ui/components/label";
import { getDictionary, isLocale, localizedPath } from "@/lib/i18n";
import { AuthShell } from "@/components/marketing/auth-shell";

function ResetForm() {
  const lang = usePathname().split("/")[1] ?? "en";
  const locale = isLocale(lang) ? lang : "en";
  const d = getDictionary(locale).authPages;
  const params = useSearchParams();
  const [identifier, setIdentifier] = useState(params.get("identifier") ?? "");
  const [done, setDone] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const f = e.currentTarget;
    const code = (f.elements.namedItem("code") as HTMLInputElement).value.trim();
    const password = (f.elements.namedItem("password") as HTMLInputElement).value;
    const confirm = (f.elements.namedItem("confirm") as HTMLInputElement).value;
    if (password !== confirm) {
      setError(d.passwordsMismatch);
      return;
    }
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/app/v1/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ identifier, code, password }),
      });
      const j = await res.json().catch(() => null);
      if (!res.ok) throw new Error(j?.error?.message ?? "Reset failed");
      setDone(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Reset failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <h1 className="text-lg font-semibold tracking-tight">{d.resetTitle}</h1>
      <p className="mt-1 text-sm text-muted-foreground">{d.resetDesc}</p>
      {done ? (
        <div className="mt-6 space-y-4">
          <div className="flex items-center gap-2.5 rounded-xl bg-emerald-50 px-4 py-3 text-sm text-emerald-800 dark:bg-emerald-950/30 dark:text-emerald-300">
            <HugeiconsIcon icon={CheckIcon} className="size-4 shrink-0" strokeWidth={2.5} />
            {d.resetSuccess}
          </div>
          <Button className="w-full" render={<Link href={localizedPath(locale, "/login")} />}>
            {d.backToLogin}
          </Button>
        </div>
      ) : (
        <form onSubmit={onSubmit} className="mt-6 space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="rp-id">{d.identifier}</Label>
            <Input
              id="rp-id"
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
              required
              placeholder={d.identifierPlaceholder}
              icon={<HugeiconsIcon icon={Mail01Icon} strokeWidth={2} />}
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="rp-code">{d.code}</Label>
            <Input
              id="rp-code"
              name="code"
              required
              minLength={6}
              maxLength={6}
              inputMode="numeric"
              placeholder={d.codePlaceholder}
              icon={<HugeiconsIcon icon={TagIcon} strokeWidth={2} />}
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="rp-pw">{d.newPassword}</Label>
            <Input
              id="rp-pw"
              name="password"
              type="password"
              required
              minLength={8}
              autoComplete="new-password"
              icon={<HugeiconsIcon icon={LockIcon} strokeWidth={2} />}
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="rp-pw2">{d.confirmPassword}</Label>
            <Input
              id="rp-pw2"
              name="confirm"
              type="password"
              required
              minLength={8}
              autoComplete="new-password"
              icon={<HugeiconsIcon icon={LockIcon} strokeWidth={2} />}
            />
          </div>
          {error && <p className="text-sm text-destructive" role="alert">{error}</p>}
          <Button type="submit" className="w-full" size="lg" disabled={loading}>
            {loading ? "…" : d.resetTitle}
          </Button>
        </form>
      )}
    </>
  );
}

export default function ResetPasswordPage() {
  return (
    <AuthShell>
      <Suspense>
        <ResetForm />
      </Suspense>
    </AuthShell>
  );
}
