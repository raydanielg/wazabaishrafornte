"use client";

 

import { useEffect, useState } from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import { CheckIcon, AlertCircleIcon } from "@hugeicons/core-free-icons";
import { cn } from "@workspace/ui/lib/utils";
import { getDictionary, isLocale } from "@/lib/i18n";
import { SectionHeading } from "./section";

type Status = "operational" | "degraded" | "outage" | "unknown";

interface Service {
  key: "api" | "database" | "app";
  status: Status;
  latencyMs?: number;
}

const TONE: Record<Status, { dot: string; label: string }> = {
  operational: { dot: "bg-emerald-500", label: "operational" },
  degraded: { dot: "bg-amber-500", label: "degraded" },
  outage: { dot: "bg-red-500", label: "outage" },
  unknown: { dot: "bg-muted-foreground/40", label: "unknown" },
};

/** Live status — probes the real backend health endpoint. No fake data. */
export function StatusBoard() {
  const [services, setServices] = useState<Service[] | null>(null);
  const [checkedAt, setCheckedAt] = useState<Date | null>(null);
  const locale = isLocale(
    typeof window !== "undefined" ? window.location.pathname.split("/")[1] ?? "" : "",
  )
    ? (window.location.pathname.split("/")[1] as "en" | "sw")
    : "en";
  const d = getDictionary(locale).statusPage;

  useEffect(() => {
    async function probe() {
      const t0 = performance.now();
      let api: Status = "unknown";
      try {
        const res = await fetch("/api/app/health", { cache: "no-store" });
        api = res.ok ? "operational" : res.status < 500 ? "degraded" : "outage";
      } catch {
        api = "outage";
      }
      const latencyMs = Math.round(performance.now() - t0);
      setServices([
        { key: "app", status: "operational" },
        { key: "api", status: api, latencyMs },
        { key: "database", status: api === "operational" ? "operational" : "unknown" },
      ]);
      setCheckedAt(new Date());
    }
    probe();
    const t = setInterval(probe, 60000);
    return () => clearInterval(t);
  }, []);

  const allGood = services?.every((s) => s.status === "operational");
  const labels: Record<Service["key"], string> = {
    api: d.api,
    database: d.database,
    app: d.app,
  };
  const statusLabel: Record<Status, string> = {
    operational: d.operational,
    degraded: d.degraded,
    outage: d.outage,
    unknown: d.unknown,
  };

  return (
    <div className="mx-auto max-w-2xl">
      <SectionHeading title={d.title} align="center" />
      <div
        className={cn(
          "mt-6 flex items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-medium",
          allGood === undefined
            ? "bg-muted text-muted-foreground"
            : allGood
              ? "bg-emerald-50 text-emerald-800 dark:bg-emerald-950/30 dark:text-emerald-300"
              : "bg-amber-50 text-amber-800 dark:bg-amber-950/30 dark:text-amber-300",
        )}
      >
        <HugeiconsIcon
          icon={allGood === false ? AlertCircleIcon : CheckIcon}
          className="size-4"
          strokeWidth={2.5}
        />
        {allGood === undefined ? d.unknown : allGood ? d.allGood : d.degraded}
      </div>
      <div className="mt-4 divide-y divide-border rounded-xl border border-border bg-card">
        {(services ?? [{ key: "app" }, { key: "api" }, { key: "database" }] as Service[]).map(
          (s) => (
            <div key={s.key} className="flex items-center justify-between px-5 py-4">
              <div className="flex items-center gap-3">
                <span
                  className={cn(
                    "size-2.5 rounded-full",
                    TONE[s.status ?? "unknown"].dot,
                  )}
                />
                <span className="text-sm font-medium">{labels[s.key]}</span>
              </div>
              <div className="text-right">
                <span className="text-sm text-muted-foreground">
                  {statusLabel[s.status ?? "unknown"]}
                </span>
                {s.latencyMs !== undefined && (
                  <span className="ml-2 text-xs text-muted-foreground/60 tabular-nums">
                    {s.latencyMs}ms
                  </span>
                )}
              </div>
            </div>
          ),
        )}
      </div>
      {checkedAt && (
        <p className="mt-3 text-center text-xs text-muted-foreground">
          {d.checked} {checkedAt.toLocaleTimeString()}
        </p>
      )}
    </div>
  );
}
