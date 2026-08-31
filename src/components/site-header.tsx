import { Link } from "@tanstack/react-router";

export function SiteHeader() {
  return (
    <header className="border-b border-border bg-bg">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-4 sm:px-6">
        <Link to="/" className="flex min-h-11 items-center gap-3">
          <span
            aria-hidden="true"
            className="flex size-8 flex-col justify-center gap-0.5 rounded-[var(--radius-sm)] bg-primary px-1.5"
          >
            <span className="mx-auto block h-0.5 w-3 rounded-full bg-primary-fg/70" />
            <span className="mx-auto block h-0.5 w-4 rounded-full bg-primary-fg/85" />
            <span className="mx-auto block h-0.5 w-5 rounded-full bg-primary-fg" />
          </span>
          <span className="flex flex-col leading-tight">
            <span className="font-display text-lg font-medium tracking-tight">
              PitchStack
            </span>
            <span className="text-xs text-muted">US basketball ops</span>
          </span>
        </Link>
        <p className="hidden text-right text-xs text-muted sm:block">
          Season budget calculator
        </p>
      </div>
    </header>
  );
}
