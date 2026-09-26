import { NextRequest, NextResponse } from "next/server";

const API_URL = process.env.API_INTERNAL_URL ?? "http://localhost:3001";

/**
 * BFF proxy for the signed-in user area.
 * `v1/*` → backend /api/v1/*, `auth/*` → backend /api/auth/* (Better Auth).
 * Session cookies are forwarded both ways so the better-auth cookie is set
 * on this origin — tokens never touch client JS.
 */
async function proxy(req: NextRequest, path: string[]) {
  const sub = path.join("/");
  const prefix = sub.startsWith("auth/") || sub === "health" ? "/api" : "/api/v1";
  const url = new URL(`${API_URL}${prefix}/${sub}`);
  req.nextUrl.searchParams.forEach((v, k) => url.searchParams.set(k, v));

  const headers: Record<string, string> = {
    "content-type": req.headers.get("content-type") ?? "application/json",
    "x-forwarded-for": req.headers.get("x-forwarded-for") ?? "",
    "user-agent": req.headers.get("user-agent") ?? "",
    cookie: req.headers.get("cookie") ?? "",
  };

  const body =
    req.method === "GET" || req.method === "HEAD" ? undefined : await req.text();

  let res: Response;
  try {
    res = await fetch(url, { method: req.method, headers, body, cache: "no-store", redirect: "manual" });
  } catch {
    return NextResponse.json(
      { success: false, error: { code: "UPSTREAM", message: "API unreachable" } },
      { status: 502 },
    );
  }

  const data = await res.arrayBuffer();
  const out = new NextResponse(data, {
    status: res.status,
    headers: { "content-type": res.headers.get("content-type") ?? "application/json" },
  });

  // Forward backend cookies onto this origin (strip Domain/Secure for local dev)
  const setCookies =
    typeof res.headers.getSetCookie === "function"
      ? res.headers.getSetCookie()
      : [res.headers.get("set-cookie")].filter(Boolean) as string[];
  for (const c of setCookies) {
    out.headers.append(
      "set-cookie",
      c.replace(/;\s*Domain=[^;]*/i, "").replace(/;\s*Secure/i, ""),
    );
  }
  return out;
}

function handler(req: NextRequest, ctx: { params: Promise<{ path?: string[] }> }) {
  return ctx.params.then(({ path = [] }) => proxy(req, path));
}

export const GET = handler;
export const POST = handler;
export const PUT = handler;
export const PATCH = handler;
export const DELETE = handler;
