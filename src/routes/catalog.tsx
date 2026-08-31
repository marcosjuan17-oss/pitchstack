import { createFileRoute } from "@tanstack/react-router";
import { catalog } from "@/lib/stack/catalog.ts";
import { CATEGORY_LABELS, LEVEL_SHORT } from "@/lib/stack/labels.ts";
import { formatMoney } from "@/lib/stack/money.ts";

export const Route = createFileRoute("/catalog")({
  head: () => ({
    meta: [{ name: "robots", content: "noindex, nofollow" }],
  }),
  component: CatalogPage,
});

function CatalogPage() {
  return (
    <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-10 sm:px-6">
      <p className="text-xs font-medium uppercase tracking-wide text-muted">
        Product table
      </p>
      <h1 className="mt-1 font-display text-4xl font-medium tracking-tight">
        Catalog
      </h1>
      <p className="mt-3 max-w-2xl text-sm text-muted">
        {catalog.length} products used by the calculator. Hardware uses live
        Amazon.com links. Software uses live vendor pages. Prices are season
        estimates, not live quotes.
      </p>
      <div className="mt-8 overflow-x-auto rounded-[var(--radius-lg)] bg-surface shadow-[var(--shadow-border)]">
        <table className="w-full min-w-[52rem] text-left text-sm">
          <thead className="border-b border-border text-xs uppercase tracking-wide text-muted">
            <tr>
              <th className="px-3 py-3 font-medium">Name</th>
              <th className="px-3 py-3 font-medium">Vendor</th>
              <th className="px-3 py-3 font-medium">Cat.</th>
              <th className="px-3 py-3 font-medium">Group</th>
              <th className="px-3 py-3 font-medium">Levels</th>
              <th className="px-3 py-3 font-medium text-right">Est.</th>
            </tr>
          </thead>
          <tbody>
            {catalog.map((p) => (
              <tr key={p.id} className="border-b border-border/70 last:border-0">
                <td className="px-3 py-3">
                  <div className="font-medium">{p.name}</div>
                  <div className="text-xs text-muted">{p.id}</div>
                </td>
                <td className="px-3 py-3 text-muted">{p.vendor}</td>
                <td className="px-3 py-3">{CATEGORY_LABELS[p.category]}</td>
                <td className="px-3 py-3 text-muted">{p.group}</td>
                <td className="px-3 py-3 text-xs text-muted">
                  {p.levelTags.map((l) => LEVEL_SHORT[l]).join(", ")}
                </td>
                <td className="px-3 py-3 text-right tabular">
                  {formatMoney(p.priceEstimate, p.currency)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </main>
  );
}
