import { FORM_LEVELS, LEVEL_LABELS, NEED_LABELS } from "@/lib/stack/labels.ts";
import { NEEDS, type Inputs, type Level, type Need } from "@/lib/stack/types.ts";
import { formatMoney } from "@/lib/stack/money.ts";
import { cn } from "@/lib/utils";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

const BUDGET_PRESETS = [250, 750, 1500, 4000, 10000];

type Props = {
  inputs: Inputs;
  onChange: (next: Inputs) => void;
  idPrefix?: string;
};

export function StackForm({ inputs, onChange, idPrefix = "" }: Props) {
  const set = (patch: Partial<Inputs>) => onChange({ ...inputs, ...patch });

  const toggleNeed = (need: Need) => {
    const has = inputs.needs.includes(need);
    set({
      needs: has
        ? inputs.needs.filter((n) => n !== need)
        : [...inputs.needs, need],
    });
  };

  return (
    <form
      className="flex flex-col gap-6"
      onSubmit={(e) => {
        e.preventDefault();
        document.getElementById("stack-results")?.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }}
    >
      <fieldset className="flex flex-col gap-2">
        <legend className="text-sm font-medium">Sport</legend>
        <p className="flex h-11 items-center rounded-[var(--radius-md)] bg-fg/5 px-3 text-sm">
          Basketball
          <span className="ml-2 text-muted">v1 · US only</span>
        </p>
      </fieldset>

      <fieldset className="flex flex-col gap-2">
        <legend className="text-sm font-medium">Level</legend>
        <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
          {FORM_LEVELS.map((level) => {
            const selected = inputs.level === level;
            return (
              <label
                key={level}
                className={cn(
                  "flex min-h-11 cursor-pointer items-center justify-center rounded-[var(--radius-md)] px-3 text-center text-sm transition-[background-color,box-shadow,color] duration-[var(--motion-quick)] ease-[var(--ease-out)]",
                  selected
                    ? "bg-primary text-primary-fg"
                    : "bg-surface text-fg shadow-[var(--shadow-border)] hover:shadow-[var(--shadow-border-hover)]",
                )}
              >
                <input
                  type="radio"
                  className="sr-only"
                  name={`${idPrefix}level`}
                  value={level}
                  checked={selected}
                  onChange={() => set({ level: level as Level })}
                />
                {LEVEL_LABELS[level]}
              </label>
            );
          })}
        </div>
      </fieldset>

      <fieldset className="flex flex-col gap-1">
        <div className="flex items-baseline justify-between gap-3">
          <Label htmlFor={`${idPrefix}roster`}>Roster size</Label>
          <span className="tabular text-sm text-muted">
            {inputs.rosterSize} players
          </span>
        </div>
        <input
          id={`${idPrefix}roster`}
          type="range"
          min={6}
          max={32}
          value={inputs.rosterSize}
          onChange={(e) => set({ rosterSize: Number(e.target.value) })}
        />
        <div className="flex justify-between text-xs text-subtle">
          <span>6</span>
          <span>32</span>
        </div>
      </fieldset>

      <fieldset className="flex flex-col gap-1">
        <div className="flex items-baseline justify-between gap-3">
          <Label htmlFor={`${idPrefix}hours`}>Practice hours / week</Label>
          <span className="tabular text-sm text-muted">
            {inputs.practiceHoursPerWeek} h
          </span>
        </div>
        <input
          id={`${idPrefix}hours`}
          type="range"
          min={1}
          max={12}
          value={inputs.practiceHoursPerWeek}
          onChange={(e) =>
            set({ practiceHoursPerWeek: Number(e.target.value) })
          }
        />
        <div className="flex justify-between text-xs text-subtle">
          <span>1</span>
          <span>12</span>
        </div>
      </fieldset>

      <fieldset className="flex flex-col gap-2">
        <Label htmlFor={`${idPrefix}budget`}>Season budget</Label>
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted">USD</span>
          <Input
            id={`${idPrefix}budget`}
            type="number"
            min={0}
            max={100000}
            step={50}
            inputMode="numeric"
            className="tabular"
            value={inputs.budget}
            onChange={(e) =>
              set({
                budget: Math.max(0, Math.round(Number(e.target.value) || 0)),
              })
            }
          />
        </div>
        <div className="flex flex-wrap gap-2">
          {BUDGET_PRESETS.map((n) => (
            <button
              key={n}
              type="button"
              onClick={() => set({ budget: n })}
              className={cn(
                "h-9 rounded-full px-3 text-xs font-medium transition-colors duration-[var(--motion-quick)]",
                inputs.budget === n
                  ? "bg-primary text-primary-fg"
                  : "bg-fg/6 text-fg hover:bg-fg/10",
              )}
            >
              {formatMoney(n, inputs.currency)}
            </button>
          ))}
        </div>
      </fieldset>

      <fieldset className="flex flex-col gap-2">
        <legend className="text-sm font-medium">Needs this season</legend>
        <p className="text-xs text-muted">
          Toggle what you actually have to solve. Untoggled categories are
          skipped or given a cheaper workaround.
        </p>
        <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
          {NEEDS.map((need) => {
            const on = inputs.needs.includes(need);
            return (
              <label
                key={need}
                className={cn(
                  "flex min-h-11 cursor-pointer items-center gap-3 rounded-[var(--radius-md)] px-3 text-sm transition-[background-color,box-shadow] duration-[var(--motion-quick)] ease-[var(--ease-out)]",
                  on
                    ? "bg-primary/8 shadow-[var(--shadow-border)]"
                    : "bg-surface shadow-[var(--shadow-border)]",
                )}
              >
                <input
                  type="checkbox"
                  className="size-4 accent-primary"
                  checked={on}
                  onChange={() => toggleNeed(need)}
                />
                {NEED_LABELS[need]}
              </label>
            );
          })}
        </div>
      </fieldset>

      <button
        type="submit"
        className="inline-flex h-12 items-center justify-center rounded-[var(--radius-md)] bg-primary px-4 text-sm font-medium text-primary-fg lg:hidden"
      >
        See stack
      </button>
    </form>
  );
}
