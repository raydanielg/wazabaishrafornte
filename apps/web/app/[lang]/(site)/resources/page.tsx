import type { Metadata } from "next";
import Link from "next/link";
import { HugeiconsIcon } from "@hugeicons/react";
import { ArrowRight01Icon } from "@hugeicons/core-free-icons";
import { getDictionary, isLocale, localizedPath, type Locale } from "@/lib/i18n";
import { pageAlternates } from "@/lib/seo";
import { PageHeader } from "@/components/marketing/page-header";
import { Section } from "@/components/marketing/section";
import { CtaSection } from "@/components/marketing/cta";

const HREF_MAP: Record<string, string> = {
  "getting-started": "/how-it-works",
  guides: "/resources",
  tutorials: "/resources",
  help: "/help",
  faq: "/faq",
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const { lang } = await params;
  const locale2 = isLocale(lang) ? lang : "en";
  const d = getDictionary(locale2);
  return { title: d.pages.resources.title, description: d.pages.resources.description, ...pageAlternates(locale2, "/resources") };
}

export default async function ResourcesPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  const locale: Locale = isLocale(lang) ? lang : "en";
  const dict = getDictionary(locale);

  return (
    <>
      <PageHeader title={dict.pages.resources.title} description={dict.pages.resources.description} />
      <Section>
        <div className="mx-auto grid max-w-4xl gap-4 sm:grid-cols-2">
          {dict.resources.items.map((r) => (
            <Link
              key={r.key}
              href={localizedPath(locale, HREF_MAP[r.key] ?? "/resources")}
              className="group rounded-xl border border-border bg-card p-6 transition-colors hover:bg-muted/40"
            >
              <h3 className="text-base font-semibold text-foreground">{r.title}</h3>
              <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
                {r.description}
              </p>
              <span className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-foreground">
                {dict.resources.readMore}
                <HugeiconsIcon
                  icon={ArrowRight01Icon}
                  className="size-4 transition-transform group-hover:translate-x-0.5"
                  strokeWidth={2}
                />
              </span>
            </Link>
          ))}
        </div>
      </Section>
      <CtaSection locale={locale} dict={dict} />
    </>
  );
}
