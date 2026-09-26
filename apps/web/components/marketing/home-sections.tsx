import Link from "next/link";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  ShoppingCartIcon,
  PackageIcon,
  UserMultipleIcon,
  MoneyIcon,
  InvoiceIcon,
  BarChartIcon,
  UserGroupIcon,
  StoreIcon,
  LockIcon,
  SecurityCheckIcon,
  SmartPhoneIcon,
  ArrowRight01Icon,
  CheckIcon,
  Cancel01Icon,
  BuildingIcon,
} from "@hugeicons/core-free-icons";
import { Button } from "@workspace/ui/components/button";
import { cn } from "@workspace/ui/lib/utils";
import { localizedPath, type Dictionary, type Locale } from "@/lib/i18n";
import { BUSINESS_TYPES, BUSINESS_TYPE_LABELS } from "@/lib/data";
import { Section, SectionHeading } from "./section";
import { DashboardMockup, PhoneMockup } from "./mockups";

const fmt = (n: number) => `TZS ${n.toLocaleString("en-US")}`;

/* ---------- HERO (§8–9) ---------- */
export function Hero({ locale, dict }: { locale: Locale; dict: Dictionary }) {
  return (
    <section className="border-b border-border">
      <div className="mx-auto grid max-w-6xl items-center gap-10 px-4 py-16 sm:px-6 sm:py-24 lg:grid-cols-2">
        <div className="max-w-xl">
          <p className="text-xs font-semibold tracking-widest text-muted-foreground uppercase">
            {dict.hero.eyebrow}
          </p>
          <h1 className="mt-3 text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
            {dict.hero.title}
          </h1>
          <p className="mt-4 text-lg leading-relaxed text-muted-foreground">
            {dict.hero.description}
          </p>
          <div className="mt-7 flex flex-col gap-3 sm:flex-row">
            <Button
              size="lg"
              nativeButton={false}
              render={<Link href={localizedPath(locale, "/register")} />}
            >
              {dict.hero.primaryCta}
            </Button>
            <Button
              size="lg"
              variant="outline"
              nativeButton={false}
              render={<Link href={localizedPath(locale, "/how-it-works")} />}
            >
              {dict.hero.secondaryCta}
            </Button>
          </div>
          <p className="mt-5 text-sm text-muted-foreground">{dict.hero.trust}</p>
        </div>
        <div className="relative">
          <DashboardMockup dict={dict} />
          <PhoneMockup
            dict={dict}
            className="absolute -right-2 -bottom-8 hidden sm:block lg:-right-6"
          />
        </div>
      </div>
    </section>
  );
}

/* ---------- TRUST STRIP (§10) ---------- */
export function TrustStrip({ dict }: { dict: Dictionary }) {
  return (
    <Section className="py-10 sm:py-12">
      <p className="text-center text-sm text-muted-foreground">
        {dict.trustStrip.title}
      </p>
      <ul className="mt-6 flex flex-wrap items-center justify-center gap-x-6 gap-y-2">
        {BUSINESS_TYPES.map((t) => (
          <li
            key={t}
            className="text-sm font-medium text-foreground/70"
          >
            {BUSINESS_TYPE_LABELS[t]?.en ?? t}
          </li>
        ))}
      </ul>
    </Section>
  );
}

/* ---------- PROBLEM (§11) ---------- */
export function ProblemSection({ dict }: { dict: Dictionary }) {
  return (
    <Section className="bg-muted/30">
      <SectionHeading
        eyebrow={dict.problem.eyebrow}
        title={dict.problem.title}
        description={dict.problem.description}
      />
      <div className="mt-10 grid gap-x-10 gap-y-6 sm:grid-cols-2 lg:grid-cols-3">
        {dict.problem.items.map((item) => (
          <div key={item.title}>
            <h3 className="text-sm font-semibold text-foreground">
              {item.title}
            </h3>
            <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
              {item.description}
            </p>
          </div>
        ))}
      </div>
    </Section>
  );
}

/* ---------- SOLUTION GRID (§12) ---------- */
const SOLUTION_ICONS = {
  sales: ShoppingCartIcon,
  products: PackageIcon,
  customers: UserMultipleIcon,
  expenses: MoneyIcon,
  debts: InvoiceIcon,
  reports: BarChartIcon,
  staff: UserGroupIcon,
  multi: StoreIcon,
} as const;

