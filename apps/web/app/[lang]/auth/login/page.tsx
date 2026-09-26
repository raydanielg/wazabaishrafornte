import { Suspense } from "react";
import Image from "next/image";
import { isLocale } from "@/lib/i18n";
import { notFound } from "next/navigation";
import { AdminLoginForm } from "@/components/admin/admin-login-form";

export default async function AdminLoginPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();

  return (
    <div className="flex min-h-svh flex-col items-center justify-center gap-6 bg-muted p-6 md:p-10">
      <div className="flex w-full max-w-sm flex-col gap-6">
        <div className="flex items-center gap-2 self-center font-medium">
          <Image
            src="/brand/logo.png"
            alt=""
            width={24}
            height={24}
            className="size-6 rounded-md"
          />
          Wazabiashara
        </div>
        <Suspense>
          <AdminLoginForm locale={lang} />
        </Suspense>
      </div>
    </div>
  );
}
