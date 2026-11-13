import { useId, type ComponentProps } from "react";
import { cn } from "@/lib/cn";

// md: label + input (Register) · lg: big centered input, hidden label (Reset).
// The bottom border turns red on focus.
type TextFieldProps = Omit<ComponentProps<"input">, "size"> & {
  label: string;
  size?: "md" | "lg";
};

export function TextField({ label, size = "md", className, id, ...inputProps }: TextFieldProps) {
  const autoId = useId();
  const inputId = id ?? autoId;
  const large = size === "lg";

  return (
    <div className={cn("flex flex-col", className)}>
      <label htmlFor={inputId} className={large ? "sr-only" : "label opacity-50"}>
        {label}
      </label>
      <input
        id={inputId}
        className={cn(
          "w-full border-b bg-transparent font-display tracking-wider uppercase outline-none",
          "transition-colors duration-250 ease-out placeholder:text-tea-500/20",
          large
            ? "border-tea-500/40 pt-2 pb-6 text-center text-input focus:border-tea-500"
            : "border-tea-500/20 py-7 text-2xl leading-tight focus:border-tea-500",
        )}
        {...inputProps}
      />
    </div>
  );
}
