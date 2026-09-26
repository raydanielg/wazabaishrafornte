"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { getDictionary, isLocale } from "@/lib/i18n";
import { Button } from "@workspace/ui/components/button";

export default function MaintenancePage() {
  const lang = usePathname().split("/")[1] ?? "en";
  const locale = isLocale(lang) ? lang : "en";
  const d = getDictionary(locale).errors;
  return (
    <div className="flex min-h-svh flex-col items-center justify-center px-6 text-center">
      <h1 className="text-xl font-semibold">{d.maintenanceTitle}</h1>
      <p className="mt-2 max-w-sm text-sm text-muted-foreground">
        {d.maintenanceDesc}
      </p>
      <div className="mt-6 flex gap-3">
        <Button onClick={() => window.location.reload()}>{d.retry}</Button>
        <Button variant="outline" render={<Link href={`/${locale}/status`} />}>
          Status
        </Button>
      </div>
    </div>
  );
}
