import { hasAmazonTag, SITE } from "./monetize.ts";

export function amazonDp(asin: string): string {
  const id = asin.trim().toUpperCase();
  return `https://www.amazon.com/dp/${id}`;
}

export function amazonSearch(query: string): string {
  const params = new URLSearchParams({ k: query });
  return `https://www.amazon.com/s?${params.toString()}`;
}

export function vendorUrl(url: string): string {
  return url;
}

/** Attach the Associates tag at click-time so the catalog stays tag-free. */
export function withAffiliateTag(url: string): string {
  const tag = SITE.amazonAssociatesTag.trim();
  if (!tag) return url;
  try {
    const parsed = new URL(url);
    if (!/(^|\.)amazon\.com$/i.test(parsed.hostname)) return url;
    parsed.searchParams.set("tag", tag);
    return parsed.toString();
  } catch {
    return url;
  }
}

export function isAmazonUrl(url: string): boolean {
  try {
    return /(^|\.)amazon\.com$/i.test(new URL(url).hostname);
  } catch {
    return false;
  }
}

export function affiliateRel(url: string): string {
  if (hasAmazonTag() && isAmazonUrl(url)) {
    return "nofollow sponsored noopener noreferrer";
  }
  return "nofollow noopener noreferrer";
}

export function offerCtaLabel(url: string, vendor: string): string {
  return isAmazonUrl(url) ? "View on Amazon" : `Open ${vendor}`;
}
