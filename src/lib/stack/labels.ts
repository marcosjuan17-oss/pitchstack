import type { Category, Level, Need, Tier } from "./types.ts";

export const LEVEL_LABELS: Record<Level, string> = {
  youth: "Youth rec",
  high_school: "High school",
  club: "AAU / club",
  college_club: "College club",
};

export const LEVEL_SHORT: Record<Level, string> = {
  youth: "youth-rec",
  high_school: "high-school",
  club: "aau-club",
  college_club: "college-club",
};

export const NEED_LABELS: Record<Need, string> = {
  film: "Film / video",
  travel: "Travel",
  fundraising: "Fundraising",
  registration: "Registration / payments",
  s_and_c: "Strength & conditioning",
  medkit: "Medical kit",
};

export const TIER_LABELS: Record<Tier, string> = {
  must: "Must",
  should: "Should",
  skip: "Skip",
};

export const CATEGORY_LABELS: Record<Category, string> = {
  software: "Software",
  hardware: "Hardware",
  education: "Education",
};

export const FORM_LEVELS: Level[] = ["youth", "high_school", "club"];
