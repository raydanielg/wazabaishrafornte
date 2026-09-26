"use client";

import { usePathname, useRouter } from "next/navigation";
import { HugeiconsIcon } from "@hugeicons/react";
import { GlobeIcon, ArrowDown01Icon } from "@hugeicons/core-free-icons";
import { Button } from "@workspace/ui/components/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@workspace/ui/components/dropdown-menu";
import { locales, type Dictionary, type Locale } from "@/lib/i18n";

const LABELS: Record<Locale, string> = { en: "EN", sw: "SW" };

export function LanguageSwitcher({
  locale,
  dict,
  compact,
}: {
  locale: Locale;
  dict: Dictionary;
  compact?: boolean;
}) {
  const pathname = usePathname();
  const router = useRouter();

  function switchTo(next: Locale) {
    if (next === locale) return;
    // eslint-disable-next-line react-hooks/immutability -- setting the locale cookie is the point
    document.cookie = `wz-lang=${next};path=/;max-age=31536000;samesite=lax`;
    const rest = pathname.replace(/^\/(en|sw)/, "") || "/";
    router.push(`/${next}${rest === "/" ? "" : rest}`);
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={
          <Button
            variant="ghost"
            size="sm"
            className="gap-1.5 text-muted-foreground"
            aria-label={dict.lang.label}
          />
        }
      >
        <HugeiconsIcon icon={GlobeIcon} strokeWidth={2} />
        {!compact && (
          <>
            {LABELS[locale]}
            <HugeiconsIcon icon={ArrowDown01Icon} strokeWidth={2} className="size-3" />
          </>
        )}
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {locales.map((l) => (
          <DropdownMenuItem
            key={l}
            onSelect={() => switchTo(l)}
            aria-current={l === locale ? "true" : undefined}
            className={l === locale ? "font-medium" : undefined}
          >
            {l === "en" ? dict.lang.english : dict.lang.swahili}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
