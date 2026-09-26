/**
 * Centralized configurable content (§37). Only structure + icon keys live
 * here — all visible text comes from dictionaries.
 */

export const NAV_LINKS = [
  { key: "features", href: "/features" },
  { key: "howItWorks", href: "/how-it-works" },
  { key: "pricing", href: "/pricing" },
  { key: "resources", href: "/resources" },
] as const;

export const FOOTER_LINKS = {
  product: [
    { key: "features", href: "/features" },
    { key: "pricing", href: "/pricing" },
    { key: "mobileApp", href: "/mobile-app" },
    { key: "howItWorks", href: "/how-it-works" },
  ],
  resources: [
    { key: "helpCenter", href: "/help" },
    { key: "guides", href: "/resources" },
    { key: "faq", href: "/faq" },
    { key: "tutorials", href: "/resources" },
    { key: "status", href: "/status" },
    { key: "changelog", href: "/changelog" },
  ],
  company: [
    { key: "about", href: "/about" },
    { key: "contact", href: "/contact" },
  ],
  legal: [
    { key: "privacy", href: "/privacy" },
    { key: "terms", href: "/terms" },
    { key: "security", href: "/security" },
  ],
} as const;

export const BUSINESS_TYPES = [
  "retail",
  "wholesale",
  "restaurant",
  "salon",
  "boutique",
  "hardware",
  "services",
  "other",
] as const;

export const BUSINESS_TYPE_LABELS: Record<string, { en: string; sw: string }> = {
  retail: { en: "Retail", sw: "Rejareja" },
  wholesale: { en: "Wholesale", sw: "Jumla" },
  restaurant: { en: "Restaurant", sw: "Mgahawa" },
  salon: { en: "Salon", sw: "Saluni" },
  boutique: { en: "Boutique", sw: "Butiki" },
  hardware: { en: "Hardware", sw: "Vifaa" },
  services: { en: "Services", sw: "Huduma" },
  other: { en: "Other", sw: "Nyingine" },
};

export const CONTACT = {
  email: "support@wazabiashara.com",
  location: "Tanzania",
} as const;

export const APP_STORE_URL = process.env.NEXT_PUBLIC_APP_STORE_URL ?? "";
export const PLAY_STORE_URL = process.env.NEXT_PUBLIC_PLAY_STORE_URL ?? "";

/** Per-type use-case content (§68) — genuinely different per business type. */
export const BUSINESS_TYPE_POINTS: Record<
  string,
  { en: string[]; sw: string[] }
> = {
  retail: {
    en: [
      "Counter sales with receipts — cash, mobile money or credit.",
      "Stock levels update automatically with every sale.",
      "Know which products sell fastest and which sit too long.",
      "Track customer debts without a separate notebook.",
    ],
    sw: [
      "Mauzo ya mkaa kwa risiti — cash, mobile money au deni.",
      "Hisa hubadilika moja kwa moja kwa kila mauzo.",
      "Jua bidhaa zinazouza haraka na zinazokaa.",
      "Fuatilia madeni ya wateja bila daftari.",
    ],
  },
  wholesale: {
    en: [
      "Handle larger orders with multiple items per sale.",
      "Keep supplier records and what you owe them organized.",
      "Customer balances stay visible across repeat buyers.",
      "Reports show margins across your catalog.",
    ],
    sw: [
      "Shughulikia oda kubwa zenye bidhaa nyingi kwa mauzo moja.",
      "Kumbukumbu za wasambazaji na madeni yao ziko mpangilio.",
      "Madeni ya wateja wa mara kwa mara yanaonekana wazi.",
      "Ripoti zinaonyesha faida kwa kila bidhaa.",
    ],
  },
  restaurant: {
    en: [
      "Record daily sales quickly at the end of service.",
      "Track ingredient and supply expenses as they happen.",
      "See daily profit clearly — sales minus expenses.",
      "Let waiters or cashiers record sales with limited permissions.",
    ],
    sw: [
      "Rekodi mauzo ya siku haraka mwisho wa huduma.",
      "Fuatilia gharama za vyakula na vifaa zinapotokea.",
      "Ona faida ya siku wazi — mauzo kutoa matumizi.",
      "Wafanyakazi wanaweza kurekodi mauzo kwa ruhusa ndogo.",
    ],
  },
  salon: {
    en: [
      "Track service income and product sales together.",
      "Know which services bring the most revenue.",
      "Keep customer records for repeat visits.",
    ],
    sw: [
      "Fuatilia mapato ya huduma na mauzo ya bidhaa pamoja.",
      "Jua huduma zinazoleta mapato mengi.",
      "Weka kumbukumbu za wateja kwa ziara zinazofuata.",
    ],
  },
  boutique: {
    en: [
      "Manage sizes and stock across a changing catalog.",
      "Credit sales for trusted customers stay tracked.",
      "See stock value and slow items before restocking.",
    ],
    sw: [
      "Simamia saizi na hisa ya bidhaa zinazobadilika.",
      "Mauzo ya deni kwa wateja wa uhakika yanafuatiliwa.",
      "Ona thamani ya hisa kabla ya kununua tena.",
    ],
  },
  hardware: {
    en: [
      "Track many small items and bulk materials in one catalog.",
      "Supplier debts and purchase records stay organized.",
      "Daily sales summaries keep cash flow clear.",
    ],
    sw: [
      "Fuatilia bidhaa ndogo na vifaa vikubwa katalogi moja.",
      "Madeni ya wasambazaji na rekodi za manunuzi ziko mpangilio.",
      "Muhtasari wa mauzo ya siku huweka cash flow wazi.",
    ],
  },
  services: {
    en: [
      "Record service sales and outstanding client balances.",
      "Track business expenses against income.",
      "Simple reports show whether the business is growing.",
    ],
    sw: [
      "Rekodi mauzo ya huduma na madeni ya wateja.",
      "Linganisha matumizi ya biashara na mapato.",
      "Ripoti rahisi zinaonyesha kama biashara inakua.",
    ],
  },
  other: {
    en: [
      "Wazabiashara adapts — products, services or both.",
      "Start with sales and stock, add modules as you grow.",
      "Every record stays organized from day one.",
    ],
    sw: [
      "Wazabiashara inabadilika — bidhaa, huduma au zote.",
      "Anza na mauzo na hisa, ongeza moduli unapokua.",
      "Kila rekodi inabaki mpangilio tangu siku ya kwanza.",
    ],
  },
};
