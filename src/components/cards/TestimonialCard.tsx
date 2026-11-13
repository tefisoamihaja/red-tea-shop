import { UserIcon } from "@/components/ui/icons";
import type { Testimonial } from "@/types";

export function TestimonialCard({ testimonial }: { testimonial: Testimonial }) {
  return (
    <figure className="flex h-full flex-col justify-between gap-8 rounded-panel border border-tea-500/10 p-6 md:rounded-card md:p-8 transition duration-250 ease-out hover:border-tea-500 hover:bg-blush-50 hover:shadow-soft">
      <blockquote className="text-md leading-relaxed italic opacity-80">
        &ldquo;{testimonial.quote}&rdquo;
      </blockquote>
      <figcaption className="flex items-center gap-4">
        <span className="flex size-12 shrink-0 items-center justify-center rounded-full bg-mist">
          <UserIcon className="size-6 opacity-30" />
        </span>
        <span className="flex flex-col">
          <span className="text-sm font-semibold tracking-widest uppercase">{testimonial.author}</span>
          <span className="text-xs tracking-wide opacity-50">{testimonial.role}</span>
        </span>
      </figcaption>
    </figure>
  );
}
