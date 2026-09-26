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
  return { title: d.pages.about.title, description: d.pages.about.description, ...pageAlternates(locale2, "/about") };
}

export default async function AboutPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  const locale: Locale = isLocale(lang) ? lang : "en";
  const dict = getDictionary(locale);

  return (
    <>
      <PageHeader title={dict.pages.about.title} description={dict.pages.about.description} />
      <Section>
        <div className="mx-auto max-w-2xl space-y-10">
          <div>
            <h2 className="text-lg font-semibold text-foreground">
              {dict.about.mission}
            </h2>
            <p className="mt-3 leading-relaxed text-muted-foreground">
              {dict.about.missionText}
            </p>
          </div>
          <div className="rounded-xl border border-border bg-muted/30 p-6">
            <h2 className="text-lg font-semibold text-foreground">
              {dict.about.philosophy}
            </h2>
            <p className="mt-3 text-lg font-medium tracking-tight text-foreground">
              {dict.about.philosophyText}
            </p>
          </div>
          <div>
            <h2 className="text-lg font-semibold text-foreground">
              {dict.about.who}
            </h2>
            <p className="mt-3 leading-relaxed text-muted-foreground">
              {dict.about.whoText}
            </p>
          </div>
        </div>
      </Section>
      <CtaSection locale={locale} dict={dict} />
    </>
  );
}
