import { en, type Dictionary } from "./en";
import { sw } from "./sw";

export const locales = ["en", "sw"] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = "en";
export const LOCALE_COOKIE = "wz-lang";

const dictionaries: Record<Locale, Dictionary> = { en, sw };

export function isLocale(value: string): value is Locale {
  return (locales as readonly string[]).includes(value);
}

export function getDictionary(locale: Locale): Dictionary {
  return dictionaries[locale] ?? dictionaries[defaultLocale];
}

export function localizedPath(locale: Locale, path: string) {
  const p = path.startsWith("/") ? path : `/${path}`;
  return `/${locale}${p === "/" ? "" : p}`;
}

export type { Dictionary };
