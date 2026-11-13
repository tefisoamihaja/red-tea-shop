import Image from "next/image";
import Link from "next/link";

// Decorative: the product name next to it is the real link.
export function ProductThumb({
  slug,
  image,
  onClick,
}: {
  slug: string;
  image: string;
  /** e.g. close the bag before leaving */
  onClick?: () => void;
}) {
  return (
    <Link
      href={`/shop/${slug}`}
      onClick={onClick}
      className="relative aspect-[403/504] w-20 shrink-0 overflow-hidden rounded-sm"
      tabIndex={-1}
      aria-hidden
    >
      <Image src={image} alt="" fill sizes="72px" className="object-cover" />
    </Link>
  );
}
