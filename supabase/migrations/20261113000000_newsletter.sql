-- Newsletter "Join the List" (home page). Run once in Supabase → SQL Editor.
-- Written only by the server (secret key): RLS on, no policy → the browser can neither read nor write.

create table if not exists public.newsletter_subscribers (
  email text primary key check (email = lower(email) and length(email) <= 254),
  created_at timestamptz not null default now()
);

alter table public.newsletter_subscribers enable row level security;
