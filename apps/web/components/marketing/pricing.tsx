import Link from "next/link";
import { HugeiconsIcon } from "@hugeicons/react";
import { CheckIcon } from "@hugeicons/core-free-icons";
import { Button } from "@workspace/ui/components/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/card";
import { Badge } from "@workspace/ui/components/badge";
import { cn } from "@workspace/ui/lib/utils";
import { getPackages, type PublicPackage } from "@/lib/api";
import { localizedPath, type Dictionary, type Locale } from "@/lib/i18n";

const fmt = (n: number) => n.toLocaleString("en-US");

function limitLabel(key: string, dict: Dictionary): string {
  return (
    dict.pricing.limits[key as keyof Dictionary["pricing"]["limits"]] ?? key
  );
}

/**
 * Pricing cards — packages fetched from the backend (§22).
 * Server component: fails gracefully to the empty state.
 */
export async function PricingCards({
  locale,
  dict,
}: {
  locale: Locale;
  dict: Dictionary;
}) {
  const packages = await getPackages();
  if (!packages || packages.length === 0) {
    return (
      <p className="mx-auto max-w-md text-center text-sm text-muted-foreground">
        {packages === null ? dict.pricing.error : dict.pricing.empty}
      </p>
    );
  }

  const sorted = [...packages].sort((a, b) => Number(a.price) - Number(b.price));
  const popular = sorted.find((p) => p.slug === "starter") ?? sorted[1];

  return (
    <div
      className={cn(
        "mx-auto grid max-w-5xl gap-4 sm:grid-cols-2",
        sorted.length >= 3 && "lg:grid-cols-4",
        sorted.length === 2 && "lg:grid-cols-2",
        sorted.length === 1 && "lg:grid-cols-1",
      )}
    >
      {sorted.map((pkg) => (
        <PricingCard
          key={pkg.id}
          pkg={pkg}
          locale={locale}
          dict={dict}
          popular={pkg.id === popular?.id && sorted.length > 1}
        />
      ))}
    </div>
  );
}

function PricingCard({
  pkg,
  locale,
  dict,
  popular,
}: {
  pkg: PublicPackage;
  locale: Locale;
  dict: Dictionary;
  popular?: boolean;
}) {
  const price = Number(pkg.price);
  const limitEntries = Object.entries(pkg.limits ?? {});
  return (
    <Card
      className={cn(
        "relative flex flex-col",
        popular && "border-primary shadow-sm ring-1 ring-primary/40",
      )}
    >
      {popular && (
        <Badge className="absolute -top-2.5 left-1/2 -translate-x-1/2">
          {dict.pricing.popular}
        </Badge>
      )}
      <CardHeader className="pb-3">
        <CardTitle className="text-base">{pkg.name}</CardTitle>
        <CardDescription className="line-clamp-2 min-h-8 text-xs">
          {pkg.description}
        </CardDescription>
        <div className="pt-2">
          {price === 0 ? (
            <span className="text-2xl font-bold tracking-tight">
              {dict.pricing.free}
            </span>
          ) : (
            <>
              <span className="text-2xl font-bold tracking-tight tabular-nums">
                {pkg.currency} {fmt(price)}
              </span>
              <span className="text-sm text-muted-foreground">
                {dict.pricing.perMonth}
              </span>
            </>
          )}
          {pkg.trialDays > 0 && (
            <p className="mt-1 text-xs text-muted-foreground">
              {dict.pricing.trial.replace("{days}", String(pkg.trialDays))}
            </p>
          )}
        </div>
      </CardHeader>
      <CardContent className="flex flex-1 flex-col">
        <ul className="flex-1 space-y-2">
          {limitEntries.map(([key, value]) => (
            <li key={key} className="flex items-start gap-2 text-xs">
              <HugeiconsIcon
                icon={CheckIcon}
                className="mt-0.5 size-3.5 shrink-0 text-emerald-600"
                strokeWidth={2.5}
              />
              <span className="text-muted-foreground">
                {value === null ? dict.pricing.unlimited : fmt(value)}{" "}
                {limitLabel(key, dict)}
              </span>
            </li>
          ))}
        </ul>
        <Button
          className="mt-5 w-full"
          variant={popular ? "default" : "outline"}
          size="sm"
          nativeButton={false}
          render={<Link href={localizedPath(locale, "/register")} />}
        >
          {dict.pricing.cta}
        </Button>
      </CardContent>
    </Card>
  );
}
