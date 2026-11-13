import type { ReactNode } from "react";
import { InstagramIcon, MailIcon, MapPinIcon } from "@/components/ui/icons";
import { contact, instagramUrl } from "@/data/site";

function InfoBlock({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="flex flex-col gap-2">
      <p className="label opacity-50">{label}</p>
      {children}
    </div>
  );
}

const iconLinks = [
  { label: "Instagram", href: instagramUrl, Icon: InstagramIcon },
  { label: "Email", href: `mailto:${contact.email}`, Icon: MailIcon },
  { label: "Map", href: contact.mapUrl, Icon: MapPinIcon },
];

export function Contact() {
  return (
    <section className="mb-12 grid gap-16 rounded-panel bg-tea-500 px-6 py-24 text-white md:rounded-card md:px-10 md:py-32 xl:mb-20 xl:grid-cols-2 xl:gap-32 xl:px-16 xl:py-40">
      <div className="flex flex-col gap-8 xl:gap-16">
        <h2 className="heading text-5xl leading-[0.9] md:text-6xl xl:text-7xl">Get In Touch</h2>
        <p className="max-w-100 text-base font-bold tracking-wider">
          Whether you have questions about our sourcing, wish to collaborate, or want to experience
          a private tasting — we are here.
        </p>
      </div>

      <div className="flex flex-col gap-10 xl:gap-12">
        <InfoBlock label="Email">
          <a
            href={`mailto:${contact.email}`}
            className="font-display text-xl font-semibold tracking-wider uppercase transition-opacity duration-250 ease-out hover:opacity-60"
          >
            {contact.email}
          </a>
        </InfoBlock>
        <InfoBlock label="Visit">
          <p className="text-lg font-light tracking-wide uppercase">{contact.address}</p>
        </InfoBlock>
        <InfoBlock label="Hours">
          <p className="text-lg font-light tracking-wide uppercase">{contact.hours}</p>
        </InfoBlock>

        <ul className="flex gap-4 pt-4">
          {iconLinks.map(({ label, href, Icon }) => (
            <li key={label}>
              <a
                href={href}
                aria-label={label}
                className="flex size-12 items-center justify-center rounded-full border border-white/30 transition-colors duration-250 ease-out hover:bg-white hover:text-tea-500"
              >
                <Icon className="size-4" />
              </a>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
