import { createFileRoute, Link } from "@tanstack/react-router";
import { StackResults } from "@/components/stack-results";
import { decodeInputs, normalizeCalculatorInputs } from "@/lib/stack/share.ts";

export const Route = createFileRoute("/r/$id")({
  component: SharedResult,
});

function SharedResult() {
  const { id } = Route.useParams();
  const decoded = decodeInputs(id);
  const inputs = decoded ? normalizeCalculatorInputs(decoded) : null;

  if (!inputs) {
    return (
      <main className="mx-auto flex w-full max-w-xl flex-1 flex-col justify-center px-4 py-16 text-center">
        <h1 className="font-display text-3xl font-medium tracking-tight">
          This share link is invalid
        </h1>
        <p className="mt-3 text-muted">
          The stack encoding could not be read. Start a new calculation.
        </p>
        <Link
          to="/"
          className="mt-6 inline-flex h-11 items-center justify-center rounded-[var(--radius-md)] bg-primary px-4 text-sm font-medium text-primary-fg"
        >
          Back to calculator
        </Link>
      </main>
    );
  }

  return (
    <main className="mx-auto w-full max-w-3xl flex-1 px-4 py-8 sm:px-6 sm:py-10">
      <p className="text-xs font-medium uppercase tracking-wide text-muted">
        Shared stack
      </p>
      <div className="mt-6">
        <StackResults inputs={inputs} shareMode />
      </div>
    </main>
  );
}
