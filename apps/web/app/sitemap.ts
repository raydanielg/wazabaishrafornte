import type { MetadataRoute } from "next";
import { locales } from "@/lib/i18n";
import { HELP_TOPICS } from "@/lib/help-topics";
import { BUSINESS_TYPES } from "@/lib/data";

const base = process.env.NEXT_PUBLIC_SITE_URL ?? "https://wazabiashara.com";

const paths = [
  "",
  "/features",
  "/pricing",
  "/how-it-works",
  "/businesses",
  "/mobile-app",
  "/resources",
  "/help",
  "/faq",
  "/about",
  "/contact",
  "/security",
  "/privacy",
  "/terms",
  "/status",
  "/changelog",
  ...HELP_TOPICS.map((t) => `/help/${t.slug}`),
  ...BUSINESS_TYPES.filter((t) => t !== "other").map((t) => `/businesses/${t}`),
];

export default function sitemap(): MetadataRoute.Sitemap {
  return paths.flatMap((p) =>
    locales.map((l) => ({
      url: `${base}/${l}${p}`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: p === "" ? 1 : 0.7,
    })),
  );
}
