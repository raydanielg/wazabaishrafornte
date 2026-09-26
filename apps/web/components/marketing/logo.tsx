import Image from "next/image";
import Link from "next/link";
import { localizedPath, type Locale } from "@/lib/i18n";

export function Logo({ locale, href }: { locale: Locale; href?: string }) {
  return (
    <Link
      href={href ?? localizedPath(locale, "/")}
      className="flex items-center gap-2.5 font-semibold tracking-tight text-foreground"
      aria-label="Wazabiashara"
    >
      <Image
        src="/brand/logo.png"
        alt=""
        width={28}
        height={28}
        className="size-7 rounded-md"
        priority
      />
      <span className="text-lg">Wazabiashara</span>
    </Link>
  );
}
