import type { Metadata } from "next";
import { getDictionary, isLocale } from "@/lib/i18n";
import { pageAlternates } from "@/lib/seo";
import { Section } from "@/components/marketing/section";
import { StatusBoard } from "@/components/marketing/status-board";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const { lang } = await params;
  const d = getDictionary(isLocale(lang) ? lang : "en");
  return {
    title: d.pages2.status.title,
    description: d.pages2.status.description,
    ...pageAlternates(isLocale(lang) ? lang : "en", "/status"),
  };
}

export default function StatusPage() {
  return (
    <Section>
      <StatusBoard />
    </Section>
  );
}
