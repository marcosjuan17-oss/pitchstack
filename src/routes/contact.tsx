import { createFileRoute } from "@tanstack/react-router";
import { contactHref, SITE } from "@/lib/stack/monetize.ts";

export const Route = createFileRoute("/contact")({
  component: ContactPage,
});

function ContactPage() {
  const mail = contactHref();
  return (
    <main className="mx-auto w-full max-w-2xl flex-1 px-4 py-10 sm:px-6">
      <h1 className="font-display text-4xl font-medium tracking-tight">
        Contact
      </h1>
      <div className="mt-6 space-y-4 text-base leading-relaxed text-muted">
        <p>
          PitchStack is a season-budget calculator operated from {SITE.city},{" "}
          {SITE.country}. It is not affiliated with NFHS, USA Basketball,
          Amazon, or any vendor linked from the results.
        </p>
        {mail ? (
          <p>
            Email:{" "}
            <a className="text-fg underline-offset-2 hover:underline" href={mail}>
              {SITE.contactEmail}
            </a>
          </p>
        ) : (
          <p>
            A public email will be listed on this page before PitchStack is
            submitted to Amazon Associates or Google AdSense. Until then there
            is no inbox to write to — do not send player or student records
            anywhere on this site.
          </p>
        )}
        <p>
          We do not take medical, injury, or recruiting-rules questions. Those
          belong with your athletic trainer or school athletic director.
        </p>
      </div>
    </main>
  );
}
