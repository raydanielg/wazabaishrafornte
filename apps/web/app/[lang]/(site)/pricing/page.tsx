import type { Metadata } from "next";
import { getDictionary, isLocale, type Locale } from "@/lib/i18n";
import { pageAlternates } from "@/lib/seo";
import { PageHeader } from "@/components/marketing/page-header";
import { PricingCards } from "@/components/marketing/pricing";
import { FaqAccordion } from "@/components/marketing/faq-accordion";
import { CtaSection } from "@/components/marketing/cta";
import { Section, SectionHeading } from "@/components/marketing/section";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const { lang } = await params;
  const locale2 = isLocale(lang) ? lang : "en";
  const d = getDictionary(locale2);
  return { title: d.pages.pricing.title, description: d.pages.pricing.description, ...pageAlternates(locale2, "/pricing") };
}

export default async function PricingPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  const locale: Locale = isLocale(lang) ? lang : "en";
  const dict = getDictionary(locale);

  return (
    <>
      <PageHeader title={dict.pages.pricing.title} description={dict.pages.pricing.description} />
      <Section>
        <PricingCards locale={locale} dict={dict} />
      </Section>
      <Section className="bg-muted/30">
        <SectionHeading eyebrow={dict.faq.eyebrow} title={dict.faq.title} />
        <div className="mt-10">
          <FaqAccordion dict={dict} />
        </div>
      </Section>
      <CtaSection locale={locale} dict={dict} />
    </>
  );
}
