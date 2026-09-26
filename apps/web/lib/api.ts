/**
 * Public API service layer (§22, §37). All backend access goes through
 * here — components never call fetch directly.
 */

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3001";

export interface PublicPackage {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  price: string;
  currency: string;
  billingPeriod: string;
  trialDays: number;
  limits: Record<string, number | null>;
  modules: string[];
}

interface ApiEnvelope<T> {
  success: boolean;
  data: T;
}

/**
 * Fetch public packages for the pricing page.
 * Returns null on failure — callers render the fallback/empty state.
 */
export async function getPackages(): Promise<PublicPackage[] | null> {
  try {
    const res = await fetch(`${API_URL}/api/v1/packages`, {
      next: { revalidate: 300 },
    });
    if (!res.ok) return null;
    const json = (await res.json()) as ApiEnvelope<PublicPackage[]>;
    return json.data ?? [];
  } catch {
    return null;
  }
}
