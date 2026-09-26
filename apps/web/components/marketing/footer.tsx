import Link from "next/link";
import { localizedPath, type Dictionary, type Locale } from "@/lib/i18n";
import { FOOTER_LINKS } from "@/lib/data";
import { Logo } from "./logo";

export function Footer({ locale, dict }: { locale: Locale; dict: Dictionary }) {
  const year = new Date().getFullYear();
  const cols = [
    { title: dict.footer.product, links: FOOTER_LINKS.product },
    { title: dict.footer.resourcesCol, links: FOOTER_LINKS.resources },
    { title: dict.footer.company, links: FOOTER_LINKS.company },
    { title: dict.footer.legal, links: FOOTER_LINKS.legal },
  ] as const;

  return (
    <footer className="border-t border-border bg-muted/30">
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
        <div className="grid gap-10 md:grid-cols-[1.4fr_repeat(4,1fr)]">
          <div className="max-w-xs">
            <Logo locale={locale} />
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
              {dict.footer.tagline}
            </p>
          </div>
          {cols.map((col) => (
            <nav key={col.title} aria-label={col.title}>
              <h3 className="text-sm font-medium text-foreground">{col.title}</h3>
              <ul className="mt-3 space-y-2.5">
                {col.links.map((l) => (
                  <li key={l.key}>
                    <Link
                      href={localizedPath(locale, l.href)}
                      className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                    >
                      {
                        dict.footer.links[
                          l.key as keyof Dictionary["footer"]["links"]
                        ]
                      }
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>
        <div className="mt-10 border-t border-border pt-6">
          <p className="text-xs text-muted-foreground">
            {dict.footer.copyright.replace("{year}", String(year))}
          </p>
        </div>
      </div>
    </footer>
  );
}
