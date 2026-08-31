import { createFileRoute, Link } from "@tanstack/react-router";
import {
  AMAZON_ASSOCIATE_SENTENCE,
  amazonSitewideDisclosure,
  hasAmazonTag,
  SITE,
} from "@/lib/stack/monetize.ts";

export const Route = createFileRoute("/disclosure")({
  component: DisclosurePage,
});

function DisclosurePage() {
  return (
    <main className="mx-auto w-full max-w-2xl flex-1 px-4 py-10 sm:px-6">
      <h1 className="font-display text-4xl font-medium tracking-tight">
        Affiliate disclosure
      </h1>
      <div className="mt-6 space-y-4 text-base leading-relaxed text-muted">
        <p>
          PitchStack is a comparison calculator operated from {SITE.city},{" "}
          {SITE.country}. Hardware buttons open Amazon.com. Software buttons
          open the vendor. Prices on this site are estimates.
        </p>
        <p>
          {hasAmazonTag()
            ? `${AMAZON_ASSOCIATE_SENTENCE} PitchStack is a participant in the Amazon Services LLC Associates Program, an affiliate advertising program designed to provide a means for sites to earn advertising fees by advertising and linking to Amazon.com. Amazon buttons are marked “(paid link)”. You do not pay more because of that.`
            : amazonSitewideDisclosure()}
        </p>
        <p>
          Software buttons go to the vendor’s own site (TeamSnap, Hudl,
          SportsEngine, Veo, GoFundMe, Booster, USA Basketball, and others).
          Those programs require a separate application. Until a referral URL
          is enrolled, those clicks do not pay PitchStack.
        </p>
        <p>
          Prices are season estimates, not live Amazon or vendor quotes. Always
          check the destination page before you spend team money. Amazon and
          vendors set their own prices, tax, and shipping.
        </p>
        <p>
          This is advertising under the FTC Endorsement Guides. We do not give
          medical advice, injury diagnosis, or recruiting-rules legal advice.
          Skip recommendations are budgetary, not a claim about player health.
        </p>
        <p>
          Questions: see{" "}
          <Link to="/contact" className="text-fg underline-offset-2 hover:underline">
            Contact
          </Link>
          .
        </p>
      </div>
    </main>
  );
}
