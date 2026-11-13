import type { Metadata } from "next";
import Link from "next/link";
import { ContentPage } from "@/components/layout/ContentPage";
import { contact } from "@/data/site";

export const metadata: Metadata = {
  title: "Privacy Policy — XAY Teahouse",
};

// TODO: legal review before going live
export default function PrivacyPage() {
  return (
    <ContentPage
      title="Privacy"
      intro="We collect as little as possible, never sell your data, and only use it to serve your orders."
      updated="November 13, 2026"
      sections={[
        {
          title: "Who We Are",
          body: (
            <p>
              XAY Teahouse, {contact.address}, is responsible for the personal data collected on this
              site. For any question, write to <a href={`mailto:${contact.email}`}>{contact.email}</a>.
            </p>
          ),
        },
        {
          title: "What We Collect",
          body: (
            <ul>
              <li>Your account: name, email address and password (stored encrypted).</li>
              <li>Your orders: items, amounts, email and shipping address.</li>
              <li>Your newsletter subscription, if you join the list.</li>
            </ul>
          ),
        },
        {
          title: "Payments",
          body: (
            <p>
              Payments are handled by Stripe on its own secure page. Your card details never reach
              our servers: we only receive the confirmation of payment and the shipping address.
            </p>
          ),
        },
        {
          title: "Cookies & Storage",
          body: (
            <>
              <p>
                We use no advertising or tracking cookies. A single cookie keeps you signed in, and
                your bag and wishlist are saved in your own browser (local storage), not on our
                servers.
              </p>
              <p>Because these are strictly necessary, no consent banner is required.</p>
            </>
          ),
        },
        {
          title: "Who Has Access",
          body: (
            <p>
              Only our team and the providers we need to run the shop: Supabase (accounts and
              orders, hosted in the EU), Stripe (payments) and our carrier (delivery). They process
              your data on our behalf only.
            </p>
          ),
        },
        {
          title: "How Long",
          body: (
            <p>
              Account data is kept until you close your account. Order records are kept for 10 years,
              as required by French accounting law.
            </p>
          ),
        },
        {
          title: "Your Rights",
          body: (
            <p>
              Under the GDPR you can access, correct, export or delete your data, and object to its
              use. Write to <a href={`mailto:${contact.email}`}>{contact.email}</a>; we answer within
              a month. You can also contact the CNIL (cnil.fr). See also our{" "}
              <Link href="/terms">Terms of Sale</Link>.
            </p>
          ),
        },
      ]}
    />
  );
}
