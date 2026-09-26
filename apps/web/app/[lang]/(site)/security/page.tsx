import type { Metadata } from "next";
import { getDictionary, isLocale, type Locale } from "@/lib/i18n";
import { pageAlternates } from "@/lib/seo";
import { PageHeader } from "@/components/marketing/page-header";
import { Section } from "@/components/marketing/section";
import { CtaSection } from "@/components/marketing/cta";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const { lang } = await params;
  const locale2 = isLocale(lang) ? lang : "en";
  const d = getDictionary(locale2);
  return { title: d.pages.security.title, description: d.pages.security.description, ...pageAlternates(locale2, "/security") };
}

export default async function SecurityPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  const locale: Locale = isLocale(lang) ? lang : "en";
  const dict = getDictionary(locale);

  return (
    <>
      <PageHeader title={dict.pages.security.title} description={dict.pages.security.description} />
      <Section>
        <div className="mx-auto max-w-2xl">
          <p className="text-lg leading-relaxed text-muted-foreground">
            {dict.securityPage.intro}
          </p>
          <div className="mt-10 space-y-8">
            {dict.securityPage.sections.map((s) => (
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
      <CtaSection locale={locale} dict={dict} />
    </>
  );
}
