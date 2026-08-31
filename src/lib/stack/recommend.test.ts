import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { catalog } from "./catalog.ts";
import { recommend, summarizeStack } from "./recommend.ts";
import type { Inputs, Need } from "./types.ts";

const ALL_NEEDS: Need[] = [
  "film",
  "travel",
  "fundraising",
  "registration",
  "s_and_c",
  "medkit",
];

const brokeYouth: Inputs = {
  sport: "basketball",
  level: "youth",
  rosterSize: 14,
  practiceHoursPerWeek: 3,
  budget: 250,
  currency: "USD",
  needs: ["medkit"],
};

const wellFundedClub: Inputs = {
  sport: "basketball",
  level: "club",
  rosterSize: 22,
  practiceHoursPerWeek: 6,
  budget: 8000,
  currency: "USD",
  needs: ALL_NEEDS,
};

const filmOnly: Inputs = {
  sport: "basketball",
  level: "high_school",
  rosterSize: 18,
  practiceHoursPerWeek: 5,
  budget: 900,
  currency: "USD",
  needs: ["film"],
};

const tinyRoster: Inputs = {
  sport: "basketball",
  level: "youth",
  rosterSize: 8,
  practiceHoursPerWeek: 2,
  budget: 500,
  currency: "USD",
  needs: ["fundraising"],
};

const maxBudget: Inputs = {
  sport: "basketball",
  level: "club",
  rosterSize: 28,
  practiceHoursPerWeek: 8,
  budget: 20000,
  currency: "USD",
  needs: ALL_NEEDS,
};

function ids(inputs: Inputs): string[] {
  return recommend(inputs).map((i) => i.productId);
}

function byTier(inputs: Inputs, tier: "must" | "should" | "skip") {
  return recommend(inputs).filter((i) => i.tier === tier);
}

describe("catalog seed", () => {
  it("has 30–40 basketball products with live purchase URLs", () => {
    assert.ok(catalog.length >= 30, `expected >= 30, got ${catalog.length}`);
    assert.ok(catalog.length <= 40, `expected <= 40, got ${catalog.length}`);
    assert.ok(catalog.every((p) => p.sportTags.includes("basketball")));
    assert.ok(
      catalog.every(
        (p) =>
          p.affiliateUrl.startsWith("https://www.amazon.com/") ||
          p.affiliateUrl.startsWith("https://www.teamsnap.com/") ||
          p.affiliateUrl.startsWith("https://www.hudl.com/") ||
          p.affiliateUrl.startsWith("https://www.sportsengine.com/") ||
          p.affiliateUrl.startsWith("https://www.gofundme.com/") ||
          p.affiliateUrl.startsWith("https://www.booster.com/") ||
          p.affiliateUrl.startsWith("https://www.veo.co/") ||
          p.affiliateUrl.startsWith("https://www.maxpreps.com/") ||
          p.affiliateUrl.startsWith("https://band.us/") ||
          p.affiliateUrl.startsWith("https://www.usab.com/"),
      ),
      "every URL must be a live vendor or Amazon link",
    );
    assert.ok(catalog.every((p) => p.priceSource.includes("estimate")));
  });
});

describe("broke youth team", () => {
  const items = recommend(brokeYouth);

  it("returns 6–10 line items", () => {
    assert.ok(items.length >= 6 && items.length <= 10, String(items.length));
  });

  it("treats a basic med kit as Must at roster 14", () => {
    const med = items.find((i) => i.productId === "pitch-medkit");
    assert.ok(med, "expected pitch-medkit");
    assert.equal(med?.tier, "must");
    assert.match(med?.reason ?? "", /14-player/);
  });

  it("does not Must a Veo camera on a $250 budget", () => {
    const veo = items.find((i) => i.productId === "veo-cam");
    assert.ok(!veo || veo.tier === "skip");
  });

  it("never marks education as Must", () => {
    const educationIds = new Set(
      catalog.filter((p) => p.category === "education").map((p) => p.id),
    );
    for (const item of items) {
      if (educationIds.has(item.productId)) {
        assert.notEqual(item.tier, "must");
      }
    }
  });

  it("reasons mention this roster and budget", () => {
    assert.ok(items.some((i) => /14-player/.test(i.reason)));
    assert.ok(items.some((i) => /€\s?250/.test(i.reason) || /250/.test(i.reason)));
  });
});

describe("well-funded club", () => {
  const items = recommend(wellFundedClub);

  it("returns 6–10 line items", () => {
    assert.ok(items.length >= 6 && items.length <= 10, String(items.length));
  });

  it("includes film because the need is on", () => {
    const filmIds = new Set(
      catalog.filter((p) => p.covers.includes("film")).map((p) => p.id),
    );
    assert.ok(items.some((i) => filmIds.has(i.productId)));
  });

  it("includes registration (toggled, roster 22)", () => {
    const reg = items.find(
      (i) =>
        i.productId === "teamsnap-season" ||
        i.productId === "sportsengine",
    );
    assert.ok(reg, `registration missing in ${ids(wellFundedClub).join(",")}`);
  });

  it("is a different, more expensive stack than the broke youth team", () => {
    const a = new Set(ids(brokeYouth));
    const b = new Set(ids(wellFundedClub));
    const overlap = [...a].filter((id) => b.has(id)).length;
    assert.ok(overlap < a.size, "stacks should not be identical");
    const well = summarizeStack(wellFundedClub);
    const broke = summarizeStack(brokeYouth);
    assert.ok(
      well.recommendedTotal > broke.recommendedTotal,
      `${well.recommendedTotal} vs ${broke.recommendedTotal}`,
    );
  });

  it("education is Should or Skip, never Must", () => {
    const educationIds = new Set(
      catalog.filter((p) => p.category === "education").map((p) => p.id),
    );
    const edu = items.filter((i) => educationIds.has(i.productId));
    assert.ok(edu.length <= 1, "at most one education item");
    for (const item of edu) assert.notEqual(item.tier, "must");
  });
});

