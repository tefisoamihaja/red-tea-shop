import { ArticleRow } from "@/components/cards/ArticleRow";
import { articles } from "@/data/journal";

export function Journal() {
  return (
    <section className="flex flex-col gap-12 px-6 pt-32 pb-24 md:gap-16 md:px-10 md:pt-40 md:pb-32 xl:gap-24 xl:px-16 xl:pt-60 xl:pb-40">
      <h2 className="heading text-6xl md:text-7xl xl:text-8xl">Journal</h2>

      <ul className="border-b border-tea-500/10">
        {articles.map((article) => (
          <ArticleRow key={article.slug} article={article} />
        ))}
      </ul>
    </section>
  );
}
