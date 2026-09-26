import { NextRequest, NextResponse } from "next/server";

const locales = ["en", "sw"];
const defaultLocale = "en";
const LOCALE_COOKIE = "wz-lang";

function getLocale(request: NextRequest): string {
  const cookie = request.cookies.get(LOCALE_COOKIE)?.value;
  if (cookie && locales.includes(cookie)) return cookie;
  const accept = request.headers.get("accept-language") ?? "";
  if (accept.toLowerCase().includes("sw")) return "sw";
  return defaultLocale;
}

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Canonical host: www → apex (single 308, no chains — §48)
  const host = request.headers.get("host") ?? "";
  const apex = process.env.NEXT_PUBLIC_SITE_URL?.replace(/^https?:\/\//, "");
  if (apex && host === `www.${apex}`) {
    const url = request.nextUrl.clone();
    url.host = apex;
    return NextResponse.redirect(url, 308);
  }

  // Skip internal paths, files and locale-prefixed routes
  const hasLocale = locales.some(
    (l) => pathname === `/${l}` || pathname.startsWith(`/${l}/`),
  );

  // Admin area requires an admin session cookie
  const adminMatch = pathname.match(/^\/(en|sw)\/admin/);
  if (adminMatch && !request.cookies.get("wz_admin")?.value) {
    const url = request.nextUrl.clone();
    url.pathname = `/${adminMatch[1]}/auth/login`;
    url.search = `?next=${encodeURIComponent(pathname)}`;
    return NextResponse.redirect(url);
  }

  if (
    hasLocale ||
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api") ||
    /\.[a-z0-9]+$/i.test(pathname)
  ) {
    return NextResponse.next();
  }

  const locale = getLocale(request);
  const url = request.nextUrl.clone();
  url.pathname = `/${locale}${pathname === "/" ? "" : pathname}`;
  return NextResponse.redirect(url);
}

export const config = {
  matcher: ["/((?!_next|api).*)"],
};
