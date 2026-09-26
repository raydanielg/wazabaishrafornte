"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { adminApi } from "@/lib/admin-api";

export default function AdminLogout() {
  const router = useRouter();
  useEffect(() => {
    const locale = window.location.pathname.split("/")[1] ?? "en";
    adminApi("auth/logout", { method: "POST" })
      .catch(() => {})
      .finally(() => router.replace(`/${locale}/auth/login`));
  }, [router]);
  return (
    <div className="flex min-h-svh items-center justify-center">
      <p className="text-sm text-muted-foreground">Signing out…</p>
    </div>
  );
}
