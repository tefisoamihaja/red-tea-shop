-- Orders of signed-in customers (account page "Order History" + /account/orders).
-- Run once in Supabase: Dashboard → SQL Editor → paste → Run.

-- Human-readable order numbers: XAY-10001, XAY-10002…
create sequence if not exists public.order_number_seq start 10001;

create table if not exists public.orders (
  id uuid primary key default gen_random_uuid(),
  number text not null unique default ('XAY-' || nextval('public.order_number_seq')),
  user_id uuid not null default auth.uid() references auth.users (id) on delete cascade,
  created_at timestamptz not null default now(),
  status text not null default 'Processing'
    check (status in ('Processing', 'Shipped', 'Delivered', 'Archived')),
  -- Amount paid in euros (items + shipping), frozen at purchase time
  total numeric(10, 2) not null check (total >= 0)
);

-- What was bought: a copy of the product at purchase time (the catalog can change later)
create table if not exists public.order_items (
  id bigint generated always as identity primary key,
  order_id uuid not null references public.orders (id) on delete cascade,
  product_slug text not null,
  product_name text not null,
  origin text not null default '',
  unit_price numeric(10, 2) not null check (unit_price >= 0),
  quantity integer not null check (quantity > 0)
);

create index if not exists orders_user_id_created_at_idx on public.orders (user_id, created_at desc);
create index if not exists order_items_order_id_idx on public.order_items (order_id);

-- Row Level Security: a customer can only read their own orders.
-- No insert/update/delete policy: orders will be created by the server (checkout), never by the browser.
alter table public.orders enable row level security;
alter table public.order_items enable row level security;

drop policy if exists "Customers read their own orders" on public.orders;
create policy "Customers read their own orders"
  on public.orders for select
  to authenticated
  using ((select auth.uid()) = user_id);

drop policy if exists "Customers read their own order items" on public.order_items;
create policy "Customers read their own order items"
  on public.order_items for select
  to authenticated
  using (
    exists (
      select 1 from public.orders o
      where o.id = order_items.order_id and o.user_id = (select auth.uid())
    )
  );
