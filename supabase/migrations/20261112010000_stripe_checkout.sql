-- Stripe payments: orders are created once Stripe confirms the payment.
-- Run once in Supabase → SQL Editor, AFTER 20261112000000_orders.sql.

-- Guests can buy too: their orders have no account (user_id null) but keep the email
alter table public.orders alter column user_id drop not null;
alter table public.orders add column if not exists customer_email text;
-- One Stripe Checkout Session = one order (prevents duplicates: success page + webhook)
alter table public.orders add column if not exists stripe_session_id text unique;
-- Shipping address collected by Stripe (name + address), kept as JSON
alter table public.orders add column if not exists shipping jsonb;

-- Creates the order and its lines in one go. Idempotent: calling it twice with the same
-- Stripe session returns the existing order. Only the server (secret key) may call it.
create or replace function public.create_paid_order(
  p_stripe_session_id text,
  p_user_id uuid,
  p_customer_email text,
  p_total numeric,
  p_shipping jsonb,
  p_items jsonb -- [{ "slug", "name", "origin", "unit_price", "quantity" }]
)
returns table (order_id uuid, order_number text)
language plpgsql
security definer
set search_path = ''
as $$
#variable_conflict use_column
declare
  new_id uuid;
begin
  insert into public.orders (user_id, customer_email, total, shipping, stripe_session_id, status)
  values (p_user_id, p_customer_email, p_total, p_shipping, p_stripe_session_id, 'Processing')
  on conflict (stripe_session_id) do nothing
  returning id into new_id;

  if new_id is null then
    -- Already created by a previous call
    return query
      select o.id, o.number from public.orders o where o.stripe_session_id = p_stripe_session_id;
    return;
  end if;

  insert into public.order_items (order_id, product_slug, product_name, origin, unit_price, quantity)
  select new_id, item->>'slug', item->>'name', coalesce(item->>'origin', ''),
         (item->>'unit_price')::numeric, (item->>'quantity')::integer
  from jsonb_array_elements(p_items) as item;

  return query select o.id, o.number from public.orders o where o.id = new_id;
end;
$$;

-- Nobody but the server's secret key (service_role) can run it
revoke all on function public.create_paid_order(text, uuid, text, numeric, jsonb, jsonb) from public, anon, authenticated;
grant execute on function public.create_paid_order(text, uuid, text, numeric, jsonb, jsonb) to service_role;