export function SolutionSection({ dict }: { dict: Dictionary }) {
  return (
    <Section>
      <SectionHeading
        eyebrow={dict.solution.eyebrow}
        title={dict.solution.title}
        description={dict.solution.description}
      />
      <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {dict.solution.features.map((f) => {
          const Icon =
            SOLUTION_ICONS[f.key as keyof typeof SOLUTION_ICONS] ?? PackageIcon;
          return (
            <div
              key={f.key}
              className="rounded-xl border border-border bg-card p-5 transition-colors hover:bg-muted/40"
            >
              <div className="flex size-9 items-center justify-center rounded-lg bg-primary/15">
                <HugeiconsIcon
                  icon={Icon}
                  className="size-4.5 text-foreground"
                  strokeWidth={2}
                />
              </div>
              <h3 className="mt-3 text-sm font-semibold text-foreground">
                {f.title}
              </h3>
              <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                {f.description}
              </p>
            </div>
          );
        })}
      </div>
    </Section>
  );
}

/* ---------- MULTI-BUSINESS (§14) ---------- */
export function MultiBusinessSection({ dict }: { dict: Dictionary }) {
  const businesses = ["Mwanza Mini Mart", "Mama Ntilie", "Ezra Hardware"];
  return (
    <Section className="bg-muted/30">
      <div className="grid items-center gap-10 lg:grid-cols-2">
        <div>
          <SectionHeading
            align="left"
            eyebrow={dict.multi.eyebrow}
            title={dict.multi.title}
            description={dict.multi.description}
          />
          <ul className="mt-6 space-y-2.5">
            {dict.multi.points.map((p) => (
              <li key={p} className="flex items-start gap-2.5 text-sm">
                <HugeiconsIcon
                  icon={CheckIcon}
                  className="mt-0.5 size-4 shrink-0 text-emerald-600"
                  strokeWidth={2.5}
                />
                <span className="text-foreground/90">{p}</span>
              </li>
            ))}
          </ul>
        </div>
        <div className="mx-auto w-full max-w-sm rounded-xl border border-border bg-card p-4 shadow-sm" aria-hidden="true">
          <p className="px-2 pb-2 text-[11px] font-medium tracking-wide text-muted-foreground uppercase">
            {dict.multi.switcherTitle}
          </p>
          {businesses.map((b, i) => (
            <div
              key={b}
              className={cn(
                "flex items-center gap-3 rounded-lg px-2.5 py-2.5",
                i === 0 && "bg-primary/15",
              )}
            >
              <div className="flex size-8 items-center justify-center rounded-md bg-muted text-xs font-semibold">
                {b.split(" ").map((w) => w[0]).slice(0, 2).join("")}
              </div>
              <div className="min-w-0">
                <p className="truncate text-sm font-medium">{b}</p>
                <p className="text-[11px] text-muted-foreground">
                  {i === 0 ? "Rejareja" : i === 1 ? "Mgahawa" : "Vifaa"}
                </p>
              </div>
              {i === 0 && (
                <HugeiconsIcon
                  icon={CheckIcon}
                  className="ml-auto size-4 text-foreground"
                  strokeWidth={2.5}
                />
              )}
            </div>
          ))}
        </div>
      </div>
    </Section>
  );
}

/* ---------- BUSINESS TYPES (§15) ---------- */
export function BusinessTypesSection({
  dict,
  locale,
}: {
  dict: Dictionary;
  locale: Locale;
}) {
  return (
    <Section>
      <SectionHeading
        eyebrow={dict.businessTypes.eyebrow}
        title={dict.businessTypes.title}
        description={dict.businessTypes.description}
      />
      <div className="mt-10 grid grid-cols-2 gap-3 sm:grid-cols-4">
        {BUSINESS_TYPES.map((t) => (
          <Link
            key={t}
            href={localizedPath(locale, `/businesses/${t}`)}
            className="flex items-center gap-3 rounded-xl border border-border bg-card px-4 py-4 transition-colors hover:bg-muted/50"
          >
            <HugeiconsIcon
              icon={BuildingIcon}
              className="size-5 shrink-0 text-muted-foreground"
              strokeWidth={2}
            />
            <span className="text-sm font-medium text-foreground">
              {BUSINESS_TYPE_LABELS[t]?.[locale] ?? t}
            </span>
          </Link>
        ))}
      </div>
    </Section>
  );
}

