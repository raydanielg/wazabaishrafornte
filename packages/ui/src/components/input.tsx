import * as React from "react"
import { Input as InputPrimitive } from "@base-ui/react/input"
import { cn } from "cn"

function Input({
  className,
  type,
  icon,
  density = "default",
  ...props
}: Omit<React.ComponentProps<"input">, "size"> & {
  icon?: React.ReactNode;
  /** "compact" = dense variant for admin/internal tools (theme radius-lg) */
  density?: "default" | "compact";
}) {
  const compact = density === "compact";
  const input = (
    <InputPrimitive
      type={type}
      data-slot="input"
      className={cn(
        "w-full min-w-0 border border-input bg-transparent py-1 text-base transition-all outline-none file:inline-flex file:h-6 file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 disabled:pointer-events-none disabled:cursor-not-allowed disabled:bg-input/50 disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20 md:text-sm dark:bg-input/30 dark:disabled:bg-input/80 dark:aria-invalid:border-destructive/50 dark:aria-invalid:ring-destructive/40",
        compact ? "h-9 rounded-lg" : "h-11 rounded-2xl",
        compact ? (icon ? "ps-9 pe-3" : "px-3") : icon ? "ps-10 pe-3.5" : "px-3.5",
        className
      )}
      {...props}
    />
  )
  if (!icon) return input
  return (
    <div className="relative">
      <span
        className={cn(
          "pointer-events-none absolute top-1/2 -translate-y-1/2 text-muted-foreground [&_svg]:size-4",
          compact ? "start-3" : "start-3.5"
        )}
      >
        {icon}
      </span>
      {input}
    </div>
  )
}

export { Input }
