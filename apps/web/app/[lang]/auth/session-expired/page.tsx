"use client";

import { usePathname } from "next/navigation";
import { getDictionary, isLocale } from "@/lib/i18n";
import { ErrorPage } from "@/components/error-page";

export default function SessionExpiredPage() {
  const lang = usePathname().split("/")[1] ?? "en";
  const locale = isLocale(lang) ? lang : "en";
  const d = getDictionary(locale).errors;
  return (
    <ErrorPage
      locale={locale}
      code="401"
      title={d.sessionExpiredTitle}
      description={d.sessionExpiredDesc}
      showLogin
      showBack={false}
    />
  );
}
