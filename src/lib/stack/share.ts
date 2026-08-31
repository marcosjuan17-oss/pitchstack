import {
  DEFAULT_INPUTS,
  NEEDS,
  type Inputs,
  type Level,
  type Need,
} from "./types.ts";

const LEVELS: Level[] = ["youth", "high_school", "club", "college_club"];

function needsMask(needs: Need[]): number {
  let mask = 0;
  for (const need of NEEDS) {
    if (needs.includes(need)) {
      mask |= 1 << NEEDS.indexOf(need);
    }
  }
  return mask;
}

function needsFromMask(mask: number): Need[] {
  return NEEDS.filter((_, i) => (mask & (1 << i)) !== 0);
}

/**
 * Compact, URL-safe encoding of calculator inputs.
 * v1.{level}.{roster}.{hours}.{budget}.{currency}.{needsMask}
 */
export function encodeInputs(inputs: Inputs): string {
  const hours = Math.round(inputs.practiceHoursPerWeek);
  const budget = Math.round(Math.max(0, inputs.budget));
  const roster = Math.round(inputs.rosterSize);
  return [
    "v1",
    inputs.level,
    String(roster),
    String(hours),
    String(budget),
    inputs.currency,
    String(needsMask(inputs.needs)),
  ].join(".");
}

export function decodeInputs(id: string): Inputs | null {
  const raw = id.trim();
  const parts = raw.split(".");
  if (parts.length !== 7) return null;
  const [ver, level, rosterStr, hoursStr, budgetStr, currency, maskStr] = parts;
  if (ver !== "v1") return null;
  if (!LEVELS.includes(level as Level)) return null;
  if (currency !== "EUR" && currency !== "USD") return null;
  const rosterSize = Number(rosterStr);
  const practiceHoursPerWeek = Number(hoursStr);
  const budget = Number(budgetStr);
  const mask = Number(maskStr);
  if (
    !Number.isFinite(rosterSize) ||
    !Number.isFinite(practiceHoursPerWeek) ||
    !Number.isFinite(budget) ||
    !Number.isFinite(mask)
  ) {
    return null;
  }
  return {
    sport: "basketball",
    level: level as Level,
    rosterSize: clamp(Math.round(rosterSize), 6, 32),
    practiceHoursPerWeek: clamp(Math.round(practiceHoursPerWeek), 1, 12),
    budget: clamp(Math.round(budget), 0, 100000),
    currency,
    needs: needsFromMask(Math.round(mask)),
  };
}

export function clamp(n: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, n));
}

export function parseSearchStack(s: unknown): Inputs | null {
  if (typeof s !== "string" || s.length === 0) return null;
  return decodeInputs(s);
}

/** Force v1 basketball + USD. Old stored soccer/EUR inputs must not leak. */
export function normalizeCalculatorInputs(raw: Inputs): Inputs {
  const needs = Array.isArray(raw.needs)
    ? raw.needs.filter((n): n is Need => (NEEDS as readonly string[]).includes(n))
    : [...DEFAULT_INPUTS.needs];
  const level: Level = LEVELS.includes(raw.level) ? raw.level : DEFAULT_INPUTS.level;
  return {
    sport: "basketball",
    level,
    rosterSize: clamp(Math.round(raw.rosterSize) || DEFAULT_INPUTS.rosterSize, 6, 32),
    practiceHoursPerWeek: clamp(
      Math.round(raw.practiceHoursPerWeek) || DEFAULT_INPUTS.practiceHoursPerWeek,
      1,
      12,
    ),
    budget: clamp(Math.round(raw.budget) || 0, 0, 100000),
    currency: "USD",
    needs,
  };
}

export { DEFAULT_INPUTS };
