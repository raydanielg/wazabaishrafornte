import Image from "next/image";

export function AuthShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-svh flex-col items-center justify-center gap-6 bg-muted p-6">
      <div className="flex items-center gap-2 font-medium">
        <Image
          src="/brand/logo.png"
          alt=""
          width={24}
          height={24}
          className="size-6 rounded-md"
        />
        Wazabiashara
      </div>
      <div className="w-full max-w-sm rounded-2xl border border-border bg-card p-6">
        {children}
      </div>
    </div>
  );
}