/* ---------- HOW IT WORKS (§16) ---------- */
export function StepsSection({ dict }: { dict: Dictionary }) {
  return (
    <Section>
      <SectionHeading
        eyebrow={dict.steps.eyebrow}
        title={dict.steps.title}
      />
      <ol className="mx-auto mt-10 grid max-w-4xl gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {dict.steps.items.map((s, i) => (
          <li key={s.title} className="relative">
            <span className="text-3xl font-bold text-primary/70 tabular-nums">
              {String(i + 1).padStart(2, "0")}
            </span>
            <h3 className="mt-2 text-sm font-semibold text-foreground">
              {s.title}
            </h3>
            <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
              {s.description}
            </p>
          </li>
        ))}
      </ol>
    </Section>
  );
}

/* ---------- MOBILE APP (§18) ---------- */
export function MobileAppSection({
  locale,
  dict,
}: {
  locale: Locale;
  dict: Dictionary;
}) {
  return (
    <Section className="bg-muted/30">
      <div className="grid items-center gap-10 lg:grid-cols-2">
        <div>
          <SectionHeading
            align="left"
            eyebrow={dict.mobile.eyebrow}
            title={dict.mobile.title}
            description={dict.mobile.description}
          />
          <ul className="mt-6 space-y-2.5">
            {dict.mobile.points.map((p) => (
              <li key={p} className="flex items-start gap-2.5 text-sm">
                <HugeiconsIcon
                  icon={CheckIcon}
                  className="mt-0.5 size-4 shrink-0 text-emerald-600"
                  strokeWidth={2.5}
                />
                <span className="text-foreground/90">{p}</span>
              </li>
            ))}
          </ul>
          <div className="mt-7">
            <Button
              nativeButton={false}
              render={<Link href={localizedPath(locale, "/mobile-app")} />}
            >
              <HugeiconsIcon icon={SmartPhoneIcon} strokeWidth={2} />
              {dict.mobile.cta}
            </Button>
            <p className="mt-2.5 text-xs text-muted-foreground">
              {dict.mobile.ctaNote}
            </p>
          </div>
        </div>
        <div className="flex items-end justify-center gap-4">
          <PhoneMockup dict={dict} className="w-40 rotate-[-4deg]" />
          <PhoneMockup dict={dict} className="w-44 rotate-[3deg]" />
        </div>
      </div>
    </Section>
  );
}

/* ---------- STAFF & PERMISSIONS (§19) ---------- */
export function StaffSection({ dict }: { dict: Dictionary }) {
  return (
    <Section>
      <div className="grid items-center gap-10 lg:grid-cols-2">
        <div className="order-2 lg:order-1">
          <div className="mx-auto w-full max-w-sm rounded-xl border border-border bg-card p-4 shadow-sm" aria-hidden="true">
            <div className="flex items-center gap-3 border-b border-border pb-3">
              <div className="flex size-8 items-center justify-center rounded-md bg-muted">
                <HugeiconsIcon
                  icon={UserGroupIcon}
                  className="size-4 text-muted-foreground"
                  strokeWidth={2}
                />
              </div>
              <div>
                <p className="text-sm font-medium">{dict.staff.roles.cashier}</p>
                <p className="text-[11px] text-muted-foreground">cashier</p>
              </div>
            </div>
            {[
              { label: dict.solution.features[0]?.title ?? "", can: true },
              { label: dict.solution.features[2]?.title ?? "", can: true },
              { label: dict.solution.features[5]?.title ?? "", can: false },
              { label: dict.solution.features[6]?.title ?? "", can: false },
            ].map((r) => (
              <div
                key={r.label}
                className="flex items-center justify-between border-b border-border/60 py-2.5 text-sm last:border-0"
              >
                <span className="text-muted-foreground">{r.label}</span>
                <span className="flex items-center gap-1.5 text-xs font-medium">
                  <HugeiconsIcon
                    icon={r.can ? CheckIcon : Cancel01Icon}
                    className={cn(
                      "size-3.5",
                      r.can ? "text-emerald-600" : "text-muted-foreground/50",
                    )}
                    strokeWidth={2.5}
                  />
                  {r.can ? dict.staff.example.can : dict.staff.example.cannot}
                </span>
              </div>
            ))}
          </div>
        </div>
        <div className="order-1 lg:order-2">
          <SectionHeading
            align="left"
            eyebrow={dict.staff.eyebrow}
            title={dict.staff.title}
            description={dict.staff.description}
          />
          <div className="mt-5 flex flex-wrap gap-2">
            {Object.values(dict.staff.roles).map((r) => (
              <span
                key={r}
                className="rounded-full border border-border bg-card px-3 py-1 text-xs font-medium text-muted-foreground"
              >
                {r}
              </span>
            ))}
          </div>
        </div>
      </div>
    </Section>
  );
}

