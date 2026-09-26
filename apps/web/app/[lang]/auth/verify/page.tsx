"use client";

import { Suspense, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { HugeiconsIcon } from "@hugeicons/react";
import { SmartPhoneIcon, CheckIcon } from "@hugeicons/core-free-icons";
import { Button } from "@workspace/ui/components/button";
import { Input } from "@workspace/ui/components/input";
import { Label } from "@workspace/ui/components/label";
import { getDictionary, isLocale } from "@/lib/i18n";
import { AuthShell } from "@/components/marketing/auth-shell";

/** Phone OTP verification — Better Auth phone-number/verify via BFF. */
function VerifyForm() {
  const lang = usePathname().split("/")[1] ?? "en";
  const locale = isLocale(lang) ? lang : "en";
  const d = getDictionary(locale).authPages;
  const params = useSearchParams();
  const router = useRouter();
  const [phone, setPhone] = useState(params.get("phone") ?? "");
  const [sent, setSent] = useState(!!params.get("phone"));
  const [done, setDone] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function post(path: string, body: Record<string, string>) {
    const res = await fetch(`/api/app/auth/${path}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    if (!res.ok) {
      const j = await res.json().catch(() => null);
      throw new Error(j?.message ?? "Failed");
    }
  }

  async function sendOtp(e?: React.FormEvent) {
    e?.preventDefault();
    setLoading(true);
    setError("");
    try {
      await post("phone-number/send-otp", { phoneNumber: phone });
      setSent(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed");
    } finally {
      setLoading(false);
    }
  }

  async function verify(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const code = (e.currentTarget.elements.namedItem("code") as HTMLInputElement).value.trim();
    setLoading(true);
    setError("");
    try {
      await post("phone-number/verify", { phoneNumber: phone, code });
      setDone(true);
      setTimeout(() => router.replace(`/${locale}/account/profile`), 1200);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <h1 className="text-lg font-semibold tracking-tight">{d.verifyTitle}</h1>
      <p className="mt-1 text-sm text-muted-foreground">{d.verifyDesc}</p>
      {done ? (
        <div className="mt-6 flex items-center gap-2.5 rounded-xl bg-emerald-50 px-4 py-3 text-sm text-emerald-800 dark:bg-emerald-950/30 dark:text-emerald-300">
          <HugeiconsIcon icon={CheckIcon} className="size-4 shrink-0" strokeWidth={2.5} />
          {d.verified}
        </div>
      ) : (
        <form onSubmit={sent ? verify : sendOtp} className="mt-6 space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="v-phone">{locale === "sw" ? "Namba ya simu" : "Phone number"}</Label>
            <Input
              id="v-phone"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              required
              type="tel"
              inputMode="tel"
              placeholder="+255 700 000 000"
              icon={<HugeiconsIcon icon={SmartPhoneIcon} strokeWidth={2} />}
              disabled={sent}
            />
          </div>
          {sent && (
            <div className="space-y-1.5">
              <Label htmlFor="v-code">{d.code}</Label>
              <Input
                id="v-code"
                name="code"
                required
                minLength={6}
                maxLength={6}
                inputMode="numeric"
                autoComplete="one-time-code"
                placeholder={d.codePlaceholder}
                autoFocus
              />
            </div>
          )}
          {error && <p className="text-sm text-destructive" role="alert">{error}</p>}
          <Button type="submit" className="w-full" size="lg" disabled={loading}>
            {loading ? "…" : sent ? d.verify : d.sendCode}
          </Button>
          {sent && (
            <button
              type="button"
              onClick={() => sendOtp()}
              className="w-full text-center text-sm text-muted-foreground underline-offset-4 hover:underline"
            >
              {d.resend}
            </button>
          )}
        </form>
      )}
    </>
  );
}

export default function VerifyPage() {
  return (
    <AuthShell>
      <Suspense>
        <VerifyForm />
      </Suspense>
    </AuthShell>
  );
}
