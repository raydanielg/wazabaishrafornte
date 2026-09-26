"use client";

import { useState } from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  UserIcon,
  Mail01Icon,
  TagIcon,
  SentIcon,
} from "@hugeicons/core-free-icons";
import { Button } from "@workspace/ui/components/button";
import { Input } from "@workspace/ui/components/input";
import { Textarea } from "@workspace/ui/components/textarea";
import { Label } from "@workspace/ui/components/label";
import type { Dictionary } from "@/lib/i18n";

type Status = "idle" | "sending" | "success" | "error";

export function ContactForm({ dict }: { dict: Dictionary }) {
  const [status, setStatus] = useState<Status>("idle");
  const [errors, setErrors] = useState<Record<string, string>>({});

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const data = {
      name: (form.elements.namedItem("name") as HTMLInputElement).value.trim(),
      contact: (form.elements.namedItem("contact") as HTMLInputElement).value.trim(),
      subject: (form.elements.namedItem("subject") as HTMLInputElement).value.trim(),
      message: (form.elements.namedItem("message") as HTMLTextAreaElement).value.trim(),
    };
    const errs: Record<string, string> = {};
    if (!data.name) errs.name = dict.contact.required;
    if (!data.contact) errs.contact = dict.contact.required;
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.contact) && !/^\+?[0-9\s-]{7,}$/.test(data.contact))
      errs.contact = dict.contact.invalidEmail;
    if (!data.subject) errs.subject = dict.contact.required;
    if (!data.message) errs.message = dict.contact.required;
    setErrors(errs);
    if (Object.keys(errs).length) return;

    setStatus("sending");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      setStatus(res.ok ? "success" : "error");
      if (res.ok) form.reset();
    } catch {
      setStatus("error");
    }
  }

  if (status === "success") {
    return (
      <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-6 text-center dark:border-emerald-900 dark:bg-emerald-950/30">
        <p className="text-sm font-medium text-emerald-800 dark:text-emerald-200">
          {dict.contact.success}
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} noValidate className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-1.5">
          <Label htmlFor="c-name">{dict.contact.name}</Label>
          <Input
            id="c-name"
            name="name"
            placeholder={dict.contact.namePlaceholder}
            aria-invalid={!!errors.name}
            icon={<HugeiconsIcon icon={UserIcon} strokeWidth={2} />}
          />
          {errors.name && (
            <p className="text-xs text-destructive">{errors.name}</p>
          )}
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="c-contact">{dict.contact.email}</Label>
          <Input
            id="c-contact"
            name="contact"
            placeholder={dict.contact.emailPlaceholder}
            aria-invalid={!!errors.contact}
            icon={<HugeiconsIcon icon={Mail01Icon} strokeWidth={2} />}
          />
          {errors.contact && (
            <p className="text-xs text-destructive">{errors.contact}</p>
          )}
        </div>
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="c-subject">{dict.contact.subject}</Label>
        <Input
          id="c-subject"
          name="subject"
          placeholder={dict.contact.subjectPlaceholder}
          aria-invalid={!!errors.subject}
          icon={<HugeiconsIcon icon={TagIcon} strokeWidth={2} />}
        />
        {errors.subject && (
          <p className="text-xs text-destructive">{errors.subject}</p>
        )}
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="c-message">{dict.contact.message}</Label>
        <Textarea
          id="c-message"
          name="message"
          rows={5}
          placeholder={dict.contact.messagePlaceholder}
          aria-invalid={!!errors.message}
        />
        {errors.message && (
          <p className="text-xs text-destructive">{errors.message}</p>
        )}
      </div>
      {status === "error" && (
        <p className="text-sm text-destructive">{dict.contact.error}</p>
      )}
      <Button type="submit" disabled={status === "sending"} className="w-full sm:w-auto">
        <HugeiconsIcon icon={SentIcon} strokeWidth={2} />
        {status === "sending" ? dict.contact.sending : dict.contact.send}
      </Button>
    </form>
  );
}
