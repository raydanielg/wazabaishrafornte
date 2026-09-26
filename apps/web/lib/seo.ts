import type { Metadata } from "next";
import { locales, type Locale } from "./i18n";

/**
 * Central SEO configuration (§3). One source of truth — pages use these
 * helpers instead of duplicating metadata logic.
 */
export const SITE = {
  name: "Wazabiashara",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://wazabiashara.com",
  defaultImage: "/brand/icon.png",
  ogImage: "/opengraph-image",
  locales,
  defaultLocale: "en" as Locale,
};

export const noIndex: Metadata["robots"] = { index: false, follow: false };

/** Search Console verification — configured via env, never hard-coded. */
export const verification: Metadata["verification"] = {
  ...(process.env.GOOGLE_SITE_VERIFICATION
    ? { google: process.env.GOOGLE_SITE_VERIFICATION }
    : {}),
  ...(process.env.BING_SITE_VERIFICATION
    ? { other: { "msvalidate.01": process.env.BING_SITE_VERIFICATION } }
    : {}),
};

/** Per-page canonical + hreflang alternates (production domain, clean URLs). */
export function pageAlternates(locale: Locale, path: string) {
  const p = path === "/" ? "" : path;
  return {
    alternates: {
      canonical: `${SITE.url}/${locale}${p}`,
      languages: Object.fromEntries(locales.map((l) => [l, `${SITE.url}/${l}${p}`])),
    },
  };
}

/** OG/Twitter metadata block for public pages. */
export function pageSocial(locale: Locale, title: string, description: string) {
  return {
    openGraph: {
      title,
      description,
      siteName: SITE.name,
      type: "website" as const,
      locale: locale === "sw" ? "sw_TZ" : "en_US",
      images: [{ url: `${SITE.url}/${locale}/opengraph-image`, width: 1200, height: 630 }],
    },
    twitter: {
      card: "summary_large_image" as const,
      title,
      description,
      images: [`${SITE.url}/${locale}/opengraph-image`],
    },
  };
}

/** JSON-LD structured data. No fake ratings/reviews (§25–28). */
export function organizationJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: SITE.name,
    url: SITE.url,
    logo: `${SITE.url}/brand/icon.png`,
  };
}

export function webSiteJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: SITE.name,
    url: SITE.url,
    inLanguage: ["en", "sw"],
  };
}

export function softwareAppJsonLd(dict: { meta: { title: string; description: string } }) {
  return {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: SITE.name,
    description: dict.meta.description,
    applicationCategory: "BusinessApplication",
    operatingSystem: "Web, Android",
    offers: { "@type": "Offer", price: "0", priceCurrency: "TZS" },
  };
}

export function faqJsonLd(items: { q: string; a: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((i) => ({
      "@type": "Question",
      name: i.q,
      acceptedAnswer: { "@type": "Answer", text: i.a },
    })),
  };
}

/** BreadcrumbList schema — must match visible breadcrumbs (§29). */
export function breadcrumbJsonLd(locale: Locale, items: { name: string; path: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((it, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: it.name,
      item: `${SITE.url}/${locale}${it.path === "/" ? "" : it.path}`,
    })),
  };
}
