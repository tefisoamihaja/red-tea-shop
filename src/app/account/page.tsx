import type { Metadata } from "next";
import Link from "next/link";
import { Suspense, type ReactNode } from "react";
import { signOut } from "@/app/actions/auth";
import { AccountNav } from "@/components/account/AccountNav";
import { AddressCard } from "@/components/account/AddressCard";
import { OrderRow } from "@/components/account/OrderRow";
import { OrdersNotice } from "@/components/account/OrdersNotice";
import { SettingRow } from "@/components/account/SettingRow";
import { EmptyState } from "@/components/ui/EmptyState";
import { requireUser } from "@/lib/auth";
import { isSubscribed } from "@/lib/newsletter";
import { getMyOrders, getMyShippingAddresses } from "@/lib/orders";
import { Reveal } from "@/components/ui/Reveal";

export const metadata: Metadata = {
  title: "Your Account — XAY Teahouse",
};

function AccountSection({
  id,
  title,
  action,
  children,
}: {
  id: string;
  title: string;
  action?: ReactNode;
  children: ReactNode;
}) {
  return (
    <Reveal as="section" id={id} aria-labelledby={`${id}-title`} className="flex scroll-mt-8 flex-col gap-12">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <h2 id={`${id}-title`} className="heading text-4xl leading-normal md:text-5xl">
          {title}
        </h2>
        {action}
      </div>
      {children}
    </Reveal>
  );
}

export default function AccountPage() {
  return (
    // Reads cookies, so it has to stream inside <Suspense>
    <Suspense fallback={<div className="min-h-screen" aria-busy="true" />}>
      <AccountContent />
    </Suspense>
  );
}

async function AccountContent() {
  const user = await requireUser();
  // Only the 2 latest here, the full list is on /account/orders
  const [orders, addresses, subscribed] = await Promise.all([
    getMyOrders({ limit: 2 }),
    getMyShippingAddresses(),
    isSubscribed(user.email),
  ]);

  return (
    <div className="flex flex-col gap-16 px-6 pt-32 pb-24 md:px-10 xl:gap-32 xl:px-16 xl:pt-48 xl:pb-40">
      <Reveal as="header" className="flex flex-col gap-4">
        <h1 className="heading text-6xl leading-display md:text-8xl">
          Welcome,
          <br />
          {user.firstName}
        </h1>
        <div className="label flex items-center gap-4 opacity-60">
          <span>Member since {user.memberSince}</span>
          <span aria-hidden="true">•</span>
          <form action={signOut} className="contents">
            <button type="submit" className="link-fade uppercase">
              Logout
            </button>
          </form>
        </div>
      </Reveal>

      <div className="grid gap-16 xl:grid-cols-[266px_1fr] xl:gap-24">
        <Reveal className="self-start xl:sticky xl:top-8">
          <AccountNav />
        </Reveal>

        <div className="flex flex-col gap-24 xl:gap-40">
          <AccountSection
            id="orders"
            title="Order History"
            action={
              <Link href="/account/orders" className="label link-fade pb-4">
                View All
              </Link>
            }
          >
            {orders === null ? (
              <OrdersNotice kind="error" />
            ) : orders.length === 0 ? (
              <OrdersNotice kind="empty" />
            ) : (
              <ul>
                {orders.map((order) => (
                  <OrderRow key={order.id} order={order} />
                ))}
              </ul>
            )}
          </AccountSection>

          <AccountSection id="addresses" title="Addresses">
            {addresses && addresses.length > 0 ? (
              <div className="grid gap-8 md:grid-cols-2">
                {addresses.map((address, index) => (
                  <AddressCard key={address.id} address={address} latest={index === 0} />
                ))}
              </div>
            ) : (
              <EmptyState action={null}>
                {addresses === null
                  ? "Your addresses are unavailable right now. Please try again later."
                  : "No address yet. The shipping address of your first order will appear here."}
              </EmptyState>
            )}
          </AccountSection>

          <AccountSection id="settings" title="Account Settings">
            <ul className="border-t border-tea-500/10">
              <SettingRow label="Email Address" value={user.email} />
              <SettingRow label="Password" value="••••••••••••" href="/reset-password" />
              {subscribed !== null && (
                <SettingRow
                  label="Newsletter Preference"
                  value={subscribed ? "Subscribed · Exclusive drops" : "Not subscribed"}
                />
              )}
            </ul>
          </AccountSection>
        </div>
      </div>
    </div>
  );
}
