/**
 * Admin API client — all admin fetches go through the same-origin BFF
 * proxy (/api/admin/*) which attaches the httpOnly session cookie as a
 * Bearer token server-side. Token never touches client JS.
 */

export class AdminApiError extends Error {
  constructor(
    public status: number,
    public code: string,
    message: string,
  ) {
    super(message);
  }
}

export async function adminApi<T = unknown>(
  path: string,
  opts: { method?: string; body?: unknown; params?: Record<string, string | number | undefined> } = {},
): Promise<T> {
  const url = new URL(`/api/admin/${path}`, window.location.origin);
  for (const [k, v] of Object.entries(opts.params ?? {})) {
    if (v !== undefined && v !== "") url.searchParams.set(k, String(v));
  }
  const res = await fetch(url, {
    method: opts.method ?? "GET",
    headers: opts.body ? { "Content-Type": "application/json" } : undefined,
    body: opts.body ? JSON.stringify(opts.body) : undefined,
  });
  const json = await res.json().catch(() => null);
  if (!res.ok) {
    throw new AdminApiError(
      res.status,
      json?.error?.code ?? "UNKNOWN",
      json?.error?.message ?? "Request failed",
    );
  }
  return (json?.data ?? json) as T;
}

export interface AdminMe {
  id: string;
  email: string;
  name: string;
  status: string;
  lastLoginAt: string | null;
  role: string;
  roleName: string;
  permissions: string[];
}

export type Paged<T, X = Record<string, unknown>> = X & {
  items: T[];
  total: number;
  page: number;
  per_page: number;
}
