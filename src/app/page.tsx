import { CategoryMarquee } from "@/components/sections/home/CategoryMarquee";
import { Contact } from "@/components/sections/home/Contact";
import { FeaturedSelection } from "@/components/sections/home/FeaturedSelection";
import { FollowUs } from "@/components/sections/home/FollowUs";
import { Hero } from "@/components/sections/home/Hero";
import { Journal } from "@/components/sections/home/Journal";
import { Newsletter } from "@/components/sections/home/Newsletter";
import { Philosophy } from "@/components/sections/home/Philosophy";
import { TopSales } from "@/components/sections/home/TopSales";
import { Voices } from "@/components/sections/home/Voices";
import { Reveal } from "@/components/ui/Reveal";
import { getCategories } from "@/lib/products";

export default async function Home() {
  const categories = await getCategories();

  return (
    <>
      <Reveal>
        <Hero />
      </Reveal>
      <Reveal>
        <TopSales />
      </Reveal>
      <Reveal>
        <FeaturedSelection />
      </Reveal>
      <Reveal>
        <CategoryMarquee categories={categories} />
      </Reveal>
      <Reveal>
        <Philosophy />
      </Reveal>
      <Reveal>
        <Journal />
      </Reveal>
      <Reveal>
        <Voices />
      </Reveal>
      <Reveal>
        <Newsletter />
      </Reveal>
      <Reveal>
        <FollowUs />
      </Reveal>
      <Reveal>
        <Contact />
      </Reveal>
    </>
  );
}
