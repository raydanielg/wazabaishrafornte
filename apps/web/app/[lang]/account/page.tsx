"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";

export default function AccountIndex() {
  const router = useRouter();
  const pathname = usePathname();
  useEffect(() => {
    const locale = pathname.split("/")[1] ?? "en";
    router.replace(`/${locale}/account/profile`);
  }, [pathname, router]);
  return null;
}
