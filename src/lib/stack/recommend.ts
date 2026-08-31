import { catalog as defaultCatalog } from "./catalog.ts";
import { LEVEL_SHORT } from "./labels.ts";
import { formatMoney, toInputCurrency } from "./money.ts";
import {
  FILM_CHEAP_THRESHOLD,
  FILM_PREMIUM_THRESHOLD,
  MUST_BUDGET_HIGH,
  type Inputs,
  type LineItem,
  type Product,
  type StackSummary,
  type Tier,
} from "./types.ts";

type Candidate = {
  product: Product;
  tier: Tier;
  reason: string;
  estimatedCost: number;
  /** Higher stays Must longer. */
  priority: number;
  locked: boolean;
  importantSkip: boolean;
};

function money(inputs: Inputs, eur: number): number {
  return toInputCurrency(eur, inputs.currency);
}

function fmt(inputs: Inputs, eur: number): string {
  return formatMoney(money(inputs, eur), inputs.currency);
}

function rosterPhrase(inputs: Inputs): string {
  return `${inputs.rosterSize}-player ${LEVEL_SHORT[inputs.level]} roster`;
}

function budgetPhrase(inputs: Inputs): string {
  return `${fmt(inputs, inputs.budget)} season budget`;
}

function eligibleProducts(inputs: Inputs, catalog: Product[]): Product[] {
  return catalog.filter(
    (p) =>
      p.sportTags.includes(inputs.sport) && p.levelTags.includes(inputs.level),
  );
}

function matchesConstraints(p: Product, inputs: Inputs): boolean {
  if (p.minRoster != null && inputs.rosterSize < p.minRoster) return false;
  if (p.maxRoster != null && inputs.rosterSize > p.maxRoster) return false;
  if (p.minBudget != null && inputs.budget < p.minBudget) return false;
  if (p.maxBudget != null && inputs.budget > p.maxBudget) return false;
  return true;
}

function pickGroup(
  group: string,
  inputs: Inputs,
  pool: Product[],
): Product | undefined {
  const inGroup = pool.filter((p) => p.group === group);
  const matched = inGroup.filter((p) => matchesConstraints(p, inputs));
  const usable = (
    matched.length > 0
      ? matched
      : inGroup.filter((p) => {
          if (p.minRoster != null && inputs.rosterSize < p.minRoster)
            return false;
          if (p.maxRoster != null && inputs.rosterSize > p.maxRoster)
            return false;
          return true;
        })
  ).sort((a, b) => a.priceEstimate - b.priceEstimate);
  return usable[0];
}

function hasNeed(inputs: Inputs, need: Inputs["needs"][number]): boolean {
  return inputs.needs.includes(need);
}

function add(
  out: Candidate[],
  seen: Set<string>,
  product: Product | undefined,
  inputs: Inputs,
  tier: Tier,
  reason: string,
  priority: number,
  extra?: { locked?: boolean; importantSkip?: boolean },
): void {
  if (!product) return;
  if (seen.has(product.id)) return;
  // One Must/Should per group. Skip may still list the premium alternative.
  if (tier !== "skip" && seen.has(`group:${product.group}`)) return;
  seen.add(product.id);
  if (tier !== "skip") seen.add(`group:${product.group}`);
  out.push({
    product,
    tier,
    reason,
    estimatedCost: money(inputs, product.priceEstimate),
    priority,
    locked: extra?.locked ?? false,
    importantSkip: extra?.importantSkip ?? false,
  });
}

