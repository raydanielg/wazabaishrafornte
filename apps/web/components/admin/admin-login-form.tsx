"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { HugeiconsIcon } from "@hugeicons/react";
import { Mail01Icon, LockIcon, SecurityCheckIcon } from "@hugeicons/core-free-icons";
import { cn } from "@workspace/ui/lib/utils";
import { Button } from "@workspace/ui/components/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/card";
import { Field, FieldGroup, FieldLabel } from "@workspace/ui/components/field";
import { Input } from "@workspace/ui/components/input";

/** Admin sign-in — posts through the BFF proxy, which sets the session cookie. */
export function AdminLoginForm({
  locale,
  className,
  ...props
}: React.ComponentProps<"div"> & { locale: string }) {
  const router = useRouter();
  const search = useSearchParams();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    setLoading(true);
    const f = e.currentTarget;
    try {
      const res = await fetch("/api/admin/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: (f.elements.namedItem("email") as HTMLInputElement).value.trim(),
          password: (f.elements.namedItem("password") as HTMLInputElement).value,
        }),
      });
      const json = await res.json().catch(() => null);
      if (!res.ok) {
        throw new Error(json?.error?.message ?? "Invalid credentials");
      }
      const next = search.get("next");
      router.replace(next?.startsWith("/") ? next : `/${locale}/admin/dashboard`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Sign-in failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader className="text-center">
          <div className="mx-auto mb-2 flex size-10 items-center justify-center rounded-xl bg-primary/15">
            <HugeiconsIcon
              icon={SecurityCheckIcon}
              className="size-5 text-foreground"
              strokeWidth={2}
            />
          </div>
          <CardTitle className="text-xl">Admin sign in</CardTitle>
          <CardDescription>
            Wazabiashara platform administration
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={onSubmit}>
            <FieldGroup>
              <Field>
                <FieldLabel htmlFor="admin-email">Email</FieldLabel>
                <Input
                  id="admin-email"
                  name="email"
                  type="email"
                  placeholder="admin@wazabiashara.com"
                  required
                  autoComplete="email"
                  icon={<HugeiconsIcon icon={Mail01Icon} strokeWidth={2} />}
                />
              </Field>
              <Field>
                <FieldLabel htmlFor="admin-password">Password</FieldLabel>
                <Input
                  id="admin-password"
                  name="password"
                  type="password"
                  placeholder="Your admin password"
                  required
                  autoComplete="current-password"
                  icon={<HugeiconsIcon icon={LockIcon} strokeWidth={2} />}
                />
              </Field>
              {error && (
                <p className="text-sm text-destructive" role="alert">
                  {error}
                </p>
              )}
              <Field>
                <Button type="submit" size="lg" className="w-full" disabled={loading}>
                  {loading ? "Signing in…" : "Sign in"}
                </Button>
              </Field>
            </FieldGroup>
          </form>
        </CardContent>
      </Card>
      <p className="text-center text-xs text-muted-foreground">
        Restricted area. All actions are logged and audited.
      </p>
    </div>
  );
}
