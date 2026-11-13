export type Brewing = {
  /** e.g. "3 g / 200 ml" */
  amount: string;
  /** e.g. "80 °C" */
  temperature: string;
  /** e.g. "2 min" */
  time: string;
};

export type Product = {
  slug: string;
  name: string;
  origin: string;
  /** One of the catalog categories ("Red Tea", "Green Tea", "Oolong") */
  category: string;
  /** Price in euros */
  price: number;
  image: string;
  /** Net weight of the pack, e.g. "100 g" */
  weight?: string;
  description?: string;
  /** Tasting notes */
  notes?: string[];
  brewing?: Brewing;
};

export type Article = {
  slug: string;
  title: string;
  /** ISO date, e.g. "2024-06-08" */
  date: string;
  /** Short answer to the title (shown in a popup on the home page) */
  answer: string;
};

export type Testimonial = {
  quote: string;
  author: string;
  role: string;
};

export type OrderStatus = "Processing" | "Shipped" | "Delivered" | "Archived";

/** A line of an order: copy of the product at purchase time */
export type OrderItem = {
  productSlug: string;
  productName: string;
  origin: string;
  /** Price of one unit, in euros */
  unitPrice: number;
  quantity: number;
};

export type Order = {
  /** Database id (uuid) */
  id: string;
  /** Shown as "#XAY-99021" */
  number: string;
  /** ISO date-time */
  date: string;
  /** Total paid, in euros */
  total: number;
  status: OrderStatus;
  items: OrderItem[];
};

/** A shipping address (from the customer's past orders) */
export type Address = {
  id: string;
  /** Recipient name */
  label: string;
  lines: string[];
};

export type NavLink = {
  label: string;
  href: string;
};

/** A product in the cart: a snapshot of what is shown in the bag, plus the quantity */
export type CartLine = Pick<Product, "slug" | "name" | "origin" | "price" | "image"> & {
  quantity: number;
};

/** A saved product in the wishlist: same snapshot as a cart line, without quantity */
export type WishlistItem = Pick<Product, "slug" | "name" | "origin" | "price" | "image">;
