import type { Currency } from "./types.ts";

/** Catalog is USD-native. EUR is a documented fallback only. */
export const USD_TO_EUR = 0.92;

export function toInputCurrency(usdAmount: number, currency: Currency): number {
  if (currency === "USD") return Math.round(usdAmount);
  return Math.round(usdAmount * USD_TO_EUR);
}

export function formatMoney(amount: number, currency: Currency): string {
  return new Intl.NumberFormat(currency === "EUR" ? "nl-NL" : "en-US", {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  }).format(amount);
}
