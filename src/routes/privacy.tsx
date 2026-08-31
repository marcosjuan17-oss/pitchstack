import { createFileRoute, Link } from "@tanstack/react-router";
import { contactHref, SITE } from "@/lib/stack/monetize.ts";

export const Route = createFileRoute("/privacy")({
  component: PrivacyPage,
});

function PrivacyPage() {
  const mail = contactHref();
  return (
    <main className="mx-auto w-full max-w-2xl flex-1 px-4 py-10 sm:px-6">
      <h1 className="font-display text-4xl font-medium tracking-tight">
        Privacy policy
      </h1>
      <p className="mt-2 text-sm text-muted">Last updated: August 30, 2026</p>
      <div className="mt-6 space-y-4 text-base leading-relaxed text-muted">
        <p>
          PitchStack is operated from {SITE.city}, {SITE.country}. This
          calculator does not have user accounts and does not run a customer
          database.
        </p>
        <p>
          Your last inputs (roster size, budget, toggles) are stored in this
          browser’s local storage so a refresh keeps the form. Share links
          encode the same inputs in the URL. Anyone with the link can see those
          numbers. Do not put names, emails, or student records in the tool —
          the form never asks for them.
        </p>
        <p>
          If you click an Amazon or vendor button you leave PitchStack. Those
          sites set their own cookies and follow their own privacy policies,
          including Amazon.com and Google if ads are later enabled.
        </p>
        <h2 className="pt-2 font-display text-2xl font-medium tracking-tight text-fg">
          Advertising
        </h2>
        <p>
          If Google AdSense is enabled on a published domain, Google may use
          cookies and similar technologies (including the DoubleClick cookie)
          to serve and measure ads based on visits to this site and other
          sites. You can opt out of personalized ads at{" "}
          <a
            className="text-fg underline-offset-2 hover:underline"
            href="https://www.google.com/settings/ads"
            target="_blank"
            rel="noopener noreferrer"
          >
            Google Ads Settings
          </a>{" "}
          and via{" "}
          <a
            className="text-fg underline-offset-2 hover:underline"
            href="https://www.aboutads.info/"
            target="_blank"
            rel="noopener noreferrer"
          >
            aboutads.info
          </a>
          . AdSense is off until a publisher ID is configured.
        </p>
        <p>
          We do not sell personal information. We do not knowingly collect data
          from children under 13. This tool is for coaches, athletic directors,
          and parents acting for a team — not for a child’s own account.
        </p>
        <p>
          Contact:{" "}
          {mail ? (
            <a className="text-fg underline-offset-2 hover:underline" href={mail}>
              {SITE.contactEmail}
            </a>
          ) : (
            <Link to="/contact" className="text-fg underline-offset-2 hover:underline">
              Contact page
            </Link>
          )}
          .
        </p>
      </div>
    </main>
  );
}
