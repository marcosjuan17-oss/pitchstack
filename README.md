# PitchStack

Season-budget calculator for **US high school / rec / AAU basketball**, priced in **USD**. Operated from **Miami, FL**.

You enter roster, weekly hours, budget, and needs. The engine returns a ranked **Must / Should / Skip** stack of software, hardware, and one education item, with live Amazon and vendor links, plus a shareable results page.

Not a blog, chatbot, or recruiting tool. Recommendations are operational and budgetary only — never medical or legal advice.

Built so Amazon Associates (hardware) and Google AdSense (after approval) can be turned on **without faking tags, prices, or contact details**.

**Repo:** [github.com/marcosjuan17-oss/pitchstack](https://github.com/marcosjuan17-oss/pitchstack)  
**Agent handoff:** [CODEX.md](./CODEX.md) — paste that file into Codex (or any coding agent) before asking it to change this project.

## The three files you will touch most

1. [`src/lib/stack/monetize.ts`](src/lib/stack/monetize.ts) — Amazon Associates tag, AdSense publisher ID, contact email
2. [`src/lib/stack/catalog.ts`](src/lib/stack/catalog.ts) — add or edit a product / paste a vendor referral URL
3. [`src/lib/stack/recommend.ts`](src/lib/stack/recommend.ts) — ranking rules

## Monetization setup (do this before you take commissions)

Do not invent an Amazon store ID or an AdSense publisher ID. Amazon and Google claw back traffic that uses someone else’s codes.

1. Put the site on a domain you own. Both Amazon Associates and AdSense review the live host, not a preview.
2. Join [Amazon Associates](https://affiliate-program.amazon.com/) as a US publisher (Miami / Florida is eligible). You will need a W-9. The FTC disclosure and “(paid link)” markers are already in the UI; they switch to the official Amazon sentence once a store ID is set.
3. Paste your store ID (like `yourname-20`) into `SITE.amazonAssociatesTag`. Hardware buttons then append `?tag=` on Amazon.com links. Until then, “View on Amazon” still opens real Amazon pages — you just are not paid.
4. Apply to TeamSnap, Hudl, SportsEngine, Veo, and Booster partner programs separately. When you have a referral URL, replace the vendor homepage in `catalog.ts`.
5. AdSense: keep About / Privacy / Contact / Disclosure, then apply from a real domain. After approval, paste `pub-…` into `SITE.adsensePublisherId` and uncomment the line in `public/ads.txt`. Do not load the AdSense script on an unpublished host — Google will reject it.
6. Calculator-only sites are often rejected as thin content. The About page is original ranking copy on purpose. Do not hide affiliates. Do not add a fake inbox.

Until the Amazon tag is set, buttons still open real Amazon product/search pages. You just will not be paid.

## How to add a product

Open `src/lib/stack/catalog.ts`. Use `amazonDp("ASIN")`, `amazonSearch("query")`, or `vendorUrl("https://…")`.

Keep the catalog between ~25 and 40 SKUs. Prices stay estimates — never scrape live Amazon prices into the engine.

## How recommendations work

`recommend(inputs, catalog)` is a pure function.

- Always consider a basic med kit when roster ≥ 12
- Film tools only if Film is toggled; phone-tripod path under $600; Veo only on large budgets
- Registration software only if roster ≥ 25 **or** Registration is toggled
- If two products share a `group`, the cheaper level-matching one wins
- Education: at most one item, **Should** or **Skip**, never **Must**
- Must-cost is capped near 80% of budget when possible
- Output is 6–10 line items. Reasons mention this roster and budget

## Pages

| Path | What |
| --- | --- |
| `/` | Form + live results |
| `/r/:id` | Shareable result |
| `/about` | How ranking works |
| `/disclosure` | FTC / Amazon Associates disclosure |
| `/privacy` | Privacy (AdSense-ready) |
| `/contact` | Operator identity (Miami, FL) |
| `/catalog` | Product table (noindex) |

## Deploy (Vercel)

TanStack Start + Vite, Nitro `vercel` preset, framework slug `tanstack-start`. No auth, no database. Build command: `npm run build`. Node 22.

Put `amazonAssociatesTag` in `monetize.ts` (it is not a secret, Amazon puts it in the URL). Never commit someone else’s tag.
