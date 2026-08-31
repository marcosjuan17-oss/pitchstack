import { createFileRoute, Link } from "@tanstack/react-router";
import { SITE } from "@/lib/stack/monetize.ts";

export const Route = createFileRoute("/about")({
  component: AboutPage,
});

function AboutPage() {
  return (
    <main className="mx-auto w-full max-w-2xl flex-1 px-4 py-10 sm:px-6">
      <h1 className="font-display text-4xl font-medium tracking-tight">
        About PitchStack
      </h1>
      <div className="mt-6 space-y-4 text-base leading-relaxed text-muted">
        <p>
          PitchStack is a season-budget calculator for US basketball programs —
          rec, high school, and AAU. You enter roster size, weekly hours,
          budget, and needs. A fixed set of rules ranks software, hardware, and
          one education item as Must, Should, or Skip.
        </p>
        <p>
          It is operated from {SITE.city}, {SITE.country}. It is not a store,
          not a medical service, and not an NFHS or USA Basketball official
          tool.
        </p>
        <h2 className="pt-2 font-display text-2xl font-medium tracking-tight text-fg">
          How a stack is ranked
        </h2>
        <p>
          The engine is a pure function: same inputs always return the same
          stack. A sideline first-aid kit is considered Must once the roster
          hits 12. Registration software is Must at 25 players or when you
          toggle it. Film tools appear only if you ask for film; under $600 the
          path is a phone tripod, not a dedicated camera. If two products cover
          the same job, the cheaper level-matching one wins. Education is never
          Must. Must-cost is capped near 80% of the budget when possible; the
          rest moves to Should. If a category cannot fit, it is Skip with a
          cheaper workaround in the reason.
        </p>
        <p>
          Prices are estimates so you can compare a season plan. They are not
          live Amazon quotes. Click through before you buy.
        </p>
        <h2 className="pt-2 font-display text-2xl font-medium tracking-tight text-fg">
          How the site is paid for
        </h2>
        <p>
          Hardware buttons go to Amazon.com. Software buttons go to the vendor.
          If the operator is enrolled in Amazon Associates or a vendor referral
          program, those clicks may pay a commission at no extra cost to you.
          See the{" "}
          <Link to="/disclosure" className="text-fg underline-offset-2 hover:underline">
            affiliate disclosure
          </Link>
          . Display advertising (Google AdSense) stays off until Google
          approves a published domain and a publisher ID is set.
        </p>
        <h2 className="pt-2 font-display text-2xl font-medium tracking-tight text-fg">
          What this calculator will not do
        </h2>
        <p>
          It will not diagnose injuries, set training loads, or tell you who
          is eligible to play. It will not scrape live store prices or invent
          an Amazon Associates tag. It will not hide that a button is a
          shopping link. Skip is a budget call, not a health claim.
        </p>
        <h2 className="pt-2 font-display text-2xl font-medium tracking-tight text-fg">
          Why basketball, why USD
        </h2>
        <p>
          v1 is US high-school / rec / AAU basketball priced in US dollars
          because Amazon Associates and most youth-sports software in this
          country settle in USD. Soccer, baseball, and other sports are out of
          scope until this stack is stable.
        </p>
        <p>
          <Link to="/contact" className="text-fg underline-offset-2 hover:underline">
            Contact
          </Link>{" "}
          ·{" "}
          <Link to="/privacy" className="text-fg underline-offset-2 hover:underline">
            Privacy
          </Link>
        </p>
      </div>
    </main>
  );
}
