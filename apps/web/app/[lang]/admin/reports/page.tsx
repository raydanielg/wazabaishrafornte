"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  ChartBarLineIcon,
  MoneyIcon,
  StoreIcon,
  UserMultipleIcon,
  CreditCardIcon,
  WalletIcon,
  ArrowRight01Icon,
} from "@hugeicons/core-free-icons";
import { PageHeader } from "@/components/admin/ui";

const REPORTS = [
  { key: "revenue", title: "Revenue", desc: "Payments collected over time.", icon: MoneyIcon },
  { key: "sales", title: "Sales activity", desc: "Transaction volume per day.", icon: ChartBarLineIcon },
  { key: "businesses", title: "Businesses", desc: "Growth and status breakdown.", icon: StoreIcon },
  { key: "users", title: "Users", desc: "New sign-ups over time.", icon: UserMultipleIcon },
  { key: "subscriptions", title: "Subscriptions", desc: "Plans and statuses.", icon: CreditCardIcon },
  { key: "financial", title: "Financial", desc: "Revenue, expenses, outstanding debt.", icon: WalletIcon },
];

export default function ReportsPage() {
  const locale = usePathname().split("/")[1] ?? "en";
  return (
    <div className="space-y-6">
      <PageHeader
        title="Reports"
        description="Platform reports — all numbers are computed live from the database."
      />
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {REPORTS.map((r) => (
          <Link
            key={r.key}
            href={`/${locale}/admin/reports/${r.key}`}
            className="group rounded-xl border border-border bg-card p-5 transition-colors hover:bg-muted/40"
          >
            <div className="flex items-start justify-between">
              <HugeiconsIcon
                icon={r.icon}
                className="size-5 text-muted-foreground"
                strokeWidth={2}
              />
              <HugeiconsIcon
                icon={ArrowRight01Icon}
                className="size-4 text-muted-foreground/40 transition-transform group-hover:translate-x-0.5"
                strokeWidth={2}
              />
            </div>
            <p className="mt-3 font-medium">{r.title}</p>
            <p className="mt-1 text-xs text-muted-foreground">{r.desc}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
