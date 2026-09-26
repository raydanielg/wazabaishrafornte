import type { Metadata } from "next";
import Link from "next/link";
import { noIndex } from "@/lib/seo";
import { getDictionary, isLocale, localizedPath, type Locale } from "@/lib/i18n";
import { Section } from "@/components/marketing/section";
import { AuthForm } from "@/components/marketing/auth-form";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const { lang } = await params;
  const d = getDictionary(isLocale(lang) ? lang : "en");
  return { title: d.nav.login , robots: noIndex };
}

export default async function LoginPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  const locale: Locale = isLocale(lang) ? lang : "en";
  const dict = getDictionary(locale);

  return (
    <Section>
      <div className="mx-auto w-full max-w-sm rounded-xl border border-border bg-card p-6">
        <h1 className="text-xl font-semibold tracking-tight text-foreground">
          {dict.nav.login}
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          {dict.hero.trust}
        </p>
        <div className="mt-6">
          <AuthForm mode="login" dict={dict} locale={locale} />
        </div>
        <p className="mt-5 text-center text-sm text-muted-foreground">
          {locale === "sw" ? "Huna akaunti?" : "No account?"}{" "}
          <Link
            href={localizedPath(locale, "/register")}
            className="font-medium text-foreground underline-offset-4 hover:underline"
          >
            {dict.nav.getStarted}
          </Link>
        </p>
      </div>
    </Section>
  );
}
