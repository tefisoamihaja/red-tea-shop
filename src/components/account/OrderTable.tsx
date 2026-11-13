import { Badge } from "@/components/ui/Badge";
import { ReorderButton } from "@/components/cart/ReorderButton";
import { productIcons, type ProductIconName } from "@/components/ui/product-icons";
import { formatDate, formatPrice } from "@/lib/format";
import type { Order, Product } from "@/types";

// Column widths from the Figma, in % of the table
const widths = ["16.52%", "14.35%", "38.26%", "9.56%", "9.56%", "11.75%"];

const cell = "first:pl-8 last:pr-8";

const iconNames = Object.keys(productIcons) as ProductIconName[];

// Same product, same icon
function iconFor(slug: string): ProductIconName {
  let hash = 0;
  for (const char of slug) hash = (hash * 31 + char.charCodeAt(0)) >>> 0;
  return iconNames[hash % iconNames.length];
}

function describe(order: Order) {
  const [first, ...rest] = order.items;
  if (!first) return { selection: "—", detail: "", icon: iconNames[0] };
  return {
    selection: first.quantity > 1 ? `${first.productName} ×${first.quantity}` : first.productName,
    detail: rest.length > 0 ? `+ ${rest.map((item) => item.productName).join(", ")}` : first.origin,
    icon: iconFor(first.productSlug),
  };
}

function reorderItems(order: Order, catalog: Map<string, Product>) {
  const items: { product: Product; quantity: number }[] = [];
  for (const item of order.items) {
    const product = catalog.get(item.productSlug);
    if (product) items.push({ product, quantity: item.quantity });
  }
  return { items, unavailable: order.items.length - items.length };
}

function OrderTableRow({ order, catalog }: { order: Order; catalog: Map<string, Product> }) {
  const { selection, detail, icon } = describe(order);
  const reorder = reorderItems(order, catalog);
  const Icon = productIcons[icon];
  const archived = order.status === "Archived";

  return (
    // py-10 on every cell gives the 130px rows of the Figma
    <tr className="border-b border-tea-500/10 *:py-10">
      <td className={`${cell} font-display text-xl font-bold tracking-wider`}>#{order.number}</td>
      <td className={cell}>
        <time dateTime={order.date} className="text-xs font-light tracking-wider uppercase">
          {formatDate(order.date, { padDay: true })}
        </time>
      </td>
      <td className={cell}>
        <div className="flex items-center gap-6">
          <span className="flex size-16 shrink-0 items-center justify-center rounded-full bg-mist">
            <Icon className="size-8 opacity-30" />
          </span>
          <div>
            <p className="text-base font-semibold tracking-widest uppercase">{selection}</p>
            <p className="text-2xs tracking-ultra uppercase opacity-50">{detail}</p>
          </div>
        </div>
      </td>
      <td className={cell}>
        <Badge variant="strong" className={archived ? "text-tea-500/40" : undefined}>
          {order.status}
        </Badge>
      </td>
      <td className={`${cell} text-right font-display text-2xl font-bold tracking-wider`}>
        {formatPrice(order.total, { decimals: true })}
      </td>
      <td className={`${cell} text-right`}>
        <ReorderButton orderNumber={order.number} {...reorder} />
      </td>
    </tr>
  );
}

export function OrderTable({ orders, products }: { orders: Order[]; products: Product[] }) {
  const catalog = new Map(products.map((product) => [product.slug, product]));

  return (
    <table className="w-full min-w-250 table-fixed border-collapse text-left xl:min-w-0">
      <colgroup>
        {widths.map((width, i) => (
          <col key={i} style={{ width }} />
        ))}
      </colgroup>
      <thead>
        <tr className="label border-b border-tea-500/20 font-bold">
          {["Order ID", "Date", "Selection", "Status"].map((title) => (
            <th key={title} scope="col" className={`${cell} py-6 font-bold opacity-60`}>
              {title}
            </th>
          ))}
          <th scope="col" className={`${cell} py-6 text-right font-bold opacity-60`}>
            Total
          </th>
          <th scope="col" className={cell}>
            <span className="sr-only">Actions</span>
          </th>
        </tr>
      </thead>
      <tbody>
        {orders.map((order) => (
          <OrderTableRow key={order.id} order={order} catalog={catalog} />
        ))}
      </tbody>
    </table>
  );
}
