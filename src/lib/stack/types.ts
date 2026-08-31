export type Level = "youth" | "high_school" | "club" | "college_club";
export type Need = "film" | "travel" | "fundraising" | "registration" | "s_and_c" | "medkit";
export type Tier = "must" | "should" | "skip";
export type Category = "software" | "hardware" | "education";
export type Currency = "USD" | "EUR";

export const LEVELS: Level[] = ["youth", "high_school", "club", "college_club"];
export const NEEDS: Need[] = [
  "film",
  "travel",
  "fundraising",
  "registration",
  "s_and_c",
  "medkit",
];
export const ALL_LEVELS: Level[] = [...LEVELS];

export type Product = {
  id: string;
  name: string;
  category: Category;
  sportTags: string[];
  levelTags: Level[];
  covers: Need[];
  priceEstimate: number;
  currency: Currency;
  affiliateUrl: string;
  vendor: string;
  notes: string;
  /** Dedup key — one pick per group. */
  group: string;
  priceSource: string;
  minRoster?: number;
  maxRoster?: number;
  minBudget?: number;
  maxBudget?: number;
};

export type Inputs = {
  sport: string;
  level: Level;
  rosterSize: number;
  practiceHoursPerWeek: number;
  budget: number;
  currency: Currency;
  needs: Need[];
};

export type LineItem = {
  productId: string;
  tier: Tier;
  reason: string;
  estimatedCost: number;
};

export type StackSummary = {
  items: LineItem[];
  mustTotal: number;
  shouldTotal: number;
  recommendedTotal: number;
  budget: number;
  delta: number;
  overBudget: boolean;
};

export const DEFAULT_INPUTS: Inputs = {
  sport: "basketball",
  level: "high_school",
  rosterSize: 15,
  practiceHoursPerWeek: 6,
  budget: 2500,
  currency: "USD",
  needs: ["registration", "medkit"],
};

export const FILM_CHEAP_THRESHOLD = 600;
export const FILM_PREMIUM_THRESHOLD = 2500;
export const MUST_BUDGET_LOW = 0.6;
export const MUST_BUDGET_HIGH = 0.8;
export const PRICE_SOURCE =
  "estimate — typical 2026 US list, not a live Amazon quote";
