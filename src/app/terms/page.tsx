import type { Metadata } from "next";
import Link from "next/link";
import { ContentPage } from "@/components/layout/ContentPage";
import { contact } from "@/data/site";

export const metadata: Metadata = {
  title: "Terms of Sale — XAY Teahouse",
};

// TODO: legal review before going live (company details, mediator)
export default function TermsPage() {
  return (
    <ContentPage
      title="Terms"
      intro="The conditions that apply to every order placed on xayteahouse.com."
      updated="November 13, 2026"
      sections={[
        {
          title: "Seller",
          body: (
            <p>
              XAY Teahouse, {contact.address}. Contact:{" "}
              <a href={`mailto:${contact.email}`}>{contact.email}</a>.
            </p>
          ),
        },
        {
          title: "Prices",
          body: (
            <p>
              Prices are shown in euros, all taxes included. Shipping is free. The price charged is
              the one shown when you confirm your payment.
            </p>
          ),
        },
        {
          title: "Orders & Payment",
          body: (
            <p>
              You can order with an account or as a guest. Your order is final once the payment is
              accepted by Stripe; you then receive a confirmation with your order number.
            </p>
          ),
        },
        {
          title: "Delivery",
          body: (
            <p>
              Destinations, costs and times are described on the{" "}
              <Link href="/shipping">Shipping &amp; Returns</Link> page.
            </p>
          ),
        },
        {
          title: "Right of Withdrawal",
          body: (
            <p>
              You have 14 days after delivery to withdraw from your purchase, without giving a
              reason, for unopened products. Opened food products cannot be returned (article
              L221-28 of the French Consumer Code).
            </p>
          ),
        },
        {
          title: "Personal Data",
          body: (
            <p>
              See our <Link href="/privacy">Privacy Policy</Link>.
            </p>
          ),
        },
        {
          title: "Disputes",
          body: (
            <p>
              These terms are governed by French law. In case of a dispute, contact us first: we will
              look for a friendly solution. You may also use the European online dispute resolution
              platform.
            </p>
          ),
        },
      ]}
    />
  );
}
