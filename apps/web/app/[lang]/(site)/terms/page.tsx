import type { Metadata } from "next";
import { getDictionary, isLocale, type Locale } from "@/lib/i18n";
import { pageAlternates } from "@/lib/seo";
import { PageHeader } from "@/components/marketing/page-header";
import { Section } from "@/components/marketing/section";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const { lang } = await params;
  const locale2 = isLocale(lang) ? lang : "en";
  const d = getDictionary(locale2);
  return { title: d.pages.terms.title, description: d.pages.terms.description, ...pageAlternates(locale2, "/terms") };
}

export default async function TermsPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  const locale: Locale = isLocale(lang) ? lang : "en";
  const dict = getDictionary(locale);

  return (
    <>
      <PageHeader title={dict.pages.terms.title} description={dict.pages.terms.description} />
      <Section>
        <div className="mx-auto max-w-2xl">
          <p className="rounded-lg border border-border bg-muted/30 px-4 py-3 text-sm text-muted-foreground">
            {dict.legal.termsNote}
          </p>
          <div className="mt-10 space-y-8">
            {dict.legal.sections.terms.map((s) => (
              <div key={s.title}>
                <h2 className="text-base font-semibold text-foreground">
                  {s.title}
                </h2>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  {s.body}
                </p>
              </div>
            ))}
          </div>
        </div>
      </Section>
    </>
  );
}
