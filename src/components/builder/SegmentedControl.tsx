import { cn } from "@/lib/utils";

interface Option<T extends string | number> {
  value: T;
  label: string;
}

interface Props<T extends string | number> {
  options: Option<T>[];
  value: T;
  onChange: (value: T) => void;
  label: string;
  size?: "md" | "sm";
}

export function SegmentedControl<T extends string | number>({
  options,
  value,
  onChange,
  label,
  size = "md",
}: Props<T>) {
  return (
    <div
      role="radiogroup"
      aria-label={label}
      className="flex w-full items-center gap-1 rounded-full border border-field-border bg-field p-1"
    >
      {options.map((opt) => {
        const selected = opt.value === value;
        return (
          <button
            key={String(opt.value)}
            type="button"
            role="radio"
            aria-checked={selected}
            onClick={() => onChange(opt.value)}
            className={cn(
              "heading flex-1 whitespace-nowrap rounded-full font-semibold transition-colors outline-none focus-visible:ring-2 focus-visible:ring-ring",
              size === "md" ? "h-9 px-2 text-[15px]" : "h-8 px-3 text-[13px]",
              selected
                ? "bg-primary text-primary-foreground shadow-soft"
                : "text-muted-foreground hover:text-foreground",
            )}
          >
            {opt.label}
          </button>
        );
      })}
    </div>
  );
}
