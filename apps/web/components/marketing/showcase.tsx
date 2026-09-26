"use client";

import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from "@workspace/ui/components/tabs";
import type { Dictionary } from "@/lib/i18n";
import { DashboardMockup, ListMockup } from "./mockups";

const fmt = (n: number) => `TZS ${n.toLocaleString("en-US")}`;

/** Interactive product showcase tabs (§17). */
export function Showcase({ dict }: { dict: Dictionary }) {
  const tabs = [
    {
      key: "dashboard",
      label: dict.showcase.tabs.dashboard,
      content: <DashboardMockup dict={dict} />,
    },
    {
      key: "sales",
      label: dict.showcase.tabs.sales,
      content: (
        <ListMockup
          rows={[
            { label: "RIS-1042 · Cash", value: fmt(45000) },
            { label: "RIS-1041 · Cash", value: fmt(12500) },
            { label: "RIS-1040 · Deni — Juma", value: fmt(68000), muted: true },
            { label: "RIS-1039 · Cash", value: fmt(8300) },
            { label: "RIS-1038 · Cash", value: fmt(21000) },
          ]}
        />
      ),
    },
    {
      key: "products",
      label: dict.showcase.tabs.products,
      content: (
        <ListMockup
          rows={[
            { label: "Coca Cola 500ml", value: "84" },
            { label: "Maji 1.5L", value: "12", muted: true },
            { label: "Mchele 25kg", value: "6" },
            { label: "Cooking Oil 2L", value: "31" },
            { label: "Sabuni ya Kufulia", value: "57" },
          ]}
        />
      ),
    },
    {
      key: "customers",
      label: dict.showcase.tabs.customers,
      content: (
        <ListMockup
          rows={[
            { label: "Juma Ally", value: fmt(68000) },
            { label: "Neema Joseph", value: fmt(0) },
            { label: "Amina Bakari", value: fmt(15200) },
            { label: "Peter Mushi", value: fmt(0) },
          ]}
        />
      ),
    },
    {
      key: "reports",
      label: dict.showcase.tabs.reports,
      content: (
        <div className="w-full overflow-hidden rounded-xl border border-border bg-card p-4 shadow-sm" aria-hidden="true">
          <div className="flex items-end justify-between gap-2">
            {[40, 65, 30, 80, 55, 95, 70].map((h, i) => (
              <div key={i} className="flex-1">
                <div
                  className="rounded-t-sm bg-primary/60"
                  style={{ height: `${h * 1.4}px` }}
                />
                <div className="mt-1.5 h-1 rounded bg-border" />
              </div>
            ))}
          </div>
          <div className="mt-4 grid grid-cols-3 gap-2 text-center text-[11px]">
            <div className="rounded-md bg-muted/60 px-2 py-1.5">
              <p className="text-muted-foreground">{dict.reports.items[0]}</p>
              <p className="font-semibold tabular-nums">{fmt(4210000)}</p>
            </div>
            <div className="rounded-md bg-muted/60 px-2 py-1.5">
              <p className="text-muted-foreground">{dict.reports.items[1]}</p>
              <p className="font-semibold tabular-nums">{fmt(1130000)}</p>
            </div>
            <div className="rounded-md bg-muted/60 px-2 py-1.5">
              <p className="text-muted-foreground">{dict.reports.items[2]}</p>
              <p className="font-semibold tabular-nums">{fmt(960000)}</p>
            </div>
          </div>
        </div>
      ),
    },
  ];

  return (
    <Tabs defaultValue="dashboard" className="mx-auto w-full max-w-3xl">
      <TabsList className="mx-auto flex w-full max-w-lg justify-center overflow-x-auto">
        {tabs.map((t) => (
          <TabsTrigger key={t.key} value={t.key} className="text-xs sm:text-sm">
            {t.label}
          </TabsTrigger>
        ))}
      </TabsList>
      {tabs.map((t) => (
        <TabsContent key={t.key} value={t.key} className="mt-6">
          {t.content}
        </TabsContent>
      ))}
    </Tabs>
  );
}
