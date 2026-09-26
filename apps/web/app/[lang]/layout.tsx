import type { Metadata, Viewport } from "next";
import { Geist_Mono, Inter } from "next/font/google";

import "@workspace/ui/globals.css";
import { Toaster } from "@workspace/ui/components/toast";
import { ThemeProvider } from "@/components/theme-provider";
import { PwaRegister } from "@/components/pwa-register";
import {
  getDictionary,
  isLocale,
  locales,
  type Locale,
} from "@/lib/i18n";
import { SITE, verification } from "@/lib/seo";
import { cn } from "@workspace/ui/lib/utils";
import { notFound } from "next/navigation";

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });
const fontMono = Geist_Mono({ subsets: ["latin"], variable: "--font-mono" });

export function generateStaticParams() {
  return locales.map((lang) => ({ lang }));
}

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#0a0a0a" },
  ],
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const { lang } = await params;
  const locale: Locale = isLocale(lang) ? lang : "en";
  const dict = getDictionary(locale);
  return {
    metadataBase: new URL(SITE.url),
    title: { default: dict.meta.title, template: `%s — ${SITE.name}` },
    description: dict.meta.description,
    applicationName: SITE.name,
    alternates: {
      canonical: `/${locale}`,
      languages: { en: "/en", sw: "/sw" },
    },
    openGraph: {
      type: "website",
      siteName: SITE.name,
      title: dict.meta.title,
      description: dict.meta.description,
      locale: locale === "sw" ? "sw_TZ" : "en_US",
    },
    twitter: {
      card: "summary_large_image",
      title: dict.meta.title,
      description: dict.meta.description,
    },
    verification,
    robots: { index: true, follow: true },
  };
}

export default async function LangLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();

  return (
    <html
      lang={lang}
      suppressHydrationWarning
      className={cn("antialiased font-sans", fontMono.variable, inter.variable)}
    >
      <body className="flex min-h-svh flex-col bg-background">
        <ThemeProvider>
          <Toaster>
            <PwaRegister />
            {children}
          </Toaster>
        </ThemeProvider>
      </body>
    </html>
  );
}
