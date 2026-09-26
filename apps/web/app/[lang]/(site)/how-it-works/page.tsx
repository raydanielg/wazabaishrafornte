import type { Metadata } from "next";
import { getDictionary, isLocale, type Locale } from "@/lib/i18n";
import { pageAlternates } from "@/lib/seo";
import { PageHeader } from "@/components/marketing/page-header";
import { StepsSection, MobileAppSection } from "@/components/marketing/home-sections";
import { CtaSection } from "@/components/marketing/cta";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const { lang } = await params;
  const locale2 = isLocale(lang) ? lang : "en";
  const d = getDictionary(locale2);
  return { title: d.pages.howItWorks.title, description: d.pages.howItWorks.description, ...pageAlternates(locale2, "/how-it-works") };
}

export default async function HowItWorksPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  const locale: Locale = isLocale(lang) ? lang : "en";
  const dict = getDictionary(locale);

  return (
    <>
      <PageHeader title={dict.pages.howItWorks.title} description={dict.pages.howItWorks.description} />
      <StepsSection dict={dict} />
      <MobileAppSection locale={locale} dict={dict} />
      <CtaSection locale={locale} dict={dict} />
    </>
  );
}