function collectCandidates(inputs: Inputs, catalog: Product[]): Candidate[] {
  const pool = eligibleProducts(inputs, catalog);
  const out: Candidate[] = [];
  const seen = new Set<string>();
  const r = rosterPhrase(inputs);
  const b = budgetPhrase(inputs);

  // Scrimmage vests become useful with two full groups, but are never a
  // universal Must. This keeps the first result from being the same generic
  // starter kit for every team.
  add(
    out,
    seen,
    pickGroup("training-bibs", inputs, pool),
    inputs,
    inputs.rosterSize >= 12 ? "must" : "should",
    inputs.rosterSize >= 12
      ? `${r}: one numbered 12-vest set creates two full practice groups and makes stat tracking easier.`
      : `${r}: bibs help, but a small side can mark shirts for a season if ${b} is tight.`,
    72,
  );

  // Balls: Must from 10 players. Youth pack vs club pack via catalog constraints.
  add(
    out,
    seen,
    pickGroup("match-balls", inputs, pool),
    inputs,
    inputs.rosterSize >= 10 ? "must" : "should",
    inputs.rosterSize >= 10
      ? `${r}: enough balls that ball-handling stations are not 8-per-ball. Replace a pack once per season.`
      : `${r}: a full pack is optional at this size — borrow from the gym cage first.`,
    78,
  );

  // The baseline operating item changes with the actual program instead of
  // forcing cones into every result.
  if (inputs.level === "youth" && inputs.practiceHoursPerWeek >= 3) {
    add(
      out,
      seen,
      pickGroup("practice-layout", inputs, pool),
      inputs,
      inputs.budget >= 350 ? "should" : "skip",
      inputs.budget >= 350
        ? `${r} at ${inputs.practiceHoursPerWeek} h/week: numbered Shot Spotz give young players visible spacing and rotation cues.`
        : `Skip station markers on ${b}; use floor-safe tape already owned by the gym.`,
      34,
    );
  } else if (inputs.level === "high_school" || inputs.level === "club") {
    add(
      out,
      seen,
      pickGroup("tactics", inputs, pool),
      inputs,
      inputs.budget >= 500 ? "should" : "skip",
      inputs.budget >= 500
        ? `${r}: one double-sided full-court / half-court board is useful for timeouts and scout-team walkthroughs.`
        : `Skip a new coaching board on ${b}; print and laminate a court sheet for this season.`,
      33,
    );
  } else {
    add(
      out,
      seen,
      pickGroup("coach-pocket", inputs, pool),
      inputs,
      "should",
      `${r}: a water-resistant stopwatch makes timed stations easier to run with student staff.`,
      33,
    );
  }

  // Med kit: always consider if roster >= 12; also if the toggle is on.
  // Operational only — never injury advice.
  const medkitOn = inputs.rosterSize >= 12 || hasNeed(inputs, "medkit");
  if (medkitOn) {
    const med = pickGroup("medkit", inputs, pool);
    const mustMed = inputs.rosterSize >= 12;
    add(
      out,
      seen,
      med,
      inputs,
      mustMed ? "must" : "should",
      mustMed
        ? `${r}: a basic sideline first-aid kit is the operational safety item to budget. Not a diagnosis kit, not a reason to change training hours.`
        : `${r} is under 12, so a full kit is optional. You toggled medical kit — keep a small kit in the coach bag.`,
      95,
      { locked: mustMed },
    );
    if (hasNeed(inputs, "medkit") && inputs.budget >= 400) {
      add(
        out,
        seen,
        pickGroup("med-ice", inputs, pool),
        inputs,
        "should",
        `${r}: disposable ice packs restock the kit through a season. Still not medical advice.`,
        40,
      );
    }
  }

  // Registration software only if roster >= 25 or needs includes registration.
  if (inputs.rosterSize >= 25 || hasNeed(inputs, "registration")) {
    const reg = pickGroup("registration", inputs, pool);
    add(
      out,
      seen,
      reg,
      inputs,
      "must",
      inputs.rosterSize >= 25
        ? `${r}: at 25+ players, parent payments and attendance need a real tool. Cheapest level-matching option: ${reg?.name ?? "team app"}.`
        : `${r}: you asked for registration/payments. ${reg?.name ?? "A team app"} is the cheaper match for this level.`,
      85,
    );
  } else if (inputs.rosterSize >= 12) {
    add(
      out,
      seen,
      pickGroup("team-comms", inputs, pool),
      inputs,
      "should",
      `${r} is under 25 and registration is off — a light comms app is enough. WhatsApp works as the free workaround.`,
      50,
    );
  } else {
    const comms = pickGroup("team-comms", inputs, pool);
    add(
      out,
      seen,
      comms,
      inputs,
      "skip",
      `${r}: skip paid comms. A parent WhatsApp/Signal group covers a side this small. ${comms ? `${comms.name} is the paid option if the group gets messy.` : ""}`,
      20,
      { importantSkip: true },
    );
  }

  // Film tools only if needs includes film. Cheap phone-tripod path under threshold.
  if (hasNeed(inputs, "film")) {
    const capture = pickGroup("film-capture", inputs, pool);
    const software = pickGroup("film-software", inputs, pool);
    if (inputs.budget < FILM_CHEAP_THRESHOLD) {
      add(
        out,
        seen,
        capture,
        inputs,
        "must",
        `${r} and ${b}: stay on the phone-tripod path. A dedicated camera would consume the season budget on its own.`,
        70,
        { locked: false },
      );
      const gopro = pool.find((p) => p.id === "gopro-hero");
      add(
        out,
        seen,
        gopro,
        inputs,
        "skip",
        `Skip ${gopro?.name ?? "a mid-range camera"} this season. At ${fmt(inputs, gopro?.priceEstimate ?? 249)} it is too large a share of ${b}. Film with a phone on a tripod.`,
        25,
        { importantSkip: true },
      );
    } else if (inputs.budget < FILM_PREMIUM_THRESHOLD) {
      add(
        out,
        seen,
        capture,
        inputs,
        "must",
        `${r} and ${b}: a mid-range camera covers weekly clips without a Veo-sized hole in the budget.`,
        70,
      );
      const veo = pool.find((p) => p.id === "veo-cam");
      add(
        out,
        seen,
        veo,
        inputs,
        "skip",
        `Skip Veo this season. At ${fmt(inputs, veo?.priceEstimate ?? 2690)} it overruns ${b}. Use a GoPro or phone until the budget is in the $2,500+ range.`,
        22,
        { importantSkip: true },
      );
    } else {
      add(
        out,
        seen,
        capture,
        inputs,
        "should",
        `${r} and ${b}: a dedicated match camera fits. Keep it Should, not Must — film is a workflow, not a safety item.`,
        60,
      );
    }
    if (software && inputs.budget >= 500) {
      add(
        out,
        seen,
        software,
        inputs,
        inputs.budget >= 1200 ? "should" : "skip",
        inputs.budget >= 1200
          ? `${r}: pair capture with ${software.name} so clips are tagged, not dumped in a WhatsApp chat.`
          : `Skip ${software.name} this season. ${b} should stay on capture hardware; a shared Drive folder is the workaround.`,
        55,
      );
    }
  }

  // Travel
  if (hasNeed(inputs, "travel")) {
    const travelSoft = pickGroup("travel-software", inputs, pool);
    add(
      out,
      seen,
      travelSoft,
      inputs,
      inputs.budget >= 400 ? "should" : "skip",
      inputs.budget >= 400
        ? `${r}: a tournament/away-day planner keeps carpools and kick-off times in one place.`
        : `Skip paid travel software. ${b} is tight — a shared spreadsheet and parent carpool thread is the workaround.`,
      45,
    );
    const duffels = pickGroup("travel-kit", inputs, pool);
    add(
      out,
      seen,
      duffels,
      inputs,
      inputs.budget >= 600 ? "should" : "skip",
      inputs.budget >= 600
        ? `${r}: two kit duffels separate balls from the med bag on away days.`
        : `Skip new duffels. ${b} — reuse club bags this season.`,
      35,
    );
    if (inputs.rosterSize >= 16 || inputs.budget >= 1000) {
      add(
        out,
        seen,
        pickGroup("equipment-labeling", inputs, pool),
        inputs,
        "should",
        `${r}: label chargers, cameras, ball bags, and travel bins so shared gear returns after tournaments.`,
        38,
      );
    }
  }

  // Fundraising: asked for, or budget is too low to cover a basic field kit.
  const broke = inputs.budget < 800;
  if (hasNeed(inputs, "fundraising") || broke) {
    const fund = pickGroup("fundraising", inputs, pool);
    add(
      out,
      seen,
      fund,
      inputs,
      broke || hasNeed(inputs, "fundraising") ? "should" : "skip",
      broke
        ? `${b} is below a full ops kit. A cheap GoFundMe / booster page is the operational way to close the gap — not a larger software stack.`
        : `${r}: you toggled fundraising. Keep the cheapest tool; skip a full sponsor agency.`,
      48,
    );
  }

  // S&C only if toggled. If budget is too low, Skip with a bodyweight workaround.
  if (hasNeed(inputs, "s_and_c")) {
    if (inputs.budget < 400) {
      const bands = pickGroup("s_and_c-bands", inputs, pool);
      add(
        out,
        seen,
        bands,
        inputs,
        "skip",
        `Skip a paid S&C kit. ${b} should stay on field + safety. Bodyweight warm-ups and a club gym corner are the workaround — no hours-based injury claim.`,
        18,
        { importantSkip: true },
      );
    } else {
      add(
        out,
        seen,
        pickGroup("s_and_c-bands", inputs, pool),
        inputs,
        "should",
        `${r} with ${inputs.practiceHoursPerWeek} h/week: a band set covers warm-up stations without a gym contract.`,
        44,
      );
      if (inputs.practiceHoursPerWeek >= 5) {
        add(
          out,
          seen,
          pickGroup("s_and_c-footwork", inputs, pool),
          inputs,
          "should",
          `${inputs.practiceHoursPerWeek} practice hours/week is enough to justify one footwork station. Still optional against ${b}.`,
        36,
        );
      }
      if (inputs.budget >= 900) {
        add(
          out,
          seen,
          pickGroup("s_and_c-hr", inputs, pool),
          inputs,
          "should",
          `${b}: one coach HR strap is a demo tool, not a 16-player GPS fleet.`,
          28,
        );
      }
    }
  }

  // Education: at most one, Should or Skip only — never Must.
  const edu = pickGroup("education", inputs, pool);
  if (edu) {
    const eduTier: Tier = inputs.budget >= 500 ? "should" : "skip";
    add(
      out,
      seen,
      edu,
      inputs,
      eduTier,
      eduTier === "should"
        ? `${r}: one staff education item this season — ${edu.name}. Not a Must; session quality comes from the field kit first.`
        : `Skip a paid course/book this season. ${b} should stay on shared kit. NFHS and USA Basketball public docs are the workaround.`,
      15,
    );
  }

  // Optional extras that fill a thin stack on healthier budgets.
  if (inputs.practiceHoursPerWeek >= 5 && inputs.budget >= 600) {
    add(
      out,
      seen,
      pickGroup("hydration", inputs, pool),
      inputs,
      "should",
      `${inputs.practiceHoursPerWeek} h/week on a ${r}: a shared water carrier is cheaper than 16 bottles.`,
      32,
    );
  }
  if (
    inputs.budget >= 900 &&
    inputs.rosterSize >= 12 &&
    inputs.level !== "high_school" &&
    inputs.level !== "club"
  ) {
    add(
      out,
      seen,
      pickGroup("tactics", inputs, pool),
      inputs,
      "should",
      `${r}: one tactics clipboard for staff. Skip extras for assistants this season.`,
      30,
    );
  }
  if (
    inputs.budget >= 1200 &&
    inputs.rosterSize >= 14 &&
    inputs.practiceHoursPerWeek >= 5
  ) {
    add(
      out,
      seen,
      pickGroup("shooting-efficiency", inputs, pool),
      inputs,
      "should",
      `${r}: a hoop-mounted shot return keeps one shooting station moving without assigning a rebounder.`,
      26,
    );
  }
  add(
    out,
    seen,
    pickGroup("ball-care", inputs, pool),
    inputs,
    inputs.rosterSize >= 10 ? "should" : "skip",
    `${r}: bag + pump keeps the ball pack usable. Cheap if you already bought balls.`,
    24,
  );

  return out;
}

