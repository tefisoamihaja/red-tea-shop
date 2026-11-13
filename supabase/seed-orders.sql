-- TEST DATA: gives sample orders (those of the Figma) to ONE existing account.
-- Run in Supabase SQL Editor AFTER the migration. Not for production.
-- By default it uses the most recently created account; to pick another one,
-- replace the line marked "choose the account" with:  where email = 'you@example.com'

do $$
declare
  customer uuid;
  o uuid;
begin
  select id into customer from auth.users
  order by created_at desc limit 1; -- choose the account

  if customer is null then
    raise exception 'No account found: register on the site first.';
  end if;

  insert into public.orders (number, user_id, created_at, status, total)
  values ('XAY-9902', customer, '2024-10-12', 'Delivered', 84) returning id into o;
  insert into public.order_items (order_id, product_slug, product_name, origin, unit_price, quantity) values
    (o, 'imperial-crimson', 'Imperial Crimson', 'Sichuan Highlands', 48, 1),
    (o, 'bamboo-whisk', 'Ceremonial Bamboo Whisk', 'Accessory', 36, 1);

  insert into public.orders (number, user_id, created_at, status, total)
  values ('XAY-8741', customer, '2024-09-28', 'Delivered', 124) returning id into o;
  insert into public.order_items (order_id, product_slug, product_name, origin, unit_price, quantity) values
    (o, 'midnight-oolong', 'Midnight Oolong', 'Wuyi Mountains', 62, 2);

  insert into public.orders (number, user_id, created_at, status, total)
  values ('XAY-8210', customer, '2024-08-15', 'Shipped', 35) returning id into o;
  insert into public.order_items (order_id, product_slug, product_name, origin, unit_price, quantity) values
    (o, 'velvet-jasmine', 'Velvet Jasmine', 'Fujian Coast', 35, 1);

  insert into public.orders (number, user_id, created_at, status, total)
  values ('XAY-7605', customer, '2024-07-02', 'Archived', 75) returning id into o;
  insert into public.order_items (order_id, product_slug, product_name, origin, unit_price, quantity) values
    (o, 'golden-peak', 'Golden Peak', 'Yunnan Province', 75, 1);
end $$;
