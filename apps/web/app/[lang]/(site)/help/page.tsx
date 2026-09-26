import type { Metadata } from "next";
import Link from "next/link";
import { getDictionary, isLocale, localizedPath, type Locale } from "@/lib/i18n";
import { pageAlternates } from "@/lib/seo";
import { PageHeader } from "@/components/marketing/page-header";
import { Section } from "@/components/marketing/section";
import { FaqAccordion } from "@/components/marketing/faq-accordion";
import { CtaSection } from "@/components/marketing/cta";
import { Button } from "@workspace/ui/components/button";
import { CONTACT } from "@/lib/data";
import { HELP_TOPICS } from "@/lib/help-topics";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const { lang } = await params;
  const locale2 = isLocale(lang) ? lang : "en";
  const d = getDictionary(locale2);
  return { title: d.pages.help.title, description: d.pages.help.description, ...pageAlternates(locale2, "/help") };
}

export default async function HelpPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  const locale: Locale = isLocale(lang) ? lang : "en";
  const dict = getDictionary(locale);

  return (
    <>
      <PageHeader title={dict.pages.help.title} description={dict.pages.help.description} />
      <Section>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {HELP_TOPICS.map((t) => (
            <Link
              key={t.slug}
              href={localizedPath(locale, `/help/${t.slug}`)}
              className="rounded-xl border border-border bg-card p-4 transition-colors hover:bg-muted/40"
            >
              <p className="text-sm font-medium">{t[locale].title}</p>
              <p className="mt-1 text-xs text-muted-foreground line-clamp-2">
                {t[locale].description}
              </p>
            </Link>
          ))}
        </div>
        <div className="mx-auto mt-14 max-w-3xl">
          <FaqAccordion dict={dict} />
          <div className="mt-10 rounded-xl border border-border bg-card p-6 text-center">
            <p className="text-sm text-muted-foreground">{dict.pages.contact.description}</p>
            <div className="mt-4 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Button
                size="sm"
                nativeButton={false}
                render={<Link href={localizedPath(locale, "/contact")} />}
              >
                {dict.nav.contact}
              </Button>
              <Button
                size="sm"
                variant="outline"
                nativeButton={false}
                render={<a href={`mailto:${CONTACT.email}`} />}
              >
                {CONTACT.email}
              </Button>
            </div>
          </div>
        </div>
      </Section>
      <CtaSection locale={locale} dict={dict} />
    </>
  );
}
