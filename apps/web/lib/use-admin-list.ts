"use client";

/* eslint-disable react-hooks/set-state-in-effect -- fetch loading states */

import { useCallback, useEffect, useState } from "react";
import { adminApi, type Paged } from "@/lib/admin-api";


/**
 * Shared list-fetching hook for admin tables: pagination via ?page=,
 * search, loading/error states, manual refresh.
 */
export function useAdminList<T, X = Record<string, unknown>>(
  path: string,
  extraParams: Record<string, string | number | undefined> = {},
) {
  const [data, setData] = useState<Paged<T, X> | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [tick, setTick] = useState(0);

  // pagination links push ?page= and emit wz:page
  useEffect(() => {
    const onPage = () => {
      const p = Number(new URL(window.location.href).searchParams.get("page")) || 1;
      setPage(p);
    };
    window.addEventListener("wz:page", onPage);
    window.addEventListener("popstate", onPage);
    return () => {
      window.removeEventListener("wz:page", onPage);
      window.removeEventListener("popstate", onPage);
    };
  }, []);

  const refresh = useCallback(() => setTick((t) => t + 1), []);

  useEffect(() => {
    let live = true;
    setLoading(true);
    setError(false);
    adminApi<Paged<T, X>>(path, {
      params: { page, per_page: 20, search: search || undefined, ...extraParams },
    })
      .then((r) => live && setData(r))
      .catch(() => live && setError(true))
      .finally(() => live && setLoading(false));
    return () => {
      live = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [path, page, search, tick, JSON.stringify(extraParams)]);

  return { data, loading, error, search, setSearch, refresh };
}