function applyMustCap(candidates: Candidate[], inputs: Inputs): void {
  const high = inputs.budget * MUST_BUDGET_HIGH;

  const locked = candidates.filter((c) => c.tier === "must" && c.locked);
  const flexible = candidates
    .filter((c) => c.tier === "must" && !c.locked)
    .sort((a, b) => b.priority - a.priority);

  let total = locked.reduce((s, c) => s + c.estimatedCost, 0);
  for (const item of flexible) {
    if (item.product.category === "education") {
      item.tier = "should";
      continue;
    }
    if (total + item.estimatedCost <= high || inputs.budget <= 0) {
      total += item.estimatedCost;
    } else {
      item.tier = "should";
      item.reason += ` Moved to Should so Must stays near 60–80% of ${budgetPhrase(inputs)}.`;
    }
  }

  for (const item of candidates) {
    if (item.product.category === "education" && item.tier === "must") {
      item.tier = "should";
    }
  }
}

function assemble(candidates: Candidate[]): Candidate[] {
  const must = candidates
    .filter((c) => c.tier === "must")
    .sort((a, b) => b.priority - a.priority);
  const should = candidates
    .filter((c) => c.tier === "should")
    .sort((a, b) => b.priority - a.priority);
  const skip = candidates
    .filter((c) => c.tier === "skip")
    .sort((a, b) => {
      if (a.importantSkip !== b.importantSkip) return a.importantSkip ? -1 : 1;
      return b.priority - a.priority;
    });

  const out: Candidate[] = [...must];
  for (const item of should) {
    if (out.length >= 9) break;
    out.push(item);
  }
  for (const item of skip) {
    if (out.length >= 10) break;
    if (out.length < 6 || item.importantSkip) out.push(item);
  }
  if (out.length < 6) {
    for (const item of should) {
      if (out.length >= 6) break;
      if (!out.includes(item)) out.push(item);
    }
  }
  if (out.length < 6) {
    for (const item of skip) {
      if (out.length >= 6) break;
      if (!out.includes(item)) out.push(item);
    }
  }
  return out.slice(0, 10);
}

