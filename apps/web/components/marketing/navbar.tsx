"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { HugeiconsIcon } from "@hugeicons/react";
import { Menu02Icon, ArrowRight01Icon } from "@hugeicons/core-free-icons";
import { Button } from "@workspace/ui/components/button";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetTitle,
} from "@workspace/ui/components/sheet";
import { cn } from "@workspace/ui/lib/utils";
import { localizedPath, type Dictionary, type Locale } from "@/lib/i18n";
import { NAV_LINKS } from "@/lib/data";
import { Logo } from "./logo";
import { LanguageSwitcher } from "./language-switcher";

export function Navbar({ locale, dict }: { locale: Locale; dict: Dictionary }) {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const linkLabel = (key: (typeof NAV_LINKS)[number]["key"]) =>
    dict.nav[key as keyof Dictionary["nav"]] ?? key;

  return (
    <header
      className={cn(
        "sticky top-0 z-50 w-full border-b border-transparent bg-background/95 backdrop-blur-sm transition-colors",
        scrolled && "border-border",
      )}
    >
      <nav
        className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4 sm:px-6"
        aria-label="Main navigation"
      >
        <Logo locale={locale} />

        <div className="hidden items-center gap-1 md:flex">
          {NAV_LINKS.map((l) => {
            const href = localizedPath(locale, l.href);
            const active = pathname === href;
            return (
              <Link
                key={l.key}
                href={href}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "rounded-md px-3 py-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground",
                  active && "text-foreground font-medium",
                )}
              >
                {linkLabel(l.key)}
              </Link>
            );
          })}
        </div>

        <div className="hidden items-center gap-2 md:flex">
          <LanguageSwitcher locale={locale} dict={dict} />
          <Button
            variant="ghost"
            size="sm"
            nativeButton={false}
            render={<Link href={localizedPath(locale, "/login")} />}
          >
            {dict.nav.login}
          </Button>
          <Button
            variant="outline"
            size="sm"
            nativeButton={false}
            render={<a href="tel:+255716212896" />}
          >
            {dict.nav.talkToSales}
            <HugeiconsIcon icon={ArrowRight01Icon} strokeWidth={2} className="size-4" />
          </Button>
          <Button
            size="sm"
            nativeButton={false}
            render={<Link href={localizedPath(locale, "/register")} />}
          >
            {dict.nav.getStarted}
          </Button>
        </div>

        <div className="flex items-center gap-1 md:hidden">
          <LanguageSwitcher locale={locale} dict={dict} compact />
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger
              render={
                <Button
                  variant="ghost"
                  size="icon"
                  aria-label={dict.nav.openMenu}
                />
              }
            >
              <HugeiconsIcon icon={Menu02Icon} strokeWidth={2} />
            </SheetTrigger>
            <SheetContent side="right" className="w-72 p-0">
              <SheetTitle className="sr-only">{dict.nav.menu}</SheetTitle>
              <div className="flex flex-col gap-1 p-4">
                {NAV_LINKS.map((l) => (
                  <Link
                    key={l.key}
                    href={localizedPath(locale, l.href)}
                    onClick={() => setOpen(false)}
                    className="rounded-md px-3 py-2.5 text-sm font-medium text-foreground hover:bg-muted"
                  >
                    {linkLabel(l.key)}
                  </Link>
                ))}
                <div className="my-3 border-t border-border" />
                <Button
                  variant="outline"
                  className="justify-start"
                  nativeButton={false}
                  render={
                    <Link
                      href={localizedPath(locale, "/login")}
                      onClick={() => setOpen(false)}
                    />
                  }
                >
                  {dict.nav.login}
                </Button>
                <Button
                  className="mt-2 justify-start"
                  nativeButton={false}
                  render={
                    <Link
                      href={localizedPath(locale, "/register")}
                      onClick={() => setOpen(false)}
                    />
                  }
                >
                  {dict.nav.getStarted}
                </Button>
                <a
                  href="tel:+255716212896"
                  className="mt-2 flex items-center justify-between rounded-md px-3 py-2.5 text-sm font-medium text-muted-foreground hover:bg-muted"
                >
                  <span>{dict.nav.talkToSales}</span>
                  <span className="flex items-center gap-1 text-foreground">
                    +255 716 212 896
                    <HugeiconsIcon icon={ArrowRight01Icon} strokeWidth={2} className="size-4" />
                  </span>
                </a>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </nav>
    </header>
  );
}
