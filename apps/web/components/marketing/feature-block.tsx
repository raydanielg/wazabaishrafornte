import { HugeiconsIcon } from "@hugeicons/react";
import { CheckIcon } from "@hugeicons/core-free-icons";
import { cn } from "@workspace/ui/lib/utils";

/** Alternating large feature block (§13). */
export function FeatureBlock({
  label,
  title,
  description,
  points,
  visual,
  reversed,
}: {
  label: string;
  title: string;
  description: string;
  points: string[];
  visual: React.ReactNode;
  reversed?: boolean;
}) {
  return (
    <div className="grid items-center gap-8 md:grid-cols-2 md:gap-12">
      <div className={cn(reversed && "md:order-2")}>
        <p className="text-xs font-semibold tracking-widest text-muted-foreground uppercase">
          {label}
        </p>
        <h3 className="mt-2 text-xl font-semibold tracking-tight text-foreground sm:text-2xl">
          {title}
        </h3>
        <p className="mt-3 leading-relaxed text-muted-foreground">{description}</p>
        <ul className="mt-5 space-y-2.5">
          {points.map((p) => (
            <li key={p} className="flex items-start gap-2.5 text-sm">
              <HugeiconsIcon
                icon={CheckIcon}
                className="mt-0.5 size-4 shrink-0 text-emerald-600"
                strokeWidth={2.5}
              />
              <span className="text-foreground/90">{p}</span>
            </li>
          ))}
        </ul>
      </div>
      <div className={cn(reversed && "md:order-1")}>{visual}</div>
    </div>
  );
}
