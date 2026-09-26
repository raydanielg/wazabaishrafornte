"use client";

import { useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@workspace/ui/components/button";
import { getDictionary, isLocale } from "@/lib/i18n";

/** Global error boundary (§46) — never expose internals. */
export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const pathname = usePathname();
  const lang = pathname.split("/")[1] ?? "en";
  const locale = isLocale(lang) ? lang : "en";
  const d = getDictionary(locale).errors;

  useEffect(() => {
    console.error("[wazabiashara]", error.digest ?? error.message);
  }, [error]);

  return (
    <div className="flex min-h-[70svh] flex-col items-center justify-center px-6 text-center">
      <h1 className="text-xl font-semibold tracking-tight">{d.genericTitle}</h1>
      <p className="mt-2 max-w-sm text-sm text-muted-foreground">
        {d.genericDesc}
      </p>
      <div className="mt-6 flex gap-3">
        <Button onClick={reset}>{d.retry}</Button>
        <Button variant="outline" render={<Link href={`/${locale}`} />}>
          {d.goHome}
        </Button>
      </div>
    </div>
  );
}
