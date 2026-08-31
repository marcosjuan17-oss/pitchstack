import { useEffect, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { StackForm } from "@/components/stack-form";
import { StackResults } from "@/components/stack-results";
import { DEFAULT_INPUTS, type Inputs } from "@/lib/stack/types.ts";
import { decodeInputs, normalizeCalculatorInputs } from "@/lib/stack/share.ts";

const STORAGE_KEY = "pitchstack:inputs:v3";

export const Route = createFileRoute("/")({
  validateSearch: (raw: Record<string, unknown>): { s?: string } => ({
    s: typeof raw.s === "string" ? raw.s : undefined,
  }),
  component: Home,
});

function readStored(): Inputs | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Inputs;
    if (!parsed || typeof parsed.rosterSize !== "number") return null;
    return normalizeCalculatorInputs(parsed);
  } catch {
    return null;
  }
}

function Home() {
  const { s } = Route.useSearch();
  const [inputs, setInputs] = useState<Inputs>(
    () =>
      normalizeCalculatorInputs(
        (s ? decodeInputs(s) : null) ?? DEFAULT_INPUTS,
      ),
  );
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    if (s) {
      const fromShare = decodeInputs(s);
      if (fromShare) setInputs(normalizeCalculatorInputs(fromShare));
    } else {
      const stored = readStored();
      if (stored) setInputs(stored);
    }
    setHydrated(true);
  }, [s]);

  useEffect(() => {
    if (!hydrated) return;
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(inputs));
    } catch {
      /* ignore quota */
    }
  }, [inputs, hydrated]);

  return (
    <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-6 sm:px-6 sm:py-8">
      <div className="grid grid-cols-1 gap-10 lg:grid-cols-[minmax(0,24rem)_minmax(0,1fr)] lg:items-start">
        <div>
          <p className="mb-3 inline-flex rounded-full bg-accent/10 px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.12em] text-accent">
            Free basketball operations planner
          </p>
          <h1 className="font-display text-3xl font-medium tracking-tight sm:text-4xl">
            Spend the season budget on what your team will actually use.
          </h1>
          <p className="mt-3 max-w-xl text-base leading-relaxed text-muted">
            Set the roster, workload, budget, and priorities. PitchStack swaps
            the recommendations as those choices change, then ranks the result
            into Must, Should, and Skip. No signup and no sponsored placement.
          </p>
          <div className="mt-5 grid grid-cols-3 gap-2 text-center">
            <div className="rounded-[var(--radius-md)] bg-surface px-2 py-3 shadow-[var(--shadow-border)]">
              <strong className="block font-display text-xl">39</strong>
              <span className="text-xs text-muted">curated options</span>
            </div>
            <div className="rounded-[var(--radius-md)] bg-surface px-2 py-3 shadow-[var(--shadow-border)]">
              <strong className="block font-display text-xl">6–10</strong>
              <span className="text-xs text-muted">final picks</span>
            </div>
            <div className="rounded-[var(--radius-md)] bg-surface px-2 py-3 shadow-[var(--shadow-border)]">
              <strong className="block font-display text-xl">$0</strong>
              <span className="text-xs text-muted">to calculate</span>
            </div>
          </div>
          <aside
            id="stack-form"
            className="mt-6 rounded-[var(--radius-xl)] bg-surface p-5 shadow-[var(--shadow-border)] lg:sticky lg:top-6"
          >
            <h2 className="font-display text-xl font-medium tracking-tight">
              Your team
            </h2>
            <p className="mb-5 mt-1 text-sm text-muted">
              Every control can change the products, priority, or budget fit.
            </p>
            <StackForm
              inputs={inputs}
              onChange={(next) => setInputs(normalizeCalculatorInputs(next))}
            />
          </aside>
        </div>
        <StackResults inputs={inputs} />
      </div>
    </main>
  );
}

