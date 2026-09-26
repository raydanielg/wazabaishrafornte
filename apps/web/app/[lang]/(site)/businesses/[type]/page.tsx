import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { HugeiconsIcon } from "@hugeicons/react";
import { CheckIcon } from "@hugeicons/core-free-icons";
import {
  getDictionary,
  isLocale,
  localizedPath,
  locales,
  type Locale,
} from "@/lib/i18n";
import { pageAlternates, breadcrumbJsonLd } from "@/lib/seo";
import { BUSINESS_TYPES, BUSINESS_TYPE_LABELS, BUSINESS_TYPE_POINTS } from "@/lib/data";
import { Section } from "@/components/marketing/section";
import { CtaSection } from "@/components/marketing/cta";

export function generateStaticParams() {
  return locales.flatMap((lang) =>
    BUSINESS_TYPES.map((t) => ({ lang, type: t })),
  );
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string; type: string }>;
}): Promise<Metadata> {
  const { lang, type } = await params;
  const locale = isLocale(lang) ? lang : "en";
  const label = BUSINESS_TYPE_LABELS[type]?.[locale];
  if (!label) return { title: "Businesses" };
  const title =
    locale === "sw"
      ? `Wazabiashara kwa ${label}`
      : `Wazabiashara for ${label} Businesses`;
  return { title, ...pageAlternates(locale, `/businesses/${type}`) };
}

export default async function BusinessTypePage({
  params,
}: {
  params: Promise<{ lang: string; type: string }>;
}) {
  const { lang, type } = await params;
  const locale: Locale = isLocale(lang) ? lang : "en";
  const dict = getDictionary(locale);
  if (!(BUSINESS_TYPES as readonly string[]).includes(type)) notFound();

  const label = BUSINESS_TYPE_LABELS[type]![locale];
  const points = BUSINESS_TYPE_POINTS[type]?.[locale] ?? [];
  const others = BUSINESS_TYPES.filter((t) => t !== type).slice(0, 4);
  const crumbs = breadcrumbJsonLd(locale, [
    { name: dict.nav.home, path: "/" },
    { name: dict.nav.businesses, path: "/businesses" },
    { name: label, path: `/businesses/${type}` },
  ]);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(crumbs) }}
      />
      <Section>
        <div className="mx-auto max-w-2xl">
          <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
            {dict.nav.businesses}
          </p>
          <h1 className="mt-2 text-2xl font-semibold tracking-tight sm:text-3xl">
            {locale === "sw"
              ? `Wazabiashara kwa ${label}`
              : `Wazabiashara for ${label}`}
          </h1>
          <p className="mt-3 leading-relaxed text-muted-foreground">
            {dict.businessTypes.description}
          </p>
          <ul className="mt-8 space-y-3.5">
            {points.map((pt) => (
              <li key={pt} className="flex items-start gap-3">
                <HugeiconsIcon
                  icon={CheckIcon}
                  className="mt-0.5 size-4 shrink-0 text-emerald-600"
                  strokeWidth={2.5}
                />
                <span className="text-sm leading-relaxed">{pt}</span>
              </li>
            ))}
          </ul>
          <div className="mt-10 border-t border-border pt-6">
            <div className="flex flex-wrap gap-2">
              {others.map((t) => (
                <Link
                  key={t}
                  href={localizedPath(locale, `/businesses/${t}`)}
                  className="rounded-full border border-border px-3.5 py-1.5 text-xs font-medium transition-colors hover:bg-muted"
                >
                  {BUSINESS_TYPE_LABELS[t]?.[locale]}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </Section>
      <CtaSection dict={dict} locale={locale} />
    </>
  );
}
