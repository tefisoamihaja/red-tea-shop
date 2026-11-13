# XAY Teahouse — Red Tea Shop

Tea e-commerce site: Next.js 16 (App Router, Cache Components), React 19, Tailwind CSS 4, Supabase (auth, orders, newsletter), Stripe Checkout.
Detailed project notes (design tokens, architecture, decisions): see `CLAUDE.md`.

## Setup

```bash
npm install
cp .env.example .env.local   # then fill in the keys
npm run dev                  # http://localhost:3000
```

Run the SQL files of `supabase/migrations/` in order, once, in Supabase → SQL Editor.

## Checks

```bash
npm run lint
npm run build
```

## Going live — checklist

- [ ] `NEXT_PUBLIC_SITE_URL` set to the public https address (email links, Stripe return pages, sitemap).
- [ ] Supabase: Site URL + Redirect URL `https://<domain>/auth/confirm`; custom SMTP for auth emails.
- [ ] All 3 migrations run (`orders`, `stripe_checkout`, `newsletter`).
- [ ] Stripe: live keys (`sk_live_…`), webhook endpoint `https://<domain>/api/stripe/webhook`
      (events `checkout.session.completed`, `checkout.session.async_payment_succeeded`) and its `STRIPE_WEBHOOK_SECRET`.
- [ ] Legal pages (`/privacy`, `/terms`, `/shipping`) reviewed: company details, mediator.
- [ ] Real social links in `src/data/site.ts` (currently the generic Instagram / TikTok / Pinterest home pages).
- [ ] Product content validated (descriptions, weights, prices in `src/data/products.json`).
