# PitchStack — Codex / agent handoff

Work-mode brief for the next coding agent. Read this before changing code.

## What this is

**PitchStack** is an MVP **US high-school / rec / AAU basketball ops calculator**, not a blog, chatbot, CMS, store, or game.

A coach (or AD / parent) enters roster size, weekly practice hours, season budget, and needs. A pure function `recommend(inputs, catalog)` returns **6–10 Must / Should / Skip line items** across software, hardware, and one education item, with **real Amazon.com / vendor links** and a shareable `/r/:id` URL.

Operator: **Miami, FL, United States**. Currency: **USD only** in the UI. Sport: **basketball only** (v1).

## Product rules (do not violate)

- No medical advice, injury diagnosis, or recruiting-rules legal advice.
- Recommendations are operational and budgetary only.
- Never invent live Amazon/vendor prices. Catalog `priceEstimate` is labeled as an estimate (`PRICE_SOURCE` in `src/lib/stack/types.ts`).
- Never invent an Amazon Associates tag, AdSense publisher ID, or contact email. Leave them blank in `src/lib/stack/monetize.ts` until the operator pastes real values.
- Do not scrape Amazon. Curated catalog of **~25–40 SKUs**.
- Do not add auth, a database, a blog, accounts, payments, an admin CMS, or SEO-mill articles.
- Results **must change** when inputs change (not a static list).
- Affiliate disclosure must stay near the CTAs. Official Amazon sentence **“As an Amazon Associate I earn from qualifying purchases.”** and link-level **“(paid link)”** only when `SITE.amazonAssociatesTag` is set.
- Hardware CTAs: **View on Amazon**. Vendor CTAs: **Open {vendor}**. `rel="nofollow sponsored"` only on tagged Amazon URLs.
- Catalog page is internal (`noindex`).

## Stack

- **TanStack Start** + React 19 + Tailwind v4 + Vite 8, Node 22
- **Not Next.js.** Do not migrate to the App Router.
- Auth OFF, database OFF (`VITE_AUTH_ENABLED=false` in `.grok/app-env.json`)
- Deploy target: **Vercel** via Nitro `preset: "vercel"` in `vite.config.ts` (only on `build` / preview, never in `vite dev`)
- Dev preview in the Grok sandbox must stay on **`0.0.0.0:8080`** via `npm run dev` / `startup.sh`. Do not bind another port. Do not start `vite` without `scripts/with-app-env.mjs`.

## Files you will actually touch

| File | Why |
| --- | --- |
| `src/lib/stack/monetize.ts` | Amazon tag, AdSense `pub-…`, contact email, Miami identity |
| `src/lib/stack/catalog.ts` | Add/edit SKUs. Use `amazonSearch()`, `amazonDp()`, `vendorUrl()` |
| `src/lib/stack/recommend.ts` | Ranking rules |
| `src/lib/stack/affiliates.ts` | Tag attach at click-time; never bake `?tag=` into the catalog |
| `src/lib/stack/types.ts` | `Inputs`, `Product`, `DEFAULT_INPUTS`, thresholds |
| `src/routes/*` | Pages |
| `src/components/line-item-card.tsx` | CTA + estimate + paid-link label |

Tests: `src/lib/stack/recommend.test.ts`, `share.test.ts`, `affiliates.test.ts`. Run:

```bash
node --experimental-strip-types --test src/lib/stack/recommend.test.ts src/lib/stack/share.test.ts src/lib/stack/affiliates.test.ts
```

## Engine rules (`recommend`)

- Med kit **Must** if roster ≥ 12
- Film tools only if Film is toggled: phone tripod `< $600`, GoPro `$600–2499`, Veo Cam ≥ `$2500`
- Registration software Must if roster ≥ 25 **or** Registration is toggled
- One pick per `group`; cheaper level-matching product wins
- Education: at most one, **Should or Skip, never Must**
- Cap Must-cost near 80% of budget (demote extras; do not promote junk into Must just to fill budget)
- Output 6–10 line items. Reasons mention **this** roster and budget

`encodeInputs` format: `v1.{level}.{roster}.{hours}.{budget}.{currency}.{needsMask}` at `/r/$id`. `normalizeCalculatorInputs()` forces `sport: "basketball"` and `currency: "USD"`.

## Monetization (legit path)

1. Operator publishes on a **real domain** they own (Vercel + custom domain).
2. Join [Amazon Associates](https://affiliate-program.amazon.com/) (US, W-9). Paste store ID like `yourname-20` into `SITE.amazonAssociatesTag`.
3. Apply to TeamSnap / Hudl / SportsEngine / Veo / Booster **separately**. Until a referral URL exists, catalog rows use the vendor homepage.
4. AdSense only **after** Google approves the live domain. Then paste `pub-…` into `SITE.adsensePublisherId` and uncomment `public/ads.txt`. Do not load the AdSense script before approval.
5. Public contact email must be set in `SITE.contactEmail` before submitting either program.

Until the Amazon tag is set: buttons still open real Amazon/vendor pages; **no commission, no “As an Amazon Associate…” copy, no `(paid link)`**.

Do **not** click the operator’s own Amazon links to test commissions.

## Routes

| Path | Role |
| --- | --- |
| `/` | Form + live results |
| `/r/:id` | Shareable stack |
| `/about` | How ranking works + FAQ |
| `/disclosure` | FTC / Amazon disclosure |
| `/privacy` | Privacy (AdSense-ready) |
| `/contact` | Operator identity (Miami, FL) |
| `/catalog` | Internal product table, `noindex` |

## What not to do

- Do not add a blog, AI chat, recruiting tool, or medical protocol
- Do not enable auth or Postgres for this MVP
- Do not delete `startup.sh`, `src/router.tsx` named `getRouter()`, `<PreviewHostBridge />`, or `grokPwaPlugin()` — those are the Grok preview contract
- Do not put `og:*` / `twitter:card` in `__root.tsx` (PWA injector owns them)
- Do not recreate `vite.config.ts` in a way that drops the 8080 / 8081 port contract or the build-gated `nitro({ preset: "vercel", serverDir: "./server" })`
- Do not use example.com placeholder affiliate URLs
- Do not claim Associate / AdSense status before IDs are real

## Open operator inputs (still blank)

```
SITE.contactEmail          = ""
SITE.amazonAssociatesTag   = ""
SITE.adsensePublisherId    = ""
```

When the operator sends real values, put them only in `src/lib/stack/monetize.ts`.

## Local / Vercel

- `npm run dev` — Vite on `0.0.0.0:8080`
- `npm run typecheck`
- `npm run build` — Nitro emits `.vercel/output` (Vercel Build Output API)
- Framework on Vercel: **TanStack Start** (`tanstack-start`), build command `npm run build`, Node 22
- No secrets in the repo. Amazon tag is not a secret (it appears in URLs) but never commit someone else’s tag.
