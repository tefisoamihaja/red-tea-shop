import { Button } from "@/components/ui/Button";
import { HeroVideo } from "./HeroVideo";

export function Hero() {
  return (
    <section className="grid gap-12 px-6 pt-24 pb-16 md:px-10 md:pt-32 xl:grid-cols-[483fr_813fr] xl:items-center xl:gap-8 xl:px-16 xl:pt-40 xl:pb-20">
      <div className="flex flex-col">
        <h1 className="heading text-8xl leading-display pb-8 md:text-10xl">
          Pure
          <br />
          Red
          <br />
          Tea
        </h1>
        <p className="max-w-68 text-sm leading-relaxed font-light tracking-wide uppercase">
          Elevating the tea experience through curated selection and architectural design. XAY is
          the future of luxury infusion.
        </p>
        <div className="pt-10 xl:pt-16">
          <Button href="/shop">Explore Collection</Button>
        </div>
      </div>

      <div className="relative aspect-[813/770] overflow-hidden rounded-panel bg-tea-500 md:rounded-card">
        <HeroVideo />
      </div>
    </section>
  );
}
