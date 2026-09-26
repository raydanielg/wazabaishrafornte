"use client";

 

import { usePathname } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  UserIcon,
  SecurityCheckIcon,
  SmartPhoneIcon,
  StoreIcon,
  NotificationIcon,
  CreditCardIcon,
  HelpCircleIcon,
  LogoutIcon,
} from "@hugeicons/core-free-icons";
import { AccountGate, useAccount } from "@/components/account/account-gate";
import { getDictionary, isLocale } from "@/lib/i18n";
import { cn } from "@workspace/ui/lib/utils";

export function AccountChrome({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const lang = pathname.split("/")[1] ?? "en";
  const locale: "en" | "sw" = isLocale(lang) ? lang : "en";
  return (
    <AccountGate locale={locale}>
      <AccountShell locale={locale}>{children}</AccountShell>
    </AccountGate>
  );
}

function AccountShell({
  locale,
  children,
}: {
  locale: "en" | "sw";
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const { signOut } = useAccount();
  const d = getDictionary(locale).accountNav;

  const items = [
    { href: "profile", label: d.profile, icon: UserIcon },
    { href: "security", label: d.security, icon: SecurityCheckIcon },
    { href: "sessions", label: d.sessions, icon: SmartPhoneIcon },
    { href: "businesses", label: d.businesses, icon: StoreIcon },
    { href: "notifications", label: d.notifications, icon: NotificationIcon },
    { href: "subscription", label: d.subscription, icon: CreditCardIcon },
    { href: "help", label: "Help", icon: HelpCircleIcon },
  ];

  return (
    <div className="min-h-svh bg-muted/40">
      <header className="sticky top-0 z-10 border-b border-border bg-background/95 backdrop-blur-sm">
        <div className="mx-auto flex h-14 max-w-5xl items-center justify-between px-4">
          <Link href={`/${locale}`} className="flex items-center gap-2 font-medium">
            <Image src="/brand/logo.png" alt="" width={24} height={24} className="size-6 rounded-md" />
            <span className="hidden sm:inline">{d.title}</span>
            <span className="text-xs text-muted-foreground sm:hidden">{d.backToSite}</span>
          </Link>
          <button
            onClick={signOut}
            className="flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            <HugeiconsIcon icon={LogoutIcon} className="size-4" strokeWidth={2} />
            {d.signOut}
          </button>
        </div>
      </header>
      <div className="mx-auto flex max-w-5xl gap-6 px-4 py-6">
        <nav className="hidden w-48 shrink-0 md:block">
          <ul className="space-y-0.5">
            {items.map((it) => {
              const href = `/${locale}/account/${it.href}`;
              const active = pathname === href;
              return (
                <li key={it.href}>
                  <Link
                    href={href}
                    className={cn(
                      "flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm transition-colors",
                      active
                        ? "bg-primary/10 font-medium text-foreground"
                        : "text-muted-foreground hover:bg-muted hover:text-foreground",
                    )}
                  >
                    <HugeiconsIcon icon={it.icon} className="size-4" strokeWidth={2} />
                    {it.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
        <div className="fixed inset-x-0 bottom-0 z-20 border-t border-border bg-background md:hidden">
          <div className="flex justify-around py-2">
            {items.map((it) => {
              const href = `/${locale}/account/${it.href}`;
              const active = pathname === href;
              return (
                <Link
                  key={it.href}
                  href={href}
                  aria-label={it.label}
                  className={cn(
                    "flex size-10 items-center justify-center rounded-lg",
                    active ? "bg-primary/10 text-foreground" : "text-muted-foreground",
                  )}
                >
                  <HugeiconsIcon icon={it.icon} className="size-5" strokeWidth={2} />
                </Link>
              );
            })}
          </div>
        </div>
        <main className="min-w-0 flex-1 pb-20 md:pb-0">{children}</main>
      </div>
    </div>
  );
}
