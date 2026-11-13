import type { Metadata } from "next";
import { ContentPage } from "@/components/layout/ContentPage";
import { Button } from "@/components/ui/Button";
import { contact } from "@/data/site";

export const metadata: Metadata = {
  title: "Shipping & Returns — XAY Teahouse",
};

export default function ShippingPage() {
  return (
    <ContentPage
      title="Shipping"
      intro="Every order is packed by hand in our Paris teahouse and sealed to keep the leaves fresh."
      updated="November 13, 2026"
      sections={[
        {
          title: "Destinations",
          body: (
            <p>
              We ship to every country of the European Union, as well as Switzerland, Monaco and the
              United Kingdom. Orders to Switzerland and the UK may be subject to local import duties,
              paid on delivery.
            </p>
          ),
        },
        {
          title: "Costs & Times",
          body: (
            <ul>
              <li>Shipping is free on every order.</li>
              <li>Orders are prepared within 1 to 2 business days.</li>
              <li>France: 2 to 3 business days. Rest of Europe: 3 to 6 business days.</li>
              <li>You receive an email with the tracking link as soon as your parcel leaves us.</li>
            </ul>
          ),
        },
        {
          title: "Order Status",
          body: (
            <p>
              Signed in, you can follow each order from your account (Processing, Shipped,
              Delivered). Guest orders are confirmed by email.
            </p>
          ),
        },
        {
          title: "Returns",
          body: (
            <>
              <p>
                You have 14 days after delivery to change your mind. Unopened teas and accessories
                can be returned for a full refund; for hygiene reasons we cannot take back opened
                tea.
              </p>
              <p>
                Write to <a href={`mailto:${contact.email}`}>{contact.email}</a> with your order
                number: we reply within two business days with the return instructions. Refunds are
                made on the original payment method within 14 days of receiving the parcel.
              </p>
            </>
          ),
        },
        {
          title: "Damaged Parcel",
          body: (
            <p>
              If your parcel arrives damaged or incomplete, send us a photo within 7 days: we will
              ship a replacement at no cost.
            </p>
          ),
        },
      ]}
    >
      <div className="flex flex-wrap gap-6">
        <Button href="/shop">Explore Collection</Button>
        <Button href={`mailto:${contact.email}`} variant="solid" size="md">
          Contact Us
        </Button>
      </div>
    </ContentPage>
  );
}
