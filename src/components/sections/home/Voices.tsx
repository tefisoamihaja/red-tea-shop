import { TestimonialCard } from "@/components/cards/TestimonialCard";
import { testimonials } from "@/data/testimonials";

export function Voices() {
  return (
    <section className="flex flex-col gap-12 px-6 py-24 md:gap-16 md:px-10 md:py-32 xl:gap-24 xl:px-16 xl:py-40">
      <h2 className="heading text-center text-6xl md:text-7xl xl:text-8xl">Voices</h2>
      <ul className="grid gap-6 md:gap-8 xl:grid-cols-3 xl:gap-16">
        {testimonials.map((testimonial) => (
          <li key={testimonial.author}>
            <TestimonialCard testimonial={testimonial} />
          </li>
        ))}
      </ul>
    </section>
  );
}
