"use client";

 

import { createContext, useCallback, useContext, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Skeleton } from "@workspace/ui/components/skeleton";

export interface SessionUser {
  id: string;
  name: string;
  email: string | null;
  phoneNumber?: string | null;
  image?: string | null;
  emailVerified?: boolean;
}

interface AccountCtx {
  user: SessionUser;
  refresh: () => void;
  signOut: () => Promise<void>;
}

const Ctx = createContext<AccountCtx | null>(null);

export function useAccount() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useAccount must be used inside AccountGate");
  return ctx;
}

/** User session gate for /account — same-origin session via BFF proxy. */
export function AccountGate({
  locale,
  children,
}: {
  locale: string;
  children: React.ReactNode;
}) {
  const [user, setUser] = useState<SessionUser | null>(null);
  const [tick, setTick] = useState(0);
  const router = useRouter();

  useEffect(() => {
    let live = true;
    fetch("/api/app/auth/get-session", { cache: "no-store" })
      .then((r) => (r.ok ? r.json() : Promise.reject(r.status)))
      .then((j) => {
        if (!live) return;
        if (!j?.user) {
          router.replace(`/${locale}/login?next=/${locale}/account/profile`);
        } else {
          setUser(j.user);
        }
      })
      .catch(() => live && router.replace(`/${locale}/auth/session-expired`));
    return () => {
      live = false;
    };
  }, [locale, router, tick]);

  const signOut = useCallback(async () => {
    await fetch("/api/app/auth/sign-out", { method: "POST" }).catch(() => {});
    router.replace(`/${locale}/login`);
  }, [locale, router]);

  if (!user) {
    return (
      <div className="mx-auto w-full max-w-4xl space-y-4 px-4 py-10">
        <Skeleton className="h-10 w-64" />
        <Skeleton className="h-56 w-full rounded-xl" />
      </div>
    );
  }

  return (
    <Ctx.Provider value={{ user, refresh: () => setTick((t) => t + 1), signOut }}>
      {children}
    </Ctx.Provider>
  );
}
