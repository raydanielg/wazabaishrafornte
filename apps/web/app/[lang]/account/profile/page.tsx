"use client";

 

import { useState } from "react";
import { toast } from "@workspace/ui/components/toast";
import { Button } from "@workspace/ui/components/button";
import { Input } from "@workspace/ui/components/input";
import { Label } from "@workspace/ui/components/label";
import { Avatar, AvatarFallback } from "@workspace/ui/components/avatar";
import { useAccount } from "@/components/account/account-gate";
import { getDictionary, isLocale } from "@/lib/i18n";
import { usePathname } from "next/navigation";
import { HugeiconsIcon } from "@hugeicons/react";
import { UserIcon, Mail01Icon, SmartPhoneIcon } from "@hugeicons/core-free-icons";

export default function ProfilePage() {
  const { user, refresh } = useAccount();
  const lang = usePathname().split("/")[1] ?? "en";
  const locale = isLocale(lang) ? lang : "en";
  const isSw = locale === "sw";
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const initials = (user.name ?? "?")
    .split(" ")
    .map((w) => w[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  async function save(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const name = (e.currentTarget.elements.namedItem("name") as HTMLInputElement).value.trim();
    setSaving(true);
    setError("");
    try {
      const res = await fetch("/api/app/auth/update-user", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name }),
      });
      if (!res.ok) throw new Error(isSw ? "Imeshindikana kuhifadhi" : "Could not save");
      toast.add({
        title: isSw ? "Wasifu umehifadhiwa" : "Profile saved",
      });
      refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="max-w-lg space-y-6">
      <div>
        <h1 className="text-xl font-semibold tracking-tight">
          {getDictionary(locale).accountNav.profile}
        </h1>
      </div>

      <div className="flex items-center gap-4 rounded-xl border border-border bg-card p-5">
        <Avatar className="size-14">
          <AvatarFallback className="text-lg">{initials}</AvatarFallback>
        </Avatar>
        <div>
          <p className="font-medium">{user.name}</p>
          <p className="text-sm text-muted-foreground">
            {user.email ?? user.phoneNumber}
          </p>
        </div>
      </div>

      <form onSubmit={save} className="space-y-4 rounded-xl border border-border bg-card p-5">
        <div className="space-y-1.5">
          <Label htmlFor="p-name">{getDictionary(locale).auth.name}</Label>
          <Input
            id="p-name"
            name="name"
            defaultValue={user.name}
            required
            icon={<HugeiconsIcon icon={UserIcon} strokeWidth={2} />}
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="p-email">{getDictionary(locale).auth.email}</Label>
          <Input
            id="p-email"
            value={user.email ?? ""}
            disabled
            icon={<HugeiconsIcon icon={Mail01Icon} strokeWidth={2} />}
          />
          <p className="text-xs text-muted-foreground">
            {isSw
              ? "Barua pepe haiwezi kubadilishwa hapa."
              : "Email cannot be changed here."}
          </p>
        </div>
        {user.phoneNumber && (
          <div className="space-y-1.5">
            <Label htmlFor="p-phone">{isSw ? "Simu" : "Phone"}</Label>
            <Input
              id="p-phone"
              value={user.phoneNumber}
              disabled
              icon={<HugeiconsIcon icon={SmartPhoneIcon} strokeWidth={2} />}
            />
          </div>
        )}
        {error && <p className="text-sm text-destructive">{error}</p>}
        <Button type="submit" disabled={saving}>
          {saving ? (isSw ? "Inahifadhi…" : "Saving…") : isSw ? "Hifadhi" : "Save changes"}
        </Button>
      </form>
    </div>
  );
}
