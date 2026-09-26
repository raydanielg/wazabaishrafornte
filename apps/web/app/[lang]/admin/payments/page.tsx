"use client";

import { usePathname, useRouter } from "next/navigation";
import {
  PageHeader,
  DataTable,
  StatusBadge,
  type Column,
} from "@/components/admin/ui";
import { useAdminList } from "@/lib/use-admin-list";
import { fmtDateTime, fmtTzs } from "@/lib/format";

interface Payment {
  id: string;
  amount: string;
  status: string;
  reference: string | null;
  createdAt: string;
  business: { id: string; name: string };
  paymentMethod?: { name: string } | null;
  sale?: { receiptNo: string } | null;
}

export default function PaymentsPage() {
  const pathname = usePathname();
  const router = useRouter();
  const locale = pathname.split("/")[1] ?? "en";
  const { data, loading, error, refresh } = useAdminList<Payment>("payments");

  const columns: Column<Payment>[] = [
    {
      header: "Receipt",
      cell: (p) => (
        <div>
          <p className="font-medium">{p.sale?.receiptNo ?? p.reference ?? p.id.slice(0, 10)}</p>
          <p className="text-xs text-muted-foreground">{p.paymentMethod?.name ?? "—"}</p>
        </div>
      ),
    },
    { header: "Business", cell: (p) => p.business.name },
    {
      header: "Amount",
      cell: (p) => <span className="font-medium tabular-nums">{fmtTzs(p.amount)}</span>,
      className: "text-right",
    },
    { header: "Status", cell: (p) => <StatusBadge status={p.status} /> },
    {
      header: "Date",
      cell: (p) => (
        <span className="text-muted-foreground">{fmtDateTime(p.createdAt)}</span>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Payments"
        description="All payment records across businesses."
      />
      <DataTable
        data={data}
        columns={columns}
        loading={loading}
        error={error}
        onRetry={refresh}
        onRowClick={(p) => router.push(`/${locale}/admin/businesses/${p.business.id}`)}
        emptyTitle="No payments found"
      />
    </div>
  );
}
