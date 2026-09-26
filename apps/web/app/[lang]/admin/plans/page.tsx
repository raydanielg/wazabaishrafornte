"use client";

 

import { useEffect, useState } from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import { AddCircleIcon, CheckIcon } from "@hugeicons/core-free-icons";
import { Button } from "@workspace/ui/components/button";
import { toast } from "@workspace/ui/components/toast";
import { Input } from "@workspace/ui/components/input";
import { Label } from "@workspace/ui/components/label";
import { Switch } from "@workspace/ui/components/switch";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@workspace/ui/components/dialog";
import { Badge } from "@workspace/ui/components/badge";
import { adminApi } from "@/lib/admin-api";
import { PageHeader, ErrorState } from "@/components/admin/ui";
import { Skeleton } from "@workspace/ui/components/skeleton";
import { fmtTzs } from "@/lib/format";

interface Plan {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  price: string;
  currency: string;
  billingPeriod: string;
  trialDays: number;
  isActive: boolean;
  isDefault: boolean;
  sortOrder: number;
  limits: { key: string; value: number | null }[];
  modules: string[];
  _count?: { subscriptions: number };
}

export default function PlansPage() {
  const [plans, setPlans] = useState<Plan[] | null>(null);
  const [error, setError] = useState(false);
  const [edit, setEdit] = useState<Plan | null>(null);
  const [createOpen, setCreateOpen] = useState(false);
  const [tick, setTick] = useState(0);

  useEffect(() => {
    let live = true;
    adminApi<Plan[]>("packages")
      .then((p) => live && setPlans(p))
      .catch(() => live && setError(true));
    return () => {
      live = false;
    };
  }, [tick]);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Plans"
        description="Subscription packages, prices and limits."
        actions={
          <Button size="sm" onClick={() => setCreateOpen(true)}>
            <HugeiconsIcon icon={AddCircleIcon} strokeWidth={2} />
            New plan
          </Button>
        }
      />
      {error ? (
        <ErrorState onRetry={() => setTick((t) => t + 1)} />
      ) : !plans ? (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {[0, 1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-48 rounded-xl" />
          ))}
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {plans.map((p) => (
            <div
              key={p.id}
              className="flex flex-col rounded-xl border border-border bg-card p-5"
            >
              <div className="flex items-center justify-between">
                <h3 className="font-semibold">{p.name}</h3>
                <div className="flex gap-1">
                  {p.isDefault && <Badge variant="secondary">default</Badge>}
                  {!p.isActive && <Badge variant="outline">hidden</Badge>}
                </div>
              </div>
              <p className="mt-0.5 text-xs text-muted-foreground">{p.slug}</p>
              <p className="mt-3 text-xl font-bold tabular-nums">
                {Number(p.price) === 0 ? "Free" : fmtTzs(p.price)}
                <span className="text-xs font-normal text-muted-foreground">
                  {Number(p.price) > 0 ? ` / ${p.billingPeriod}` : ""}
                </span>
              </p>
              <ul className="mt-3 flex-1 space-y-1.5 text-xs text-muted-foreground">
                {p.limits.slice(0, 5).map((l) => (
                  <li key={l.key} className="flex items-center gap-1.5">
                    <HugeiconsIcon icon={CheckIcon} className="size-3.5 text-emerald-600" strokeWidth={2.5} />
                    {l.value === null ? "Unlimited" : l.value.toLocaleString()}{" "}
                    {l.key.replace("max_", "").replace(/_/g, " ")}
                  </li>
                ))}
                <li className="pt-1 font-medium text-foreground">
                  {p.modules.length} modules · {p._count?.subscriptions ?? 0} subscribers
                </li>
              </ul>
              <Button
                variant="outline"
                size="sm"
                className="mt-4"
                onClick={() => setEdit(p)}
              >
                Edit
              </Button>
            </div>
          ))}
        </div>
      )}
      <PlanDialog plan={edit} open={!!edit} onOpenChange={(v) => !v && setEdit(null)} onDone={() => setTick((t) => t + 1)} />
      <PlanDialog open={createOpen} onOpenChange={setCreateOpen} onDone={() => setTick((t) => t + 1)} create />
    </div>
  );
}

function PlanDialog({
  plan,
  open,
  onOpenChange,
  onDone,
  create,
}: {
  plan?: Plan | null;
  open: boolean;
  onOpenChange: (v: boolean) => void;
  onDone: () => void;
  create?: boolean;
}) {
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const f = e.currentTarget;
    const val = (n: string) => (f.elements.namedItem(n) as HTMLInputElement)?.value;
    setBusy(true);
    setErr("");
    try {
      const body: Record<string, unknown> = {
        name: val("name"),
        price: Number(val("price")),
        trialDays: Number(val("trialDays") || 0),
        isActive: (f.elements.namedItem("isActive") as HTMLInputElement)?.checked ?? true,
      };
      if (create) {
        body.slug = val("slug");
        body.billingPeriod = val("billingPeriod") || "monthly";
      }
      await adminApi(create ? "packages" : `packages/${plan!.id}`, {
        method: create ? "POST" : "PATCH",
        body,
      });
      toast.add({ title: create ? "Plan created" : "Plan updated" });
      onOpenChange(false);
      onDone();
    } catch (e2) {
      setErr(e2 instanceof Error ? e2.message : "Save failed");
    } finally {
      setBusy(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{create ? "New plan" : `Edit ${plan?.name}`}</DialogTitle>
          <DialogDescription>
            Changes take effect for new subscriptions immediately.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={submit} className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label htmlFor="p-name">Name</Label>
              <Input density="compact" id="p-name" name="name" defaultValue={plan?.name} required />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="p-slug">Slug</Label>
              <Input density="compact" id="p-slug" name="slug" defaultValue={plan?.slug} required disabled={!create} placeholder="pro" />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="p-price">Price (TZS)</Label>
              <Input density="compact" id="p-price" name="price" type="number" min={0} defaultValue={plan?.price ?? "0"} required />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="p-trial">Trial days</Label>
              <Input density="compact" id="p-trial" name="trialDays" type="number" min={0} defaultValue={plan?.trialDays ?? 0} />
            </div>
            {create && (
              <div className="space-y-1.5">
                <Label htmlFor="p-bp">Billing period</Label>
                <Input density="compact" id="p-bp" name="billingPeriod" defaultValue="monthly" />
              </div>
            )}
          </div>
          <label className="flex items-center gap-2 text-sm">
            <Switch name="isActive" defaultChecked={plan?.isActive ?? true} />
            Visible & purchasable
          </label>
          {err && <p className="text-sm text-destructive">{err}</p>}
          <DialogFooter>
            <Button type="submit" disabled={busy}>
              {busy ? "Saving…" : create ? "Create plan" : "Save changes"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
