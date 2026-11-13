import { Badge } from "@/components/ui/Badge";
import type { Address } from "@/types";

// No Edit / Remove yet: these addresses come from past orders, not from an address book.
export function AddressCard({ address, latest = false }: { address: Address; latest?: boolean }) {
  return (
    <article className="flex flex-col items-start gap-2 rounded-card border border-tea-500/10 bg-white p-10">
      {latest && <Badge variant="solid">Last Used</Badge>}
      <h3 className="pt-2.5 font-display text-xl font-bold tracking-wider uppercase">{address.label}</h3>
      <address className="text-sm leading-relaxed tracking-wide not-italic uppercase opacity-70">
        {address.lines.map((line) => (
          <span key={line} className="block">
            {line}
          </span>
        ))}
      </address>
    </article>
  );
}
