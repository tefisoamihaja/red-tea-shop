import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { OrderTable } from "@/components/account/OrderTable";
import { OrdersNotice } from "@/components/account/OrdersNotice";
import { requireUser } from "@/lib/auth";
import { getMyOrders } from "@/lib/orders";
import { getProducts } from "@/lib/products";
import { Reveal } from "@/components/ui/Reveal";

export const metadata: Metadata = {
  title: "Order History — XAY Teahouse",
};

export default function OrdersPage() {
  return (
    // Reads cookies, so it has to stream inside <Suspense>
    <Suspense fallback={<div className="min-h-screen" aria-busy="true" />}>
      <OrdersContent />
    </Suspense>
  );
}

async function OrdersContent() {
  const user = await requireUser();
  const [orders, products] = await Promise.all([getMyOrders(), getProducts()]);

  return (
    <div className="flex flex-col gap-16 px-6 pt-32 pb-24 md:px-10 xl:px-16 xl:pt-67 xl:pb-40">
      <Reveal as="header" className="flex flex-col items-start gap-8 md:flex-row md:items-end md:justify-between">
        <div className="flex flex-col gap-4">
          <nav aria-label="Breadcrumb" className="label flex items-center gap-4 opacity-50">
            <Link href="/account" className="link-fade">
              Dashboard
            </Link>
            <span aria-hidden="true">/</span>
            <span aria-current="page" className="font-bold">
              Order History
            </span>
          </nav>
          <h1 className="heading text-6xl leading-[0.85] md:text-7xl">Archive</h1>
        </div>
        <div className="flex flex-col gap-1 md:items-end">
          <p className="label opacity-50">Customer Identity</p>
          <p className="font-display text-3xl font-bold tracking-wider uppercase">{user.fullName || user.email}</p>
        </div>
      </Reveal>

      <Reveal delay={0.15}>
        {orders === null ? (
          <OrdersNotice kind="error" />
        ) : orders.length === 0 ? (
          <OrdersNotice kind="empty" />
        ) : (
          // Scrolls sideways below desktop (6 columns)
          <div className="-mx-6 overflow-x-auto px-6 md:mx-0 md:px-0">
            <OrderTable orders={orders} products={products} />
          </div>
        )}
      </Reveal>

      <div className="flex flex-col items-center gap-8 pt-8">
        <p className="label opacity-50">End of History</p>
        <span aria-hidden="true" className="h-40 w-px bg-linear-to-b from-tea-500/20 to-transparent" />
      </div>
    </div>
  );
}
