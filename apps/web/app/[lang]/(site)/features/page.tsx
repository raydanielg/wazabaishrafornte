import type { Metadata } from "next";
import { getDictionary, isLocale, type Locale } from "@/lib/i18n";
import { pageAlternates } from "@/lib/seo";
import { PageHeader } from "@/components/marketing/page-header";
import { SolutionSection } from "@/components/marketing/home-sections";
import { FeatureBlock } from "@/components/marketing/feature-block";
import { Showcase } from "@/components/marketing/showcase";
import { CtaSection } from "@/components/marketing/cta";
import { Section, SectionHeading } from "@/components/marketing/section";
import { ListMockup } from "@/components/marketing/mockups";

const fmt = (n: number) => `TZS ${n.toLocaleString("en-US")}`;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const { lang } = await params;
  const locale2 = isLocale(lang) ? lang : "en";
  const d = getDictionary(locale2);
  return { title: d.pages.features.title, description: d.pages.features.description, ...pageAlternates(locale2, "/features") };
}

export default async function FeaturesPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  const locale: Locale = isLocale(lang) ? lang : "en";
  const dict = getDictionary(locale);

  return (
    <>
      <PageHeader title={dict.pages.features.title} description={dict.pages.features.description} />
      <SolutionSection dict={dict} />
      <Section className="space-y-20">
        <FeatureBlock
          label={dict.featureBlocks.sales.label}
          title={dict.featureBlocks.sales.title}
          description={dict.featureBlocks.sales.description}
          points={dict.featureBlocks.sales.points}
          visual={<ListMockup rows={[
            { label: "RIS-1042 · Cash", value: fmt(45000) },
            { label: "RIS-1041 · Cash", value: fmt(12500) },
            { label: "RIS-1040 · Deni", value: fmt(68000), muted: true },
          ]} />}
        />
        <FeatureBlock
          reversed
          label={dict.featureBlocks.inventory.label}
          title={dict.featureBlocks.inventory.title}
          description={dict.featureBlocks.inventory.description}
          points={dict.featureBlocks.inventory.points}
          visual={<ListMockup rows={[
            { label: "Coca Cola 500ml", value: "84" },
            { label: "Maji 1.5L", value: "12", muted: true },
            { label: "Cooking Oil 2L", value: "31" },
          ]} />}
        />
        <FeatureBlock
          label={dict.featureBlocks.customers.label}
          title={dict.featureBlocks.customers.title}
          description={dict.featureBlocks.customers.description}
          points={dict.featureBlocks.customers.points}
          visual={<ListMockup rows={[
            { label: "Juma Ally", value: fmt(68000) },
            { label: "Amina Bakari", value: fmt(15200) },
          ]} />}
        />
        <FeatureBlock
          reversed
          label={dict.featureBlocks.reports.label}
          title={dict.featureBlocks.reports.title}
          description={dict.featureBlocks.reports.description}
          points={dict.featureBlocks.reports.points}
          visual={<ListMockup rows={[
            { label: dict.reports.items[0] ?? "", value: fmt(4210000) },
            { label: dict.reports.items[2] ?? "", value: fmt(960000) },
          ]} />}
        />
      </Section>
      <Section className="bg-muted/30">
        <SectionHeading eyebrow={dict.showcase.eyebrow} title={dict.showcase.title} />
        <div className="mt-10">
          <Showcase dict={dict} />
        </div>
      </Section>
      <CtaSection locale={locale} dict={dict} />
    </>
  );
}
