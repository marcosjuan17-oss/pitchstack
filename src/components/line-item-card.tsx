import { ArrowUpRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { CATEGORY_LABELS, TIER_LABELS } from "@/lib/stack/labels.ts";
import { formatMoney } from "@/lib/stack/money.ts";
import {
  affiliateRel,
  isAmazonUrl,
  offerCtaLabel,
  withAffiliateTag,
} from "@/lib/stack/affiliates.ts";
import { amazonLinkLevelDisclosure } from "@/lib/stack/monetize.ts";
import type { Currency, LineItem, Product, Tier } from "@/lib/stack/types.ts";
import { cn } from "@/lib/utils";

const TONE: Record<Tier, "must" | "should" | "skip"> = {
  must: "must",
  should: "should",
  skip: "skip",
};

type Props = {
  item: LineItem;
  product: Product;
  currency: Currency;
};

export function LineItemCard({ item, product, currency }: Props) {
  const skipped = item.tier === "skip";
  const href = withAffiliateTag(product.affiliateUrl);
  const amazon = isAmazonUrl(product.affiliateUrl);
  const paid = amazon ? amazonLinkLevelDisclosure() : null;
  return (
    <article
      className={cn(
        "flex flex-col gap-3 rounded-[var(--radius-lg)] bg-surface p-4 shadow-[var(--shadow-border)]",
        skipped && "opacity-80",
      )}
    >
      <div className="flex flex-wrap items-center gap-2">
        <Badge tone={TONE[item.tier]}>{TIER_LABELS[item.tier]}</Badge>
        <Badge tone="muted">{CATEGORY_LABELS[product.category]}</Badge>
        <span className="ml-auto text-right">
          <span className="block tabular text-sm font-medium">
            {formatMoney(item.estimatedCost, currency)}
          </span>
          <span className="block text-xs uppercase tracking-wide text-muted">
            estimate
          </span>
        </span>
      </div>
      <div>
        <h3 className="font-display text-lg font-medium leading-snug tracking-tight">
          {product.name}
        </h3>
        <p className="text-xs text-muted">{product.vendor}</p>
      </div>
      <p className="text-sm leading-relaxed text-muted">{item.reason}</p>
      <p className="rounded-[var(--radius-md)] bg-fg/[0.035] px-3 py-2 text-xs leading-relaxed text-muted">
        <span className="font-semibold text-fg">What it solves: </span>
        {product.notes}
      </p>
      <a
        href={href}
        target="_blank"
        rel={affiliateRel(product.affiliateUrl)}
        className={cn(
          "inline-flex h-11 items-center justify-center gap-2 rounded-[var(--radius-md)] px-4 text-sm font-medium transition-[opacity,transform] duration-[var(--motion-quick)] ease-[var(--ease-out)] active:scale-[0.96]",
          skipped
            ? "bg-fg/6 text-fg hover:bg-fg/10"
            : "bg-primary text-primary-fg shadow-sm hover:-translate-y-0.5 hover:shadow-md",
        )}
      >
        {offerCtaLabel(product.affiliateUrl, product.vendor)}
        <ArrowUpRight className="size-4" />
      </a>
      <p className="text-xs text-muted">
        {paid ? `${paid} · ` : null}
        {amazon
          ? "Opens Amazon.com. Check the live price there before you buy."
          : `Opens ${product.vendor}. Confirm current pricing on their site before you buy.`}
      </p>
    </article>
  );
}

