import {
  getDictionary,
  isLocale,
  type Locale,
} from "@/lib/i18n";
import {
  organizationJsonLd,
  webSiteJsonLd,
  softwareAppJsonLd,
  faqJsonLd,
} from "@/lib/seo";
import {
  Hero,
  TrustStrip,
  ProblemSection,
  SolutionSection,
  MultiBusinessSection,
  BusinessTypesSection,
  StepsSection,
  MobileAppSection,
  StaffSection,
  ReportsSection,
  SecuritySection,
} from "@/components/marketing/home-sections";
import { FeatureBlock } from "@/components/marketing/feature-block";
import { Showcase } from "@/components/marketing/showcase";
import { PricingCards } from "@/components/marketing/pricing";
import { FaqAccordion } from "@/components/marketing/faq-accordion";
import { Reveal } from "@/components/marketing/reveal";
import { CtaSection } from "@/components/marketing/cta";
import { Section, SectionHeading } from "@/components/marketing/section";
import { ListMockup } from "@/components/marketing/mockups";

const fmt = (n: number) => `TZS ${n.toLocaleString("en-US")}`;

export default async function HomePage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  const locale: Locale = isLocale(lang) ? lang : "en";
  const dict = getDictionary(locale);

  const jsonLd = [
    organizationJsonLd(),
    webSiteJsonLd(),
    softwareAppJsonLd(dict),
    faqJsonLd(dict.faq.items),
  ];

  return (
    <>
      {jsonLd.map((schema, i) => (
        <script
          key={i}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
      ))}
      <Hero locale={locale} dict={dict} />
      <Reveal><TrustStrip dict={dict}  /></Reveal>
      <Reveal><ProblemSection dict={dict}  /></Reveal>
      <Reveal><SolutionSection dict={dict}  /></Reveal>

      {/* Alternating feature showcase (§13) */}
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
            { label: "RIS-1039 · Cash", value: fmt(8300) },
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
            { label: "Mchele 25kg", value: "6" },
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
            { label: "Neema Joseph", value: fmt(0) },
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
            { label: dict.reports.items[1] ?? "", value: fmt(1130000) },
            { label: dict.reports.items[2] ?? "", value: fmt(960000) },
          ]} />}
        />
      </Section>

      <Reveal><MultiBusinessSection dict={dict}  /></Reveal>
      <Reveal><BusinessTypesSection dict={dict} locale={locale} /></Reveal>
      <Reveal><StepsSection dict={dict}  /></Reveal>

      {/* Product showcase (§17) */}
      <Section className="bg-muted/30">
        <SectionHeading
          eyebrow={dict.showcase.eyebrow}
          title={dict.showcase.title}
        />
        <div className="mt-10">
          <Showcase dict={dict} />
        </div>
      </Section>

      <Reveal><MobileAppSection locale={locale} dict={dict}  /></Reveal>
      <Reveal><StaffSection dict={dict}  /></Reveal>
      <Reveal><ReportsSection dict={dict}  /></Reveal>
      <Reveal><SecuritySection locale={locale} dict={dict}  /></Reveal>

      {/* Pricing (§22) */}
      <Section>
        <SectionHeading
          eyebrow={dict.pricing.eyebrow}
          title={dict.pricing.title}
          description={dict.pricing.description}
        />
        <div className="mt-10">
          <PricingCards locale={locale} dict={dict} />
        </div>
      </Section>

      {/* FAQ (§24) */}
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
