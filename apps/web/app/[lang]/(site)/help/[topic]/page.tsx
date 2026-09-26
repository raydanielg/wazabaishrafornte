import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { HugeiconsIcon } from "@hugeicons/react";
import { ArrowLeft01Icon } from "@hugeicons/core-free-icons";
import { getDictionary, isLocale, localizedPath, locales, type Locale } from "@/lib/i18n";
import { pageAlternates, breadcrumbJsonLd } from "@/lib/seo";
import { HELP_TOPICS } from "@/lib/help-topics";
import { Section } from "@/components/marketing/section";
import { CtaSection } from "@/components/marketing/cta";
import { Button } from "@workspace/ui/components/button";

export function generateStaticParams() {
  return locales.flatMap((lang) =>
    HELP_TOPICS.map((t) => ({ lang, topic: t.slug })),
  );
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string; topic: string }>;
}): Promise<Metadata> {
  const { lang, topic } = await params;
  const t = HELP_TOPICS.find((x) => x.slug === topic);
  const locale = isLocale(lang) ? lang : "en";
  if (!t) return { title: "Help" };
  return {
    title: `${t[locale].title} — Help Center`,
    description: t[locale].description,
    ...pageAlternates(locale, `/help/${topic}`),
  };
}

export default async function HelpTopicPage({
  params,
}: {
  params: Promise<{ lang: string; topic: string }>;
}) {
  const { lang, topic } = await params;
  const locale: Locale = isLocale(lang) ? lang : "en";
  const dict = getDictionary(locale);
  const t = HELP_TOPICS.find((x) => x.slug === topic);
  if (!t) notFound();
  const content = t[locale];
  const related = HELP_TOPICS.filter((x) => x.slug !== topic).slice(0, 4);

  const crumbs = breadcrumbJsonLd(locale, [
    { name: dict.nav.home ?? "Home", path: "/" },
    { name: dict.nav.help, path: "/help" },
    { name: content.title, path: `/help/${t.slug}` },
  ]);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(crumbs) }}
      />
      <Section>
        <div className="mx-auto max-w-2xl">
          <Link
            href={localizedPath(locale, "/help")}
            className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
          >
            <HugeiconsIcon icon={ArrowLeft01Icon} className="size-4" strokeWidth={2} />
            {dict.nav.help}
          </Link>
          <h1 className="mt-4 text-2xl font-semibold tracking-tight sm:text-3xl">
            {content.title}
          </h1>
          <p className="mt-2 text-muted-foreground">{content.description}</p>
          <ol className="mt-8 space-y-4">
            {content.steps.map((step, i) => (
              <li key={i} className="flex items-start gap-3">
                <span className="mt-0.5 flex size-6 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-semibold">
                  {i + 1}
                </span>
                <p className="text-sm leading-relaxed text-muted-foreground">
                  {step}
                </p>
              </li>
            ))}
          </ol>
          <div className="mt-10 border-t border-border pt-6">
            <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
              {dict.misc.learnMore}
            </p>
            <div className="mt-3 flex flex-wrap gap-2">
              {related.map((r) => (
                <Link
                  key={r.slug}
                  href={localizedPath(locale, `/help/${r.slug}`)}
                  className="rounded-full border border-border px-3.5 py-1.5 text-xs font-medium transition-colors hover:bg-muted"
                >
                  {r[locale].title}
                </Link>
              ))}
            </div>
          </div>
          <div className="mt-8 rounded-xl border border-border bg-card p-5 text-center">
            <p className="text-sm text-muted-foreground">
              {dict.pages.contact.description}
            </p>
            <Button
              size="sm"
              variant="outline"
              className="mt-3"
              nativeButton={false}
              render={<Link href={localizedPath(locale, "/contact")} />}
            >
              {dict.nav.contact}
            </Button>
          </div>
        </div>
      </Section>
      <CtaSection dict={dict} locale={locale} />
    </>
  );
}
