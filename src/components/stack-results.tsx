import { useMemo } from "react";
import { Link } from "@tanstack/react-router";
import { Check, Copy, SlidersHorizontal } from "lucide-react";
import { toast } from "sonner";
import { useState } from "react";
import { BudgetBar } from "@/components/budget-bar";
import { DisclosureBanner } from "@/components/disclosure-banner";
import { LineItemCard } from "@/components/line-item-card";
import { Button } from "@/components/ui/button";
import { catalogById } from "@/lib/stack/catalog.ts";
import { LEVEL_LABELS } from "@/lib/stack/labels.ts";
import { summarizeStack } from "@/lib/stack/recommend.ts";
import { encodeInputs } from "@/lib/stack/share.ts";
import type { Inputs, LineItem, Tier } from "@/lib/stack/types.ts";

const TIER_ORDER: Tier[] = ["must", "should", "skip"];
const TIER_COPY: Record<Tier, string> = {
  must: "Buy these first. Safety and shared kit that the season cannot run without.",
  should: "Worth it if the Must list still fits. Drop these if you go over.",
  skip: "Not this season. Cheaper workaround is in the reason.",
};

type Props = {
  inputs: Inputs;
  shareMode?: boolean;
};

export function StackResults({ inputs, shareMode = false }: Props) {
  const summary = useMemo(() => summarizeStack(inputs), [inputs]);
  const [copied, setCopied] = useState(false);

  const grouped = useMemo(() => {
    const map: Record<Tier, LineItem[]> = { must: [], should: [], skip: [] };
    for (const item of summary.items) map[item.tier].push(item);
    return map;
  }, [summary.items]);

  const copyShare = async () => {
    const id = encodeInputs(inputs);
    const url = `${window.location.origin}/r/${id}`;
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      toast.success("Share link copied");
      window.setTimeout(() => setCopied(false), 1600);
    } catch {
      toast.error("Could not copy the link");
    }
  };

  return (
    <div id="stack-results" className="flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <p className="text-xs font-medium uppercase tracking-wide text-muted">
          Stack for this roster
        </p>
        <h2 className="font-display text-3xl font-medium tracking-tight">
          {inputs.rosterSize} players · {LEVEL_LABELS[inputs.level]}
        </h2>
        <p className="text-sm text-muted">
          {inputs.practiceHoursPerWeek} practice hours/week · basketball ·{" "}
          {inputs.currency}
        </p>
      </div>

      <BudgetBar summary={summary} currency={inputs.currency} />
      <DisclosureBanner />

      <div className="flex flex-col gap-2 sm:flex-row">
        <Button type="button" onClick={copyShare} className="flex-1">
          {copied ? <Check className="size-4" /> : <Copy className="size-4" />}
          {copied ? "Copied" : "Copy share link"}
        </Button>
        {shareMode ? (
          <Link
            to="/"
            search={{ s: encodeInputs(inputs) }}
            className="inline-flex h-11 flex-1 items-center justify-center gap-2 rounded-[var(--radius-md)] bg-surface px-4 text-sm font-medium text-fg shadow-[var(--shadow-border)] transition-[opacity,transform] duration-[var(--motion-quick)] ease-[var(--ease-out)] hover:shadow-[var(--shadow-border-hover)] active:scale-[0.96]"
          >
            <SlidersHorizontal className="size-4" />
            Adjust inputs
          </Link>
        ) : (
          <Button
            type="button"
            variant="secondary"
            className="flex-1"
            onClick={() =>
              document.getElementById("stack-form")?.scrollIntoView({
                behavior: "smooth",
              })
            }
          >
            <SlidersHorizontal className="size-4" />
            Adjust inputs
          </Button>
        )}
      </div>

      {TIER_ORDER.map((tier) => {
        const items = grouped[tier];
        if (items.length === 0) return null;
        return (
          <section key={tier} className="flex flex-col gap-3">
            <div>
              <h3 className="font-display text-xl font-medium tracking-tight">
                {tier === "must" ? "Must" : tier === "should" ? "Should" : "Skip"}
              </h3>
              <p className="text-sm text-muted">{TIER_COPY[tier]}</p>
            </div>
            <div className="grid grid-cols-1 gap-3">
              {items.map((item) => {
                const product = catalogById[item.productId];
                if (!product) return null;
                return (
                  <LineItemCard
                    key={item.productId}
                    item={item}
                    product={product}
                    currency={inputs.currency}
                  />
                );
              })}
            </div>
          </section>
        );
      })}
    </div>
  );
}
