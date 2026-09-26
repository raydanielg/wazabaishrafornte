"use client";

import { usePathname, useRouter } from "next/navigation";
import {
  PageHeader,
  DataTable,
  StatCard,
  type Column,
} from "@/components/admin/ui";
import { useAdminList } from "@/lib/use-admin-list";
import { fmtDateTime, fmtTzs } from "@/lib/format";

interface Tx {
  id: string;
  amount: string;
  reference: string | null;
  paidAt: string;
  business: { id: string; name: string; currency: string };
  paymentMethod?: { name: string } | null;
  sale?: { receiptNo: string } | null;
}

export default function TransactionsPage() {
  const pathname = usePathname();
  const router = useRouter();
  const locale = pathname.split("/")[1] ?? "en";
  const { data, loading, error, search, setSearch, refresh } =
    useAdminList<Tx, { sum: string | number }>("transactions");

  const columns: Column<Tx>[] = [
    {
      header: "Reference",
      cell: (t) => (
        <div>
          <p className="font-medium">
            {t.sale?.receiptNo ?? t.reference ?? t.id.slice(0, 10)}
          </p>
          <p className="text-xs text-muted-foreground">
            {t.paymentMethod?.name ?? "—"}
          </p>
        </div>
      ),
    },
    { header: "Business", cell: (t) => t.business.name },
    {
      header: "Amount",
      cell: (t) => (
        <span className="font-medium tabular-nums">{fmtTzs(t.amount)}</span>
      ),
      className: "text-right",
    },
    {
      header: "Paid at",
      cell: (t) => (
        <span className="text-muted-foreground">{fmtDateTime(t.paidAt)}</span>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Transactions"
        description="Every payment recorded across all businesses."
      />
      {data && (
        <div className="grid gap-3 sm:grid-cols-2">
          <StatCard label="Total volume" value={fmtTzs(String(data.sum ?? 0))} />
          <StatCard label="Transactions" value={data.total} />
        </div>
      )}
      <DataTable
        data={data}
        columns={columns}
        loading={loading}
        error={error}
        onRetry={refresh}
        search={search}
        onSearch={setSearch}
        searchPlaceholder="Search receipt, reference, business…"
        onRowClick={(t) => router.push(`/${locale}/admin/transactions/${t.id}`)}
        emptyTitle="No transactions found"
      />
    </div>
  );
}
