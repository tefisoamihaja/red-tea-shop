import { Badge } from "@/components/ui/Badge";
import { formatDate, formatPrice } from "@/lib/format";
import type { Order } from "@/types";

export function OrderRow({ order }: { order: Order }) {
  return (
    <li className="flex flex-col border-b border-tea-500/10 px-4 pt-8 pb-8 first:border-t">
      <p className="flex min-h-6 flex-wrap items-center gap-x-1">
        <span className="label font-bold">#{order.number}</span>
        <time dateTime={order.date} className="text-xs uppercase opacity-60">
          {formatDate(order.date, { padDay: true })}
        </time>
        <span className="text-xs font-semibold">{formatPrice(order.total, { decimals: true })}</span>
      </p>
      <Badge className="self-end">{order.status}</Badge>
    </li>
  );
}
