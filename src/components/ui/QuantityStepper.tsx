import { MAX_QUANTITY } from "@/lib/cart";
import { cn } from "@/lib/cn";

// compact: bag lines · pill: product page (bigger touch targets)
export function QuantityStepper({
  value,
  onChange,
  min = 1,
  label,
  variant = "compact",
}: {
  value: number;
  onChange: (value: number) => void;
  /** Lowest value of the "−" button (0 = the line can be removed) */
  min?: number;
  /** What is counted, for screen readers (e.g. "Imperial Crimson") */
  label?: string;
  variant?: "compact" | "pill";
}) {
  const pill = variant === "pill";
  const button = cn(
    "flex items-center justify-center transition duration-250 ease-out disabled:pointer-events-none disabled:opacity-30",
    pill
      ? "size-12 text-md hover:opacity-60"
      : "size-10 rounded-full border border-tea-500/20 text-sm hover:border-tea-500 hover:bg-tea-500 hover:text-white md:size-8",
  );
  const suffix = label ? ` ${label}` : "";

  return (
    <div className={cn("flex items-center", pill ? "rounded-full border border-tea-500/20" : "gap-3")}>
      <button
        type="button"
        className={button}
        aria-label={`Decrease quantity${suffix}`}
        disabled={value <= min}
        onClick={() => onChange(value - 1)}
      >
        −
      </button>
      <span className="min-w-8 text-center text-sm tabular-nums" aria-live="polite">
        <span className="sr-only">Quantity: </span>
        {value}
      </span>
      <button
        type="button"
        className={button}
        aria-label={`Increase quantity${suffix}`}
        disabled={value >= MAX_QUANTITY}
        onClick={() => onChange(value + 1)}
      >
        +
      </button>
    </div>
  );
}
