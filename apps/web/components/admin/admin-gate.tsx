"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { useRouter } from "next/navigation";
import { adminApi, AdminApiError, type AdminMe } from "@/lib/admin-api";
import { Skeleton } from "@workspace/ui/components/skeleton";

interface AdminCtx {
  me: AdminMe;
  can: (permission: string) => boolean;
  logout: () => Promise<void>;
  refresh: () => void;
}

const Ctx = createContext<AdminCtx | null>(null);

export function useAdmin() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useAdmin must be used inside AdminGate");
  return ctx;
}

/**
 * Auth + permission provider for the admin area. Fetches the admin
 * profile through the BFF proxy; redirects to login on 401.
 */
export function AdminGate({
  locale,
  children,
}: {
  locale: string;
  children: React.ReactNode;
}) {
  const [me, setMe] = useState<AdminMe | null>(null);
  const [failed, setFailed] = useState(false);
  const [tick, setTick] = useState(0);
  const router = useRouter();

  useEffect(() => {
    let live = true;
    adminApi<AdminMe>("me")
      .then((m) => live && setMe(m))
      .catch((e) => {
        if (!live) return;
        if (e instanceof AdminApiError && e.status === 401) {
          router.replace(`/${locale}/auth/login?next=/${locale}/admin/dashboard`);
        } else {
          setFailed(true);
        }
      });
    return () => {
      live = false;
    };
  }, [locale, router, tick]);

  const logout = useCallback(async () => {
    await adminApi("auth/logout", { method: "POST" }).catch(() => {});
    router.replace(`/${locale}/auth/login`);
  }, [locale, router]);

  const value = useMemo<AdminCtx | null>(() => {
    if (!me) return null;
    const perms = new Set(me.permissions);
    return {
      me,
      can: (p) => perms.has(p),
      logout,
      refresh: () => setTick((t) => t + 1),
    };
  }, [me, logout]);

  if (!me) {
    if (failed) {
      return (
        <div className="flex min-h-svh items-center justify-center">
          <div className="text-center">
            <p className="text-sm text-muted-foreground">
              Could not reach the server.
            </p>
            <button
              className="mt-3 text-sm font-medium underline underline-offset-4"
              onClick={() => setTick((t) => t + 1)}
            >
              Try again
            </button>
          </div>
        </div>
      );
    }
    return (
      <div className="flex min-h-svh gap-4 p-4">
        <Skeleton className="hidden w-56 rounded-xl md:block" />
        <div className="flex-1 space-y-4">
          <Skeleton className="h-12 rounded-xl" />
          <Skeleton className="h-40 rounded-xl" />
          <Skeleton className="h-40 rounded-xl" />
        </div>
      </div>
    );
  }

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}
