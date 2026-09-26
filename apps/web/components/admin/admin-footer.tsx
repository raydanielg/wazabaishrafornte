"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@workspace/ui/lib/utils";
import { useAdmin } from "./admin-gate";
import pkg from "../../package.json";

/** Real admin footer — version, live API health, role, locale. */
export function AdminFooter() {
  const { me } = useAdmin();
  const pathname = usePathname();
  const locale = pathname.split("/")[1] ?? "en";
  const [api, setApi] = useState<"ok" | "down" | "checking">("checking");

  useEffect(() => {
    let live = true;
    const probe = () =>
      fetch("/api/app/health", { cache: "no-store" })
        .then((r) => live && setApi(r.ok ? "ok" : "down"))
        .catch(() => live && setApi("down"));
    probe();
    const t = setInterval(probe, 60000);
    return () => {
      live = false;
      clearInterval(t);
    };
  }, []);

  return (
    <footer className="mt-auto flex flex-wrap items-center justify-between gap-x-4 gap-y-1 border-t border-border px-4 py-2.5 text-[11px] text-muted-foreground sm:px-6">
      <div className="flex items-center gap-2">
        <span className="font-medium">Wazabiashara Admin</span>
        <span className="text-muted-foreground/60">v{pkg.version}</span>
        <span
          className={cn(
            "inline-flex items-center gap-1.5",
            api === "ok" ? "text-emerald-600" : api === "down" ? "text-red-500" : "",
          )}
        >
          <span
            className={cn(
              "size-1.5 rounded-full",
              api === "ok"
                ? "bg-emerald-500"
                : api === "down"
                  ? "bg-red-500"
                  : "animate-pulse bg-muted-foreground/50",
            )}
          />
          {api === "ok" ? "API online" : api === "down" ? "API offline" : "…"}
        </span>
      </div>
      <div className="flex items-center gap-3">
        <Link
          href={`/${locale}/status`}
          className="transition-colors hover:text-foreground"
        >
          Status
        </Link>
        <Link
          href={`/${locale}/help`}
          className="transition-colors hover:text-foreground"
        >
          Help
        </Link>
        <span>
          {me.roleName} · © {new Date().getFullYear()}
        </span>
      </div>
    </footer>
  );
}
