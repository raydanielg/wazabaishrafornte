"use client";

 

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams, usePathname } from "next/navigation";
import { adminApi } from "@/lib/admin-api";
import {
  PageHeader,
  StatusBadge,
  EmptyState,
  ErrorState,
} from "@/components/admin/ui";
import { fmtDateTime, fmtTzs } from "@/lib/format";
import { Skeleton } from "@workspace/ui/components/skeleton";

interface TxDetail {
  id: string;
  amount: string;
  reference: string | null;
  paidAt: string;
  business: { id: string; name: string; currency: string };
  paymentMethod?: { name: string; key: string } | null;
  sale?: {
    id: string;
    receiptNo: string;
    status: string;
    customer?: { id: string; name: string } | null;
    items: { id: string; quantity: number; unitPrice: string; product?: { name: string } }[];
  } | null;
}

export default function TransactionDetailPage() {
  const { id } = useParams<{ id: string }>();
  const pathname = usePathname();
  const locale = pathname.split("/")[1] ?? "en";
  const [tx, setTx] = useState<TxDetail | null>(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    adminApi<TxDetail>(`transactions/${id}`)
      .then(setTx)
      .catch(() => setError(true));
  }, [id]);

  if (error) return <ErrorState />;
  if (!tx) return <Skeleton className="h-64 w-full rounded-xl" />;

  return (
    <div className="max-w-2xl space-y-6">
      <PageHeader
        title={tx.sale?.receiptNo ?? tx.reference ?? "Transaction"}
        description={`${tx.business.name} · ${fmtDateTime(tx.paidAt)}`}
        actions={
          <Link
            href={`/${locale}/admin/businesses/${tx.business.id}`}
            className="text-sm text-muted-foreground underline-offset-4 hover:underline"
          >
            View business →
          </Link>
        }
      />
      <dl className="grid grid-cols-2 gap-4 rounded-xl border border-border bg-card p-5 sm:grid-cols-3">
        <div>
          <dt className="text-xs text-muted-foreground">Amount</dt>
          <dd className="mt-1 text-lg font-semibold tabular-nums">
            {fmtTzs(tx.amount)}
          </dd>
        </div>
        <div>
          <dt className="text-xs text-muted-foreground">Method</dt>
          <dd className="mt-1 font-medium">{tx.paymentMethod?.name ?? "—"}</dd>
        </div>
        <div>
          <dt className="text-xs text-muted-foreground">Reference</dt>
          <dd className="mt-1 font-medium">{tx.reference ?? "—"}</dd>
        </div>
      </dl>
      {tx.sale && (
        <div className="rounded-xl border border-border bg-card">
          <div className="flex items-center justify-between border-b border-border px-5 py-3">
            <p className="text-sm font-medium">
              Sale {tx.sale.receiptNo}
              {tx.sale.customer ? ` · ${tx.sale.customer.name}` : ""}
            </p>
            <StatusBadge status={tx.sale.status} />
          </div>
          {tx.sale.items.length === 0 ? (
            <EmptyState title="No line items" />
          ) : (
            <div className="divide-y divide-border">
              {tx.sale.items.map((it) => (
                <div key={it.id} className="flex justify-between px-5 py-3 text-sm">
                  <span>
                    {it.product?.name ?? "Item"} × {it.quantity}
                  </span>
                  <span className="tabular-nums text-muted-foreground">
                    {fmtTzs(String(Number(it.unitPrice) * it.quantity))}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