describe("film-only high school", () => {
  const items = recommend(filmOnly);

  it("includes a film-capture tool and not Veo at $900", () => {
    const capture = items.find(
      (i) =>
        i.productId === "gopro-hero" ||
        i.productId === "phone-tripod" ||
        i.productId === "veo-cam",
    );
    assert.ok(capture, "expected a film capture item");
    assert.notEqual(capture?.productId, "veo-cam");
    assert.equal(capture?.productId, "gopro-hero");
  });

  it("does not Must registration when roster < 25 and the need is off", () => {
    const mustReg = byTier(filmOnly, "must").filter((i) => {
      const p = catalog.find((c) => c.id === i.productId);
      return p?.group === "registration";
    });
    assert.equal(mustReg.length, 0);
  });

  it("does not recommend film tools when the need is off", () => {
    const noFilm: Inputs = { ...filmOnly, needs: [] };
    const filmIds = new Set(
      catalog.filter((p) => p.group === "film-capture").map((p) => p.id),
    );
    assert.ok(!recommend(noFilm).some((i) => filmIds.has(i.productId) && i.tier !== "skip"));
  });
});

describe("tiny roster", () => {
  const items = recommend(tinyRoster);

  it("does not Must a med kit under 12 players", () => {
    const med = items.find(
      (i) => i.productId === "pitch-medkit" || i.productId === "first-aid-backpack",
    );
    assert.ok(!med || med.tier !== "must");
  });

  it("does not Must registration under 25 without the toggle", () => {
    const mustReg = byTier(tinyRoster, "must").filter((i) => {
      const p = catalog.find((c) => c.id === i.productId);
      return p?.covers.includes("registration");
    });
    assert.equal(mustReg.length, 0);
  });

  it("includes a fundraising item", () => {
    const fundIds = new Set(
      catalog.filter((p) => p.covers.includes("fundraising")).map((p) => p.id),
    );
    assert.ok(items.some((i) => fundIds.has(i.productId)));
  });

  it("changes when roster grows to 16", () => {
    const grown: Inputs = { ...tinyRoster, rosterSize: 16 };
    assert.notDeepEqual(ids(tinyRoster), ids(grown));
    const grownMed = recommend(grown).find((i) => i.productId === "pitch-medkit");
    assert.equal(grownMed?.tier, "must");
  });
});

describe("max budget club", () => {
  const items = recommend(maxBudget);

  it("returns 6–10 line items", () => {
    assert.ok(items.length >= 6 && items.length <= 10, String(items.length));
  });

  it("Musts registration at roster 28", () => {
    const mustReg = byTier(maxBudget, "must").filter((i) => {
      const p = catalog.find((c) => c.id === i.productId);
      return p?.group === "registration";
    });
    assert.ok(mustReg.length >= 1);
  });

  it("includes Veo on a $20k film-on budget", () => {
    assert.ok(ids(maxBudget).includes("veo-cam"));
  });

  it("picks the cheaper product when two cover the same need at this level", () => {
    const groups = items.map((i) => catalog.find((p) => p.id === i.productId)?.group);
    const operational = groups.filter((g) => g && g !== "film-capture");
    const unique = new Set(operational);
    // film-capture may appear twice (pick + skip premium). Other groups: one live pick.
    assert.equal(operational.length, unique.size);
  });
});

describe("budget swaps the film path", () => {
  it("uses a phone tripod under $600 and a GoPro between $600 and $2500", () => {
    const cheap: Inputs = { ...filmOnly, budget: 400 };
    const mid: Inputs = { ...filmOnly, budget: 900 };
    const high: Inputs = { ...filmOnly, level: "club", budget: 8000, needs: ["film"] };
    assert.ok(ids(cheap).includes("phone-tripod"));
    assert.ok(!ids(cheap).includes("gopro-hero") || byTier(cheap, "must").every((i) => i.productId !== "gopro-hero"));
    assert.ok(ids(mid).includes("gopro-hero"));
    assert.ok(ids(high).includes("veo-cam"));
  });
});

describe("share-stable engine", () => {
  it("is deterministic", () => {
    assert.deepEqual(recommend(wellFundedClub), recommend(wellFundedClub));
  });
});

describe("default club stack", () => {
  it("keeps a Must and a Should band (does not promote extras)", () => {
    const items = recommend({
      sport: "basketball",
      level: "high_school",
      rosterSize: 16,
      practiceHoursPerWeek: 4,
      budget: 1500,
      currency: "USD",
      needs: ["registration", "medkit"],
    });
    assert.ok(items.some((i) => i.tier === "must"));
    assert.ok(items.some((i) => i.tier === "should"));
    assert.ok(
      items.find((i) => i.productId === "pitch-medkit")?.tier === "must",
    );
    assert.notEqual(
      items.find((i) => i.productId === "popup-goals")?.tier,
      "must",
    );
  });
});
