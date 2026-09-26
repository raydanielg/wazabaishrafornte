"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  UserIcon,
  Mail01Icon,
  LockIcon,
  CheckIcon,
  SmartPhoneIcon,
} from "@hugeicons/core-free-icons";
import { Button } from "@workspace/ui/components/button";
import { Input } from "@workspace/ui/components/input";
import { Label } from "@workspace/ui/components/label";
import { cn } from "@workspace/ui/lib/utils";
import { localizedPath, type Dictionary, type Locale } from "@/lib/i18n";

interface Plan {
  id: string;
  name: string;
  slug: string;
  price: string;
  currency: string;
  trialDays: number;
}

type Step = "account" | "plan" | "done";

/**
 * Minimal registration (user request): create account → pick a plan →
 * continue to the app. Everything else happens inside the product.
 */
export function RegisterFlow({
  dict,
  locale,
}: {
  dict: Dictionary;
  locale: Locale;
}) {
  const [step, setStep] = useState<Step>("account");
  const [plans, setPlans] = useState<Plan[] | null>(null);
  const [selected, setSelected] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetch("/api/app/v1/packages")
      .then((r) => (r.ok ? r.json() : Promise.reject()))
      .then((j) => setPlans(j.data ?? []))
      .catch(() => setPlans([]));
  }, []);

  const isSw = locale === "sw";

  async function onRegister(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    const form = e.currentTarget;
    const payload = {
      name: (form.elements.namedItem("name") as HTMLInputElement).value.trim(),
      email: (form.elements.namedItem("email") as HTMLInputElement).value.trim(),
      password: (form.elements.namedItem("password") as HTMLInputElement).value,
    };
    setLoading(true);
    try {
      const res = await fetch("/api/app/auth/sign-up/email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const json = await res.json().catch(() => null);
        throw new Error(
          json?.message ??
            (isSw ? "Usajili umeshindikana" : "Registration failed"),
        );
      }
      setStep("plan");
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : isSw
            ? "Usajili umeshindikana"
            : "Registration failed",
      );
    } finally {
      setLoading(false);
    }
  }

  function finish() {
    if (selected) {
      localStorage.setItem("wz-preferred-plan", selected);
    }
    setStep("done");
  }

  function goToApp() {
    window.location.href = process.env.NEXT_PUBLIC_APP_URL ?? `/${locale}`;
  }

  /* -------- Step 1: account -------- */
  if (step === "account") {
    return (
      <form onSubmit={onRegister} className="space-y-4">
        <div className="space-y-1.5">
          <Label htmlFor="r-name">{dict.auth.name}</Label>
          <Input
            id="r-name"
            name="name"
            required
            autoComplete="name"
            placeholder={dict.auth.namePlaceholder}
            icon={<HugeiconsIcon icon={UserIcon} strokeWidth={2} />}
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="r-email">{dict.auth.email}</Label>
          <Input
            id="r-email"
            name="email"
            type="email"
            required
            autoComplete="email"
            placeholder={dict.auth.emailPlaceholder}
            icon={<HugeiconsIcon icon={Mail01Icon} strokeWidth={2} />}
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="r-password">{dict.auth.password}</Label>
          <Input
            id="r-password"
            name="password"
            type="password"
            required
            minLength={8}
            autoComplete="new-password"
            placeholder={dict.auth.passwordPlaceholder}
            icon={<HugeiconsIcon icon={LockIcon} strokeWidth={2} />}
          />
        </div>
        {error && <p className="text-sm text-destructive">{error}</p>}
        <Button type="submit" className="w-full" size="lg" disabled={loading}>
          {loading ? dict.auth.pleaseWait : dict.nav.getStarted}
        </Button>
      </form>
    );
  }

  /* -------- Step 2: plan choice -------- */
  if (step === "plan") {
    return (
      <div className="space-y-4">
        <p className="text-sm font-medium text-foreground">
          {isSw ? "Chagua mpango wako" : "Choose your plan"}
        </p>
        <div className="space-y-2" role="radiogroup">
          {plans === null ? (
            <p className="py-4 text-center text-sm text-muted-foreground">
              {dict.pricing.loading}
            </p>
          ) : (
            plans.map((p) => (
              <button
                key={p.id}
                type="button"
                role="radio"
                aria-checked={selected === p.slug}
                onClick={() => setSelected(p.slug)}
                className={cn(
                  "flex w-full items-center justify-between rounded-2xl border px-4 py-3 text-left transition-all",
                  selected === p.slug
                    ? "border-primary bg-primary/10 ring-1 ring-primary/40"
                    : "border-border hover:bg-muted/50",
                )}
              >
                <div>
                  <p className="text-sm font-medium">{p.name}</p>
                  {p.trialDays > 0 && (
                    <p className="text-xs text-muted-foreground">
                      {dict.pricing.trial.replace("{days}", String(p.trialDays))}
                    </p>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-semibold tabular-nums">
                    {Number(p.price) === 0
                      ? dict.pricing.free
                      : `${p.currency} ${Number(p.price).toLocaleString("en-US")}`}
                  </span>
                  {selected === p.slug && (
                    <HugeiconsIcon
                      icon={CheckIcon}
                      className="size-4 text-foreground"
                      strokeWidth={2.5}
                    />
                  )}
                </div>
              </button>
            ))
          )}
        </div>
        <Button
          className="w-full"
          size="lg"
          onClick={finish}
          disabled={plans === null}
        >
          {isSw ? "Endelea" : "Continue"}
        </Button>
      </div>
    );
  }

  /* -------- Step 3: done — push to app -------- */
  return (
    <div className="space-y-5 text-center">
      <div className="mx-auto flex size-12 items-center justify-center rounded-full bg-emerald-100 dark:bg-emerald-950/50">
        <HugeiconsIcon
          icon={CheckIcon}
          className="size-6 text-emerald-600"
          strokeWidth={2.5}
        />
      </div>
      <div>
        <p className="text-base font-semibold text-foreground">
          {isSw ? "Akaunti iko tayari!" : "Your account is ready!"}
        </p>
        <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
          {isSw
            ? "Kwa uzoefu kamili — rekodi mauzo, simamia hisa na wafanyakazi — tumia app ya Wazabiashara."
            : "For the full experience — record sales, manage stock and staff — use the Wazabiashara app."}
        </p>
      </div>
      <Button className="w-full" size="lg" onClick={goToApp}>
        <HugeiconsIcon icon={SmartPhoneIcon} strokeWidth={2} />
        {dict.mobile.cta}
      </Button>
      <Link
        href={localizedPath(locale, "/")}
        className="block text-sm text-muted-foreground underline-offset-4 hover:underline"
      >
        {dict.misc.backToHome}
      </Link>
    </div>
  );
}