function toLineItems(candidates: Candidate[]): LineItem[] {
  const order: Record<Tier, number> = { must: 0, should: 1, skip: 2 };
  return [...candidates]
    .sort((a, b) => {
      if (order[a.tier] !== order[b.tier]) return order[a.tier] - order[b.tier];
      return b.priority - a.priority;
    })
    .map((c) => ({
      productId: c.product.id,
      tier: c.tier,
      reason: c.reason.trim(),
      estimatedCost: c.estimatedCost,
    }));
}

/**
 * Pure recommendation engine. Same inputs + catalog ⇒ same stack.
 */
export function recommend(
  inputs: Inputs,
  catalog: Product[] = defaultCatalog,
): LineItem[] {
  const candidates = collectCandidates(inputs, catalog);
  applyMustCap(candidates, inputs);
  return toLineItems(assemble(candidates));
}

export function summarizeStack(
  inputs: Inputs,
  items: LineItem[] = recommend(inputs),
): StackSummary {
  const mustTotal = items
    .filter((i) => i.tier === "must")
    .reduce((s, i) => s + i.estimatedCost, 0);
  const shouldTotal = items
    .filter((i) => i.tier === "should")
    .reduce((s, i) => s + i.estimatedCost, 0);
  const recommendedTotal = mustTotal + shouldTotal;
  const delta = inputs.budget - recommendedTotal;
  return {
    items,
    mustTotal,
    shouldTotal,
    recommendedTotal,
    budget: inputs.budget,
    delta,
    overBudget: delta < 0,
  };
}

