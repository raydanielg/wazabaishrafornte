import type { Metadata } from "next";
import { getDictionary, isLocale, type Locale } from "@/lib/i18n";
import { pageAlternates } from "@/lib/seo";
import { PageHeader } from "@/components/marketing/page-header";
import {
  MultiBusinessSection,
  BusinessTypesSection,
  StaffSection,
} from "@/components/marketing/home-sections";
import { CtaSection } from "@/components/marketing/cta";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const { lang } = await params;
  const locale2 = isLocale(lang) ? lang : "en";
  const d = getDictionary(locale2);
  return { title: d.pages.businesses.title, description: d.pages.businesses.description, ...pageAlternates(locale2, "/businesses") };
}

export default async function BusinessesPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  const locale: Locale = isLocale(lang) ? lang : "en";
  const dict = getDictionary(locale);

  return (
    <>
      <PageHeader title={dict.pages.businesses.title} description={dict.pages.businesses.description} />
      <MultiBusinessSection dict={dict} />
      <BusinessTypesSection dict={dict} locale={locale} />
      <StaffSection dict={dict} />
      <CtaSection locale={locale} dict={dict} />
    </>
  );
}
