import type { Metadata } from "next";
import Image from "next/image";
import { Button } from "@/components/ui/Button";
import { Reveal } from "@/components/ui/Reveal";

export const metadata: Metadata = {
  title: "Our Story — XAY Teahouse",
  description: "The Red Philosophy: single-estate teas, ancient precision, modern minimalism.",
};

const pillars = [
  {
    title: "Single Estate",
    text: "Every leaf comes from one garden and one harvest. We never blend, so each tea keeps the voice of its soil and season.",
  },
  {
    title: "Soil First",
    text: "We work with farms that protect their soil and pay their pickers fairly. Fewer gardens, longer friendships.",
  },
  {
    title: "Slow Craft",
    text: "Hand-rolled, slowly oxidised, carefully roasted: the old gestures of tea masters, kept intact.",
  },
  {
    title: "The Ritual",
    text: "Tea is a pause. Our cups, trays and brewing guides are designed to make that moment simple and beautiful.",
  },
];

export default function PhilosophyPage() {
  return (
    <div className="flex flex-col gap-24 pt-32 pb-24 xl:gap-40 xl:pt-48 xl:pb-40">
      <Reveal as="header" className="flex flex-col gap-8 px-6 md:px-10 xl:px-16">
        <p className="label opacity-60">Our Story</p>
        <h1 className="heading text-5xl leading-[0.85] md:text-9xl xl:text-10xl">
          The Red
          <br />
          Philosophy
        </h1>
      </Reveal>

      <Reveal as="section" className="grid items-center gap-12 rounded-panel bg-tea-500 px-6 py-24 text-white md:rounded-card md:px-10 md:py-32 xl:grid-cols-2 xl:gap-32 xl:px-16">
        <div className="relative aspect-square overflow-hidden rounded-panel md:aspect-[4/3] md:rounded-card xl:aspect-square">
          <Image
            src="/images/philosophy.jpg"
            alt="Tea leaves being prepared"
            fill
            priority
            sizes="(min-width: 1440px) 605px, (min-width: 1280px) 42vw, 100vw"
            className="object-cover"
          />
        </div>
        <div className="flex flex-col gap-8">
          <blockquote className="font-display text-2xl leading-snug font-bold tracking-wider uppercase md:text-3xl">
            &ldquo;At XAY, we believe tea is not a beverage, but a visual and tactile journey. Red is
            our heart, our passion, and our heritage.&rdquo;
          </blockquote>
          <hr className="border-white/30" />
          <p className="text-base">
            Founded in 2024 in Paris, XAY Teahouse marries the ancient precision of tea masters with
            the modern minimalism of high-end fashion. We travel to the gardens ourselves, taste every
            harvest, and only keep the teas we would serve at our own table.
          </p>
          <p className="text-base">
            Red is where it started: the deep, honeyed red teas of Sichuan and Yunnan, still little
            known in Europe. Green teas and oolongs followed, chosen with the same care.
          </p>
        </div>
      </Reveal>

      <Reveal as="section" className="flex flex-col gap-12 px-6 md:px-10 xl:gap-16 xl:px-16">
        <h2 className="heading text-5xl md:text-6xl xl:text-7xl">What We Believe</h2>
        <ul className="grid gap-x-10 gap-y-12 md:grid-cols-2 xl:grid-cols-4 xl:gap-x-16">
          {pillars.map((pillar, i) => (
            <li key={pillar.title} className="flex flex-col gap-4 border-t border-tea-500/20 pt-8">
              <span className="label opacity-40">{String(i + 1).padStart(2, "0")}</span>
              <h3 className="font-display text-3xl font-bold tracking-wider uppercase">{pillar.title}</h3>
              <p className="text-base opacity-80">{pillar.text}</p>
            </li>
          ))}
        </ul>
      </Reveal>

      <Reveal as="section" className="flex flex-col items-center gap-10 px-6 text-center md:px-10 xl:px-16">
        <h2 className="heading text-5xl md:text-6xl">Taste the Philosophy</h2>
        <Button href="/shop">Explore Collection</Button>
      </Reveal>
    </div>
  );
}
