import type { Metadata } from "next";
import { getDictionary, isLocale, type Locale } from "@/lib/i18n";
import { pageAlternates } from "@/lib/seo";
import { PageHeader } from "@/components/marketing/page-header";
import { MobileAppSection } from "@/components/marketing/home-sections";
import { CtaSection } from "@/components/marketing/cta";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const { lang } = await params;
  const locale2 = isLocale(lang) ? lang : "en";
  const d = getDictionary(locale2);
  return { title: d.pages.mobileApp.title, description: d.pages.mobileApp.description, ...pageAlternates(locale2, "/mobile-app") };
}

export default async function MobileAppPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  const locale: Locale = isLocale(lang) ? lang : "en";
  const dict = getDictionary(locale);

  return (
    <>
      <PageHeader title={dict.pages.mobileApp.title} description={dict.pages.mobileApp.description} />
      <MobileAppSection locale={locale} dict={dict} />
      <CtaSection locale={locale} dict={dict} />
    </>
  );
}
