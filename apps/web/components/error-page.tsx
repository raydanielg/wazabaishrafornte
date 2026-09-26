"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@workspace/ui/components/button";
import { getDictionary, type Locale } from "@/lib/i18n";

export function ErrorPage({
  locale,
  code,
  title,
  description,
  showBack = true,
  showLogin = false,
}: {
  locale: Locale;
  code: string;
  title?: string;
  description?: string;
  showBack?: boolean;
  showLogin?: boolean;
}) {
  const router = useRouter();
  const d = getDictionary(locale).errors;
  return (
    <div className="flex min-h-[70svh] flex-col items-center justify-center px-6 text-center">
      <p className="font-mono text-6xl font-bold tracking-tight text-muted-foreground/40">
        {code}
      </p>
      <h1 className="mt-4 text-xl font-semibold tracking-tight">
        {title ?? d.genericTitle}
      </h1>
      <p className="mt-2 max-w-sm text-sm text-muted-foreground">
        {description ?? d.genericDesc}
      </p>
      <div className="mt-6 flex gap-3">
        {showLogin ? (
          <Button render={<Link href={`/${locale}/auth/login`} />}>
            {d.loginAgain}
          </Button>
        ) : (
          <Button render={<Link href={`/${locale}`} />}>{d.goHome}</Button>
        )}
        {showBack && (
          <Button variant="outline" onClick={() => router.back()}>
            {d.goBack}
          </Button>
        )}
      </div>
    </div>
  );
}
