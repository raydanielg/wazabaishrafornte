import Link from "next/link";
import { Button } from "@workspace/ui/components/button";
import { localizedPath, type Dictionary, type Locale } from "@/lib/i18n";
import { Section } from "./section";

export function CtaSection({ locale, dict }: { locale: Locale; dict: Dictionary }) {
  return (
    <Section className="border-t border-border bg-muted/30">
      <div className="mx-auto max-w-2xl text-center">
        <h2 className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
          {dict.cta.title}
        </h2>
        <p className="mt-3 text-muted-foreground">{dict.cta.description}</p>
        <div className="mt-7 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Button
            size="lg"
            nativeButton={false}
            render={<Link href={localizedPath(locale, "/register")} />}
          >
            {dict.cta.primary}
          </Button>
          <Button
            size="lg"
            variant="outline"
            nativeButton={false}
            render={<Link href={localizedPath(locale, "/login")} />}
          >
            {dict.cta.secondary}
          </Button>
        </div>
      </div>
    </Section>
  );
}