/* ---------- REPORTS (§20) ---------- */
export function ReportsSection({ dict }: { dict: Dictionary }) {
  return (
    <Section className="bg-muted/30">
      <div className="grid items-center gap-10 lg:grid-cols-2">
        <div>
          <SectionHeading
            align="left"
            eyebrow={dict.reports.eyebrow}
            title={dict.reports.title}
            description={dict.reports.description}
          />
          <ul className="mt-6 flex flex-wrap gap-2">
            {dict.reports.items.map((r) => (
              <li
                key={r}
                className="rounded-full border border-border bg-card px-3 py-1 text-xs font-medium text-muted-foreground"
              >
                {r}
              </li>
            ))}
          </ul>
        </div>
        <div className="rounded-xl border border-border bg-card p-5 shadow-sm" aria-hidden="true">
          <p className="text-xs font-medium text-muted-foreground">
            {dict.misc.thisWeek}
          </p>
          <div className="mt-3 flex items-end justify-between gap-2">
            {[35, 55, 30, 75, 50, 90, 60].map((h, i) => (
              <div key={i} className="flex-1">
                <div
                  className="rounded-t-sm bg-primary/60"
                  style={{ height: `${h * 1.6}px` }}
                />
              </div>
            ))}
          </div>
          <div className="mt-4 flex items-center justify-between border-t border-border pt-3">
            <span className="text-xs text-muted-foreground">
              {dict.hero.mock.today}
            </span>
            <span className="text-sm font-semibold tabular-nums">
              {fmt(845000)}
            </span>
          </div>
        </div>
      </div>
    </Section>
  );
}

/* ---------- SECURITY (§21) ---------- */
export function SecuritySection({
  locale,
  dict,
}: {
  locale: Locale;
  dict: Dictionary;
}) {
  const icons = [LockIcon, UserGroupIcon, SecurityCheckIcon, ShieldIconAlias];
  return (
    <Section>
      <SectionHeading
        eyebrow={dict.securitySection.eyebrow}
        title={dict.securitySection.title}
        description={dict.securitySection.description}
      />
      <div className="mx-auto mt-10 grid max-w-4xl gap-6 sm:grid-cols-2">
        {dict.securitySection.items.map((item, i) => {
          const Icon = icons[i % icons.length] ?? LockIcon;
          return (
            <div key={item.title} className="flex gap-3.5">
              <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-primary/15">
                <HugeiconsIcon
                  icon={Icon}
                  className="size-4.5 text-foreground"
                  strokeWidth={2}
                />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-foreground">
                  {item.title}
                </h3>
                <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                  {item.description}
                </p>
              </div>
            </div>
          );
        })}
      </div>
      <div className="mt-8 text-center">
        <Button
          variant="outline"
          size="sm"
          nativeButton={false}
          render={<Link href={localizedPath(locale, "/security")} />}
        >
          {dict.securitySection.cta}
          <HugeiconsIcon icon={ArrowRight01Icon} strokeWidth={2} />
        </Button>
      </div>
    </Section>
  );
}

const ShieldIconAlias = SecurityCheckIcon;
