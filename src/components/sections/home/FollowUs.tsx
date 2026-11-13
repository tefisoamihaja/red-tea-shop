import Image from "next/image";
import { instagramUrl } from "@/data/site";

const posts = [1, 2, 3, 4].map((n) => `/images/follow-${n}.jpg`);

export function FollowUs() {
  return (
    <section className="flex flex-col gap-12 px-6 pt-24 pb-32 md:gap-16 md:px-10 md:pt-32 md:pb-40 xl:gap-24 xl:px-16 xl:pt-40 xl:pb-60">
      <h2 className="heading text-center text-6xl md:text-7xl xl:text-8xl">Follow Us</h2>
      <ul className="grid grid-cols-2 gap-4 md:grid-cols-4 md:gap-6 xl:gap-8">
        {posts.map((src, i) => (
          <li key={src}>
            <a
              href={instagramUrl}
              target="_blank"
              rel="noreferrer"
              className="relative block aspect-square overflow-hidden rounded-panel transition-opacity xl:rounded-card duration-250 ease-out hover:opacity-80"
            >
              <Image
                src={src}
                alt={`XAY Teahouse on Instagram, post ${i + 1}`}
                fill
                sizes="(min-width: 1440px) 310px, (min-width: 768px) 25vw, 50vw"
                className="object-cover"
              />
            </a>
          </li>
        ))}
      </ul>
    </section>
  );
}
