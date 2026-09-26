"use client";

import { usePathname } from "next/navigation";
import { isLocale } from "@/lib/i18n";
import { ErrorPage } from "@/components/error-page";
import { getDictionary } from "@/lib/i18n";

export default function NotFound() {
  const pathname = usePathname();
  const lang = pathname.split("/")[1] ?? "en";
  const locale = isLocale(lang) ? lang : "en";
  const d = getDictionary(locale).errors;
  return (
    <ErrorPage
      locale={locale}
      code="404"
      title={d.notFoundTitle}
      description={d.notFoundDesc}
    />
  );
}
