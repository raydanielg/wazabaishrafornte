"use client";

import { useState } from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import { UserIcon, Mail01Icon, LockIcon } from "@hugeicons/core-free-icons";
import { Button } from "@workspace/ui/components/button";
import { Input } from "@workspace/ui/components/input";
import { Label } from "@workspace/ui/components/label";
import type { Dictionary } from "@/lib/i18n";

/**
 * Auth form hitting the Wazabiashara backend (Better Auth endpoints).
 * After sign-in the app dashboard lives at NEXT_PUBLIC_APP_URL.
 */
export function AuthForm({
  mode,
  dict,
  locale,
}: {
  mode: "login" | "register";
  dict: Dictionary;
  locale: string;
}) {
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const t = (key: keyof Dictionary["auth"], fallback: string) =>
    dict.auth[key] ?? fallback;

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    const form = e.currentTarget;
    const payload: Record<string, string> = {
      email: (form.elements.namedItem("email") as HTMLInputElement).value.trim(),
      password: (form.elements.namedItem("password") as HTMLInputElement).value,
    };
    if (mode === "register") {
      payload.name = (
        form.elements.namedItem("name") as HTMLInputElement
      ).value.trim();
    }
    setLoading(true);
    try {
      const res = await fetch(
        `/api/app/auth/${mode === "login" ? "sign-in" : "sign-up"}/email`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify(payload),
        },
      );
      if (!res.ok) {
        const json = await res.json().catch(() => null);
        throw new Error(json?.message ?? t("errorGeneric", "Sign-in failed"));
      }
      const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? `/${locale}`;
      window.location.href = appUrl;
    } catch (err) {
      setError(err instanceof Error ? err.message : t("errorGeneric", "Sign-in failed"));
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      {mode === "register" && (
        <div className="space-y-1.5">
          <Label htmlFor="a-name">{t("name", "Name")}</Label>
          <Input
            id="a-name"
            name="name"
            required
            autoComplete="name"
            placeholder={t("namePlaceholder", "e.g. Juma Mwangi")}
            icon={<HugeiconsIcon icon={UserIcon} strokeWidth={2} />}
          />
        </div>
      )}
      <div className="space-y-1.5">
        <Label htmlFor="a-email">{t("email", "Email")}</Label>
        <Input
          id="a-email"
          name="email"
          type="email"
          required
          autoComplete="email"
          placeholder={t("emailPlaceholder", "juma@example.com")}
          icon={<HugeiconsIcon icon={Mail01Icon} strokeWidth={2} />}
        />
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="a-password">{t("password", "Password")}</Label>
        <Input
          id="a-password"
          name="password"
          type="password"
          required
          minLength={8}
          autoComplete={mode === "login" ? "current-password" : "new-password"}
          placeholder={t("passwordPlaceholder", "At least 8 characters")}
          icon={<HugeiconsIcon icon={LockIcon} strokeWidth={2} />}
        />
      </div>
      {error && <p className="text-sm text-destructive">{error}</p>}
      <Button type="submit" className="w-full" disabled={loading}>
        {loading
          ? t("pleaseWait", "Please wait…")
          : mode === "login"
            ? dict.nav.login
            : dict.nav.getStarted}
      </Button>
    </form>
  );
}
