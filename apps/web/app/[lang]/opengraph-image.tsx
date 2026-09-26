import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { getDictionary, isLocale } from "@/lib/i18n";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

/** Branded OG image generated per locale (§21). */
export default async function OgImage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  const dict = getDictionary(isLocale(lang) ? lang : "en");
  const logo = await readFile(join(process.cwd(), "public/brand/icon.png"));

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: 80,
          background: "#0a0a0a",
          color: "#fafafa",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 24 }}>
          { }
          <img
            src={`data:image/png;base64,${logo.toString("base64")}`}
            width={96}
            height={96}
            style={{ borderRadius: 24 }}
            alt=""
          />
          <span style={{ fontSize: 44, fontWeight: 700 }}>Wazabiashara</span>
        </div>
        <p
          style={{
            fontSize: 56,
            fontWeight: 700,
            lineHeight: 1.15,
            marginTop: 48,
            maxWidth: 900,
          }}
        >
          {dict.hero.title}
        </p>
        <p
          style={{
            fontSize: 28,
            color: "#a1a1aa",
            marginTop: 24,
            maxWidth: 880,
          }}
        >
          {dict.meta.description}
        </p>
      </div>
    ),
    size,
  );
}
