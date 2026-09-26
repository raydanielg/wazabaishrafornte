import type { Metadata } from "next";
import { noIndex } from "@/lib/seo";
import { AccountChrome } from "@/components/account/account-chrome";

export const metadata: Metadata = { robots: noIndex };

export default function AccountLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AccountChrome>{children}</AccountChrome>;
}
