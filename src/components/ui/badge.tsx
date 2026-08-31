import type { HTMLAttributes } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium tracking-wide uppercase",
  {
    variants: {
      tone: {
        must: "bg-primary text-primary-fg",
        should: "bg-fg/8 text-fg",
        skip: "bg-transparent text-muted shadow-[var(--shadow-border)]",
        muted: "bg-fg/6 text-muted",
        ok: "bg-ok/12 text-ok",
        danger: "bg-danger/12 text-danger",
      },
    },
    defaultVariants: { tone: "muted" },
  },
);

export function Badge({
  className,
  tone,
  ...props
}: HTMLAttributes<HTMLSpanElement> & VariantProps<typeof badgeVariants>) {
  return <span className={cn(badgeVariants({ tone }), className)} {...props} />;
}
