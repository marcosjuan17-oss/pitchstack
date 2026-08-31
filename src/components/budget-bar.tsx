import { formatMoney } from "@/lib/stack/money.ts";
import type { Currency, StackSummary } from "@/lib/stack/types.ts";
import { cn } from "@/lib/utils";

type Props = {
  summary: StackSummary;
  currency: Currency;
};

export function BudgetBar({ summary, currency }: Props) {
  const { budget, recommendedTotal, delta, overBudget, mustTotal, shouldTotal } =
    summary;
  const max = Math.max(budget, recommendedTotal, 1);
  const budgetPct = Math.min(100, (budget / max) * 100);
  const recPct = Math.min(100, (recommendedTotal / max) * 100);
  const mustPct = Math.min(100, (mustTotal / max) * 100);

  return (
    <section className="rounded-[var(--radius-xl)] bg-surface p-4 shadow-[var(--shadow-border)] sm:p-5">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="text-xs font-medium uppercase tracking-wide text-muted">
            Estimated season cost vs budget
          </p>
          <p className="mt-1 font-display text-2xl font-medium tracking-tight tabular sm:text-3xl">
            {formatMoney(recommendedTotal, currency)}
          </p>
          <p className="text-sm text-muted">
            Must {formatMoney(mustTotal, currency)} · Should{" "}
            {formatMoney(shouldTotal, currency)}
          </p>
        </div>
        <p
          className={cn(
            "rounded-full px-3 py-1 text-sm font-medium",
            overBudget ? "bg-danger/12 text-danger" : "bg-ok/12 text-ok",
          )}
        >
          {overBudget ? "Over budget " : "Under budget "}
          <span className="tabular">
            {formatMoney(Math.abs(delta), currency)}
          </span>
        </p>
      </div>
      <div className="mt-5 space-y-2">
        <div className="relative h-3 overflow-hidden rounded-full bg-fg/8">
          <div
            className="absolute inset-y-0 left-0 bg-primary/35"
            style={{ width: `${recPct}%` }}
          />
          <div
            className="absolute inset-y-0 left-0 bg-primary"
            style={{ width: `${mustPct}%` }}
          />
        </div>
        <div className="flex justify-between text-xs text-muted">
          <span>Stack (Must fill)</span>
          <span className="tabular">
            Budget {formatMoney(budget, currency)}
            <span className="sr-only"> ({budgetPct.toFixed(0)}%)</span>
          </span>
        </div>
      </div>
    </section>
  );
}
