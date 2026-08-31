import { describe, it } from "node:test";
import assert from "node:assert/strict";
import {
  affiliateRel,
  amazonDp,
  amazonSearch,
  isAmazonUrl,
  offerCtaLabel,
  vendorUrl,
  withAffiliateTag,
} from "./affiliates.ts";

describe("affiliate URLs", () => {
  it("builds live amazon.com search and dp URLs", () => {
    const search = amazonSearch("Wilson Evolution basketball 29.5 indoor");
    assert.equal(new URL(search).hostname, "www.amazon.com");
    assert.ok(search.includes("Wilson"));
    assert.equal(amazonDp("B00TESTASIN"), "https://www.amazon.com/dp/B00TESTASIN");
  });

  it("does not invent a tag when the store ID is empty", () => {
    const url = amazonSearch("sports first aid kit");
    assert.equal(withAffiliateTag(url), url);
    assert.equal(new URL(withAffiliateTag(url)).searchParams.get("tag"), null);
  });

  it("leaves vendor homepages untagged", () => {
    const hudl = vendorUrl("https://www.hudl.com/");
    assert.equal(withAffiliateTag(hudl), hudl);
    assert.equal(isAmazonUrl(hudl), false);
    assert.equal(offerCtaLabel(hudl, "Hudl"), "Open Hudl");
  });

  it("labels Amazon CTAs and does not mark them sponsored until enrolled", () => {
    const url = amazonSearch("GoPro HERO Black bundle");
    assert.equal(isAmazonUrl(url), true);
    assert.equal(offerCtaLabel(url, "GoPro"), "View on Amazon");
    assert.equal(affiliateRel(url), "nofollow noopener noreferrer");
  });
});
