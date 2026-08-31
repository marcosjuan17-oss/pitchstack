/**
 * Fill these in before you take this live. Leave blank until the account exists.
 * Never invent an Amazon tag or AdSense publisher ID — Amazon and Google
 * reject / claw back traffic that uses someone else's codes.
 */
export const SITE = {
  name: "PitchStack",
  city: "Miami, FL",
  country: "United States",
  /** Your real inbox, e.g. you@yourdomain.com */
  contactEmail: "",
  /**
   * Amazon Associates store ID, e.g. "yourname-20".
   * Apply at https://affiliate-program.amazon.com/
   */
  amazonAssociatesTag: "",
  /**
   * AdSense publisher id, e.g. "pub-1234567890123456".
   * Do not paste a script until Google approves the site.
   */
  adsensePublisherId: "",
} as const;

/** Amazon Operating Agreement sitewide sentence. Use only after enrollment. */
export const AMAZON_ASSOCIATE_SENTENCE =
  "As an Amazon Associate I earn from qualifying purchases.";

export function hasAmazonTag(): boolean {
  return SITE.amazonAssociatesTag.trim().length > 0;
}

export function hasAdsense(): boolean {
  return /^pub-\d{10,}$/.test(SITE.adsensePublisherId.trim());
}

export function contactHref(): string | null {
  const email = SITE.contactEmail.trim();
  if (!email || !email.includes("@")) return null;
  return `mailto:${email}`;
}

export function amazonSitewideDisclosure(): string {
  if (hasAmazonTag()) return AMAZON_ASSOCIATE_SENTENCE;
  return "Hardware buttons open Amazon.com. They are not commission-tracked until this site is enrolled in the Amazon Associates Program.";
}

/** FTC / Amazon link-level marker. Null until a real Associates tag is set. */
export function amazonLinkLevelDisclosure(): string | null {
  return hasAmazonTag() ? "(paid link)" : null;
}
