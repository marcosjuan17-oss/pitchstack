import { Link } from "@tanstack/react-router";
import {
  amazonLinkLevelDisclosure,
  amazonSitewideDisclosure,
} from "@/lib/stack/monetize.ts";

export function DisclosureBanner() {
  const paid = amazonLinkLevelDisclosure();
  return (
    <p className="rounded-[var(--radius-md)] bg-fg/4 px-3 py-2 text-xs leading-relaxed text-muted">
      {paid ? <span className="font-medium text-fg">{paid} </span> : null}
      {amazonSitewideDisclosure()} Software buttons go to the vendor. You do
      not pay more if a commission is later earned.{" "}
      <Link to="/disclosure" className="text-fg underline-offset-2 hover:underline">
        Full disclosure
      </Link>
      .
    </p>
  );
}
