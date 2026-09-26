"use client";

 

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { HugeiconsIcon } from "@hugeicons/react";
import { NotificationIcon } from "@hugeicons/core-free-icons";
import { Button } from "@workspace/ui/components/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@workspace/ui/components/dropdown-menu";
import { adminApi, type Paged } from "@/lib/admin-api";
import { timeAgo } from "@/lib/format";

interface AuditItem {
  id: string;
  action: string;
  createdAt: string;
  actor?: { name: string } | null;
  actorAdmin?: { name: string } | null;
}

/** Recent admin-visible activity as the notification feed. */
export function NotificationCenter() {
  const [items, setItems] = useState<AuditItem[]>([]);
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const locale = pathname.split("/")[1] ?? "en";

  useEffect(() => {
    if (!open) return;
    adminApi<Paged<AuditItem>>("audit-logs", { params: { per_page: 8 } })
      .then((r) => setItems(r.items))
      .catch(() => setItems([]));
  }, [open]);

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger
        render={<Button variant="ghost" size="icon" aria-label="Notifications" />}
      >
        <HugeiconsIcon icon={NotificationIcon} strokeWidth={2} />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-80">
        <DropdownMenuLabel>Recent activity</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {items.length === 0 && (
          <p className="px-3 py-6 text-center text-xs text-muted-foreground">
            Nothing new.
          </p>
        )}
        {items.map((it) => (
          <DropdownMenuItem key={it.id} className="flex-col items-start gap-0.5">
            <span className="text-xs font-medium">{it.action}</span>
            <span className="text-[11px] text-muted-foreground">
              {it.actor?.name ?? it.actorAdmin?.name ?? "System"} ·{" "}
              {timeAgo(it.createdAt)}
            </span>
          </DropdownMenuItem>
        ))}
        <DropdownMenuSeparator />
        <DropdownMenuItem
          render={<Link href={`/${locale}/admin/audit-logs`} />}
          className="justify-center text-xs font-medium"
        >
          View all
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
