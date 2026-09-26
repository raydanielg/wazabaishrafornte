"use client";

 

import { useEffect, useState } from "react";
import { Badge } from "@workspace/ui/components/badge";
import { toast } from "@workspace/ui/components/toast";
import { Switch } from "@workspace/ui/components/switch";
import { adminApi } from "@/lib/admin-api";
import { PageHeader, ErrorState } from "@/components/admin/ui";
import { Skeleton } from "@workspace/ui/components/skeleton";

interface Module {
  id: string;
  key: string;
  name: string;
  description: string | null;
  isCore: boolean;
  isActive: boolean;
  _count?: { packageModules: number };
}

export default function ModulesPage() {
  const [modules, setModules] = useState<Module[] | null>(null);
  const [error, setError] = useState(false);
  const [err, setErr] = useState("");
  const [tick, setTick] = useState(0);

  useEffect(() => {
    let live = true;
    adminApi<Module[]>("modules")
      .then((m) => live && setModules(m))
      .catch(() => live && setError(true));
    return () => {
      live = false;
    };
  }, [tick]);

  async function toggle(m: Module, checked: boolean) {
    setErr("");
    setModules((ms) =>
      ms?.map((x) => (x.id === m.id ? { ...x, isActive: checked } : x)) ?? ms,
    );
    try {
      await adminApi(`modules/${m.id}`, {
        method: "PATCH",
        body: { isActive: checked },
      });
      toast.add({ title: `${m.name} ${checked ? "enabled" : "disabled"}` });
    } catch (e) {
      setErr(e instanceof Error ? e.message : "Update failed");
      setTick((t) => t + 1);
    }
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Modules"
        description="Feature modules available across the platform. Core modules are always on."
      />
      {err && <p className="text-sm text-destructive">{err}</p>}
      {error ? (
        <ErrorState onRetry={() => setTick((t) => t + 1)} />
      ) : !modules ? (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {[0, 1, 2, 3, 4, 5].map((i) => (
            <Skeleton key={i} className="h-24 rounded-xl" />
          ))}
        </div>
      ) : (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {modules.map((m) => (
            <div
              key={m.id}
              className="flex items-start justify-between gap-3 rounded-xl border border-border bg-card p-4"
            >
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <p className="truncate text-sm font-medium">{m.name}</p>
                  {m.isCore && (
                    <Badge variant="secondary" className="text-[10px]">
                      core
                    </Badge>
                  )}
                </div>
                <p className="mt-0.5 text-xs text-muted-foreground">
                  {m.key} · {m._count?.packageModules ?? 0} plans
                </p>
                {m.description && (
                  <p className="mt-1 line-clamp-2 text-xs text-muted-foreground">
                    {m.description}
                  </p>
                )}
              </div>
              <Switch
                checked={m.isActive}
                disabled={m.isCore}
                onCheckedChange={(v) => toggle(m, v)}
                aria-label={`Toggle ${m.name}`}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
