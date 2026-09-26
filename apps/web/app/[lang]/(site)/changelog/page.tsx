import type { Metadata } from "next";
import { getDictionary, isLocale, type Locale } from "@/lib/i18n";
import { pageAlternates } from "@/lib/seo";
import { CHANGELOG, CHANGELOG_TONE } from "@/lib/changelog";
import { Section, SectionHeading } from "@/components/marketing/section";
import { cn } from "@workspace/ui/lib/utils";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const { lang } = await params;
  const locale = isLocale(lang) ? lang : "en";
  const d = getDictionary(locale);
  return {
    title: d.pages2.changelog.title,
    description: d.pages2.changelog.description,
    ...pageAlternates(locale, "/changelog"),
  };
}

export default async function ChangelogPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  const locale: Locale = isLocale(lang) ? lang : "en";
  const dict = getDictionary(locale);

  return (
    <Section>
      <div className="mx-auto max-w-2xl">
        <SectionHeading
          title={dict.pages2.changelog.title}
          description={dict.pages2.changelog.description}
        />
        <div className="mt-10 space-y-8">
          {CHANGELOG.map((release) => (
            <article key={release.version} className="relative ps-6">
              <span className="absolute start-0 top-1.5 size-2.5 rounded-full bg-primary" />
              <div className="flex items-baseline gap-3">
                <h2 className="text-base font-semibold">v{release.version}</h2>
                <time className="text-xs text-muted-foreground">
                  {release.date}
                </time>
              </div>
              <ul className="mt-3 space-y-2">
                {release.items.map((item, i) => (
                  <li key={i} className="flex items-start gap-2.5 text-sm">
                    <span
                      className={cn(
                        "mt-0.5 rounded-full px-2 py-px text-[10px] font-medium",
                        CHANGELOG_TONE[item.type],
                      )}
                    >
                      {item.type}
                    </span>
                    <span className="text-muted-foreground">
                      {locale === "sw" ? item.sw : item.en}
                    </span>
                  </li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </div>
    </Section>
  );
}
