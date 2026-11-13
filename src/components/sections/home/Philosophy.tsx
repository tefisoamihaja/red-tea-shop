import Image from "next/image";
import { Button } from "@/components/ui/Button";

export function Philosophy() {
  return (
    <section
      id="philosophy"
      className="grid scroll-mt-8 items-center gap-12 rounded-panel bg-tea-500 px-6 py-24 text-white md:rounded-card md:px-10 md:py-32 xl:grid-cols-2 xl:gap-32 xl:px-16 xl:pt-60 xl:pb-40"
    >
      <div className="flex flex-col gap-10 xl:gap-16">
        <h2 className="heading text-5xl leading-[0.9] md:text-6xl xl:text-7xl">The Red Philosophy</h2>
        <div className="relative aspect-square overflow-hidden rounded-panel md:aspect-[4/3] md:rounded-card xl:aspect-square">
          <Image
            src="/images/philosophy.jpg"
            alt="Tea leaves being prepared"
            fill
            sizes="(min-width: 1440px) 605px, (min-width: 1280px) 42vw, 100vw"
            className="object-cover"
          />
        </div>
      </div>

      <div className="flex flex-col">
        <blockquote className="max-w-156 font-display text-2xl leading-snug md:text-3xl font-bold tracking-wider uppercase">
          &ldquo;At XAY, we believe tea is not a beverage, but a visual and tactile journey. Red is
          our heart, our passion, and our heritage.&rdquo;
        </blockquote>
        <hr className="my-8 border-white/30 xl:my-12" />
        <p className="text-base font-bold tracking-wider">
          Founded in 2024, XAY Teahouse marries the ancient precision of tea masters with the
          modern minimalism of high-end fashion. Every leaf is sourced from single-estate farms
          that prioritize soil health and community welfare.
        </p>
        <div className="pt-10 xl:pt-12">
          <Button variant="white" href="/philosophy">
            Read Our Story
          </Button>
        </div>
      </div>
    </section>
  );
}
