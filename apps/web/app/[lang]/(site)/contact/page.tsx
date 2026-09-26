import type { Metadata } from "next";
import { HugeiconsIcon } from "@hugeicons/react";
import { Mail01Icon, LocationIcon } from "@hugeicons/core-free-icons";
import { getDictionary, isLocale, type Locale } from "@/lib/i18n";
import { pageAlternates } from "@/lib/seo";
import { PageHeader } from "@/components/marketing/page-header";
import { Section } from "@/components/marketing/section";
import { ContactForm } from "@/components/marketing/contact-form";
import { CONTACT } from "@/lib/data";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const { lang } = await params;
  const locale2 = isLocale(lang) ? lang : "en";
  const d = getDictionary(locale2);
  return { title: d.pages.contact.title, description: d.pages.contact.description, ...pageAlternates(locale2, "/contact") };
}

export default async function ContactPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  const locale: Locale = isLocale(lang) ? lang : "en";
  const dict = getDictionary(locale);

  return (
    <>
      <PageHeader title={dict.pages.contact.title} description={dict.pages.contact.description} />
      <Section>
        <div className="mx-auto grid max-w-4xl gap-10 lg:grid-cols-[1fr_1.2fr]">
          <div className="space-y-5">
            <div className="flex items-start gap-3">
              <HugeiconsIcon
                icon={Mail01Icon}
                className="mt-0.5 size-5 text-muted-foreground"
                strokeWidth={2}
              />
              <div>
                <p className="text-sm font-medium text-foreground">
                  {dict.contact.emailLabel}
                </p>
                <a
                  href={`mailto:${CONTACT.email}`}
                  className="text-sm text-muted-foreground hover:text-foreground"
                >
                  {CONTACT.email}
                </a>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <HugeiconsIcon
                icon={LocationIcon}
                className="mt-0.5 size-5 text-muted-foreground"
                strokeWidth={2}
              />
              <div>
                <p className="text-sm font-medium text-foreground">
                  {dict.contact.locationLabel}
                </p>
                <p className="text-sm text-muted-foreground">
                  {dict.contact.locationValue}
                </p>
              </div>
            </div>
          </div>
          <div className="rounded-xl border border-border bg-card p-6">
            <h2 className="mb-5 text-base font-semibold text-foreground">
              {dict.contact.formTitle}
            </h2>
            <ContactForm dict={dict} />
          </div>
        </div>
      </Section>
    </>
  );
}
