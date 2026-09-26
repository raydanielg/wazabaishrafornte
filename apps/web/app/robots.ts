import type { MetadataRoute } from "next";
import { SITE } from "@/lib/seo";
import { locales } from "@/lib/i18n";

export default function robots(): MetadataRoute.Robots {
  // Private areas are excluded per locale (§16, §44, §54–55).
  // robots.txt is not an authorization mechanism — auth still enforced server-side.
  const disallow = locales.flatMap((l) => [
    `/${l}/admin`,
    `/${l}/account`,
    `/${l}/auth`,
    `/${l}/login`,
    `/${l}/register`,
  ]);
  return {
    rules: [{ userAgent: "*", allow: "/", disallow }],
    sitemap: `${SITE.url}/sitemap.xml`,
  };
}
