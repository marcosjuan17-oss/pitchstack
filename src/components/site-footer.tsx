import { Link } from "@tanstack/react-router";
import {
  amazonSitewideDisclosure,
  contactHref,
  SITE,
} from "@/lib/stack/monetize.ts";

export function SiteFooter() {
  const mail = contactHref();
  return (
    <footer className="mt-auto border-t border-border">
      <div className="mx-auto flex max-w-6xl flex-col gap-4 px-4 py-8 sm:flex-row sm:items-start sm:justify-between sm:px-6">
        <div className="max-w-md text-sm text-muted">
          <p>
            {amazonSitewideDisclosure()} Prices are estimates, not live quotes.
            Operated from {SITE.city}.
          </p>
          <p className="mt-2">
            Not medical, legal, or recruiting advice.
            {mail ? (
              <>
                {" "}
                Contact:{" "}
                <a
                  className="text-fg underline-offset-2 hover:underline"
                  href={mail}
                >
                  {SITE.contactEmail}
                </a>
              </>
            ) : null}
          </p>
        </div>
        <nav className="flex flex-wrap gap-x-5 gap-y-2 text-sm">
          <Link to="/about" className="text-fg underline-offset-2 hover:underline">
            About
          </Link>
          <Link to="/disclosure" className="text-fg underline-offset-2 hover:underline">
            Affiliate disclosure
          </Link>
          <Link to="/privacy" className="text-fg underline-offset-2 hover:underline">
            Privacy
          </Link>
          <Link to="/contact" className="text-fg underline-offset-2 hover:underline">
            Contact
          </Link>
          <Link to="/catalog" className="text-muted underline-offset-2 hover:underline">
            Catalog
          </Link>
        </nav>
      </div>
    </footer>
  );
}
