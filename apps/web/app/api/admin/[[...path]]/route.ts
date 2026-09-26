import { NextRequest, NextResponse } from "next/server";

const API_URL = process.env.API_INTERNAL_URL ?? "http://localhost:3001";
const COOKIE = "wz_admin";
const PREFIX = "/api/admin/v1";

/**
 * Backend-for-frontend proxy for the admin panel (Next docs pattern).
 * The admin bearer token lives in an httpOnly cookie — never readable
 * by client JS. Client code calls same-origin /api/admin/... only.
 */
async function proxy(req: NextRequest, path: string[]) {
  const sub = path.join("/");
  const url = new URL(`${API_URL}${PREFIX}/${sub}`);
  req.nextUrl.searchParams.forEach((v, k) => url.searchParams.set(k, v));

  const headers: Record<string, string> = {
    "content-type": req.headers.get("content-type") ?? "application/json",
    "x-forwarded-for": req.headers.get("x-forwarded-for") ?? "",
    "user-agent": req.headers.get("user-agent") ?? "",
  };
  const token = req.cookies.get(COOKIE)?.value;
  if (token) headers["authorization"] = `Bearer ${token}`;

  const body =
    req.method === "GET" || req.method === "HEAD" ? undefined : await req.text();

  let res: Response;
  try {
    res = await fetch(url, {
      method: req.method,
      headers,
      body,
      cache: "no-store",
    });
  } catch {
    return NextResponse.json(
      { success: false, error: { code: "UPSTREAM", message: "API unreachable" } },
      { status: 502 },
    );
  }

  const data = await res.text();
  const out = new NextResponse(data, {
    status: res.status,
    headers: { "content-type": res.headers.get("content-type") ?? "application/json" },
  });

  // Login: capture token into httpOnly cookie, strip it from the body
  if (req.method === "POST" && sub === "auth/login" && res.ok) {
    try {
      const json = JSON.parse(data);
      const token = json?.data?.token;
      if (token) {
        out.cookies.set(COOKIE, token, {
          httpOnly: true,
          sameSite: "lax",
          secure: process.env.NODE_ENV === "production",
          path: "/",
          maxAge: 12 * 60 * 60,
        });
        delete json.data.token;
        return NextResponse.json(json, { status: res.status, headers: { "set-cookie": out.headers.get("set-cookie") ?? "" } });
      }
    } catch { /* fall through */ }
  }
  if (sub === "auth/logout") {
    out.cookies.set(COOKIE, "", { httpOnly: true, path: "/", maxAge: 0 });
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
