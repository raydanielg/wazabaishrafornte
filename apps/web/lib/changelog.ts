/**
 * Product changelog — real releases only, newest first (§22).
 * Update when shipping; do not invent entries.
 */
export interface ChangelogEntry {
  version: string;
  date: string;
  items: { type: "new" | "improved" | "fixed"; en: string; sw: string }[];
}

export const CHANGELOG: ChangelogEntry[] = [
  {
    version: "1.0.0",
    date: "2025-09",
    items: [
      { type: "new", en: "Initial Wazabiashara release: sales, products, stock, customers, suppliers, expenses, debts and reports.", sw: "Toleo la kwanza la Wazabiashara: mauzo, bidhaa, hisa, wateja, wasambazaji, matumizi, madeni na ripoti." },
      { type: "new", en: "Multiple businesses under one account with roles and permissions.", sw: "Biashara nyingi chini ya akaunti moja kwa majukumu na ruhusa." },
      { type: "new", en: "Subscription plans with configurable modules and limits.", sw: "Mipango ya malipo kwa moduli na mipaka inayoweza kubadilishwa." },
      { type: "new", en: "English and Kiswahili interfaces.", sw: "Lugha za Kiingereza na Kiswahili." },
    ],
  },
];

export const CHANGELOG_TONE: Record<ChangelogEntry["items"][number]["type"], string> = {
  new: "bg-emerald-100 text-emerald-800 dark:bg-emerald-950/50 dark:text-emerald-300",
  improved: "bg-sky-100 text-sky-800 dark:bg-sky-950/50 dark:text-sky-300",
  fixed: "bg-amber-100 text-amber-800 dark:bg-amber-950/50 dark:text-amber-300",
};
