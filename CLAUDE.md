@AGENTS.md

# RED TEA SHOP — XAY Teahouse

Site e-commerce de thé (marque **XAY Teahouse**), codé à partir de la maquette Figma « RED TEA SHOP ».

## Stack

- **Next.js 16** (App Router, Turbopack, `cacheComponents` activé) — lire `node_modules/next/dist/docs/` avant d'utiliser une API Next (voir AGENTS.md).
- **React 19**, **TypeScript** (strict).
- **Tailwind CSS 4** : pas de `tailwind.config.js`, les tokens sont dans `@theme` de `src/app/globals.css`.
- **Motion** (ex-Framer Motion) : `import { motion } from "motion/react"`. Les composants animés doivent commencer par `"use client"`.
- **Supabase** (`@supabase/supabase-js` + `@supabase/ssr`) : authentification et commandes (voir « Auth », « Commandes »).
- **Stripe** (`stripe`, API `2026-10-28.endive`) : paiement via Stripe Checkout (voir « Paiement »).
- Alias d'import : `@/*` → `src/*`.

## Commandes

```bash
npm run dev     # serveur de dev → http://localhost:3000
npm run build   # build de production (à lancer pour vérifier avant de finir une tâche)
npm run lint    # ESLint
```

Si le CSS ne reflète pas une modif de `globals.css` (nouveau token, `@utility` modifié) — en build **ou** en `npm run dev` — c'est le cache Turbopack : arrêter le serveur, supprimer `.next`, relancer.

Un seul `next dev` à la fois dans ce dossier (Next refuse d'en lancer un second).

**Tester sur téléphone** : ouvrir `http://<IP du PC>:3000` (ex. `192.168.88.12`). `allowedDevOrigins` dans `next.config.ts` autorise les adresses `192.168.*.*` et `10.*.*.*` ; sans ça Next bloque ses scripts de dev et **aucun bouton ne marche** sur le téléphone. Autre réseau : ajouter son adresse. Pour Supabase (liens des emails), ajouter aussi `http://<IP>:3000/auth/confirm` aux Redirect URLs.

## Structure

```
src/
├── app/                 → routes (1 dossier = 1 URL), layout.tsx, globals.css
│   ├── actions/         → Server Actions (auth.ts, checkout.ts, newsletter.ts)
│   ├── auth/            → confirm/ (liens des emails), error/ (lien expiré)
│   ├── checkout/        → récapitulatif, success/ (retour de Stripe)
│   ├── shop/            → catalogue (filtre ?category=) et [slug]/ (page produit)
│   ├── philosophy/, shipping/, privacy/, terms/ → pages de contenu ; wishlist/ ; not-found.tsx (404)
│   └── api/stripe/webhook/ → webhook Stripe
├── components/
│   ├── ui/              → briques : Button, TextField, Badge, FormAlert, icônes…
│   ├── layout/          → Nav, MobileMenu, Footer, AuthSplit
│   ├── cart/            → CartDrawer, CartButton, AddToBagButton, ReorderButton
│   ├── cards/           → ProductCard, TestimonialCard, ArticleRow
│   ├── account/         → AccountNav, OrderRow, OrderTable, OrdersNotice, AddressCard, SettingRow
│   └── sections/home/   → blocs de l'accueil (Hero, TopSales, Journal, Voices…)
├── data/                → contenu statique : products.json (catalogue), articles, témoignages, site
├── hooks/               → logique réutilisable (useCart, useDialog)
├── lib/                 → utilitaires (formatPrice, cn, site-url), accès aux données (products.ts, auth.ts, orders.ts), stripe.ts, checkout.ts, supabase/ (server, proxy, admin)
├── proxy.ts             → « proxy » Next 16 (ex-middleware) : rafraîchit la session Supabase
└── types/               → types partagés (Product, CartLine, Order, Address…)
public/images/           → images exportées du Figma
supabase/migrations/     → SQL à exécuter dans Supabase (tables, RLS) ; supabase/seed-orders.sql = commandes de test
.env.example             → variables à copier dans .env.local (clés Supabase)
```

## Design (source : Figma)

- Fichier : `https://www.figma.com/design/U8m6tYB3FWPetMRr8ZUoVu/RED-TEA-SHOP` (page unique « Idea »).
- Le connecteur Figma MCP est sur l'offre Starter (limite d'appels vite atteinte). Alternative : ouvrir le fichier dans le navigateur intégré (utilisateur connecté) et lire les nœuds via l'API `figma` en lecture seule.
- La maquette a été importée depuis un site web (html.to.design) : d'où les valeurs non rondes (14,4 / 17,3 / 25,9 px…). Elles sont toutes reprises dans les tokens Tailwind (voir « Unité de base ») : utiliser les classes, ne pas recopier les décimales.
- Desktop uniquement (1440 px) : le responsive est conçu hors Figma (voir « Accueil : état »).

### Écrans (ID de nœud Figma)

| Écran | Nœud | Route prévue |
|---|---|---|
| Accueil | `35:19` | `/` |
| Login « Identify Yourself » (Sign In / Create Account / Guest) | `10:2` | `/identify` |
| Register | `10:115` | `/register` |
| Reset password | `10:425` | `/reset-password` |
| Compte (commandes, adresses, réglages, wishlist) | `10:226` | `/account` |
| Historique des commandes | `10:487` | `/account/orders` |
| Panier latéral « Your Bag » (400 × 900) | `1:648` | composant `CartDrawer` |
| Curseur personnalisé (point 4 px) | `1:683` | composant client |

Sections de l'accueil, dans l'ordre : Nav → Hero « PURE RED TEA » → Top Sales → Featured Selection → bandeau catégories (Red Tea • Green Tea • Oolong) → The Red Philosophy → Journal → Voices → Join the List (newsletter) → Follow Us → Get In Touch → Footer.

### Composants Figma (section « XAY – Hover components », nœud `70:2`)

Chacun a un état normal + survol.
- Boutons outline : Explore Collection, + Add New, Reset Password, Reorder
- Boutons pleins : Checkout Now, Join XAY · Bouton blanc : Read Our Story
- Liens : Submit, Cart (0), Logout, Edit, Remove · 1 icône
- Cartes produit (×6), cartes témoignage « voice » (×3), lignes de tableau de commandes (×5)

À factoriser aussi (dupliqués, pas des composants Figma) : Nav, Footer, champs de formulaire, cartes Journal, badge de statut (« Delivered »), carte d'adresse, titres de section.
→ Un seul composant par type, alimenté par `src/data/`.

### Couleurs (classes Tailwind définies dans `globals.css`)

| Token | Figma | Valeur 500 |
|---|---|---|
| `tea-50…900` | Coloor/Red-tea | `#A20606` — couleur principale (textes, boutons, bordures) |
| `paper-50…900` | Coloor/white | `#F9F9F9` — fonds clairs, gris |
| `ink-50…900` | Coloor/black | `#252525` — textes sombres |
| `blush-50`, `blush-100` | — | `#FFF0F0`, `#FADEDE` — fonds rosés |

- Bordures discrètes : `border-tea-500/10` ou `/20`.
- `#A30505` et `#D10000` apparaissent ponctuellement dans le Figma : les ramener à `tea-500`.

### Unité de base : 14,4 px

Tout le Figma est construit sur une unité de **14,4 px** (0,9 rem) : tailles et espacements en sont des multiples. Tailwind est configuré pour que les classes donnent **exactement** les valeurs du Figma, sans `[…]` arbitraires.
⚠️ Les classes ne valent donc pas les valeurs Tailwind habituelles (`p-4` = 14,4 px, pas 16 px ; `text-base` = 14,4 px).

### Typographie

- `font-display` = **Big Shoulders** (nom Google Fonts actuel de « Big Shoulders Display ») → titres.
- `font-sans` = **Inter** → texte et interface.
- Polices chargées via `next/font/google` dans `src/app/layout.tsx`. L'avertissement de build « Failed to find font override values for Big Shoulders » est connu et sans gravité.
- **Big Shoulders a un axe de taille optique (`opsz`)**. Le Figma utilise la coupe « Display » (étroite) : on force `opsz 72` via `--font-display--font-variation-settings` (classe `font-display`) et dans `@utility heading`. Sans ça, les titres ≤ 36 px sortent ~15 % trop larges. L'axe doit rester chargé (`axes: ["opsz"]` dans le layout).
- `text-input` (43,2 px) : gros champs email (newsletter, reset).

| Classe | Taille | Usage Figma |
|---|---|---|
| `text-2xs` | 9,6 px | tags, petits libellés (10,4 px → aussi `2xs`) |
| `text-xs` | 11,2 px | libellés majuscules (le plus fréquent ; 11,5 px → `xs`) |
| `text-sm` | 12,8 px | boutons, petits textes (12 et 13 px → `sm`) |
| `text-base` | 14,4 px | texte courant (interligne 1,625) |
| `text-md` | 16 px | témoignages, « Checkout Now », sous-titre newsletter (15,8 px → `md`) |
| `text-lg` | 17,28 px | noms de produits |
| `text-xl` | 21,6 px | petits titres |
| `text-2xl` | 25,92 px | prix, titres de carte (24 px → `2xl`) |
| `text-3xl` | 28,8 px | citations, noms |
| `text-4xl` | 36 px | titres Journal (40 px → `4xl`) |
| `text-5xl` | 57,6 px | sous-titres, logo XAY™ |
| `text-6xl` | 86,4 px | « Featured Selection » |
| `text-7xl` | 115,2 px | titres de section |
| `text-8xl` | 144 px | grands titres (Journal, Voices…) |
| `text-9xl` | 172,8 px | « Top Sales » |
| `text-10xl` | 216 px | hero « PURE RED TEA » |
| `text-11xl` | 259,2 px | « RESET » |

- Interligne par défaut : 1,5 jusqu'à `4xl`, 1 à partir de `5xl`. `leading-display` (0,85) pour les titres très serrés.
- Interlettrage : `tracking-wider` (0,05em) pour tous les titres Big Shoulders, `tracking-tighter` (−0,05em) pour le logo, `tracking-label` (0,2em) et `tracking-ultra` (0,25em) pour les libellés Inter en majuscules, `tracking-widest` (0,1em) pour les noms de produits.
- Styles prêts à l'emploi : **`heading`** (Big Shoulders, black, majuscules, 0,05em) et **`label`** (Inter 11,2 px, majuscules, 0,25em).

### Espacements et arrondis

| Figma | 14,4 | 21,6 | 28,8 | 36 | 43,2 | 57,6 | 86,4 | 115,2 | 144 | 208,8 |
|---|---|---|---|---|---|---|---|---|---|---|
| Classe | `4` | `6` | `8` | `10` | `12` | `16` | `24` | `32` | `40` | `58` |

- Marge latérale des sections : `px-16` (57,6 px). Grandes sections : `py-58` (208,8 px).
- Boutons outline : `px-10 py-4` (ou `px-8 py-3.2` pour les petits) ; boutons pleins : `px-10 py-6`.
- Largeur max du contenu : `max-w-page` (1440 px).
- Arrondis : `rounded-full` (boutons, cartes témoignage), `rounded-card` (57,6 px, cartes produit), `rounded-panel` (28,8 px), `rounded-sm` (5 px).

## Composants existants

- `@/components/ui/Button` — variantes `outline` (défaut), `solid`, `white`, `link` ; tailles `sm` (+ Add New, Reorder), `md` (défaut), `wide` (Reset Password), `lg` (défaut de `solid` : Checkout Now, Join XAY). Avec `href` → `<Link>` Next, sinon `<button>`. Hover : transition 250 ms ease-out (comme le Smart Animate du Figma). `white` et `link` sont faits pour fond rouge.
- `@/components/ui/TextField` — champ souligné du Figma : `size="md"` (label + input 25,9 px, Register) ou `size="lg"` (input centré 43,2 px, label masqué, Reset). Bordure rouge au focus.
- `@/components/ui/FormAlert` — message d'erreur sous un formulaire (fond `blush-50`, `role="alert"`), hors Figma. N'affiche rien si le texte est vide.
- `@/lib/cn` — concatène des classes (pas de fusion des conflits Tailwind).
- `@/lib/format` — `formatPrice(48)` → « €48 » (`{ decimals: true }` → « €48.00 »), `formatDate("2024-06-08")` → « Jun 8, 2024 » (`{ padDay: true }` → « Jun 08, 2024 », listes de commandes) (UTC).
- `@/components/ui/Badge` — `outline` (statut léger, page compte), `strong` (bordure couleur du texte, archive des commandes) ou `solid` (« Default » d'une adresse).
- Utilitaire CSS `link-fade` — petits liens texte qui passent à 55 % au survol (Logout, Edit, Remove).
- `@/components/ui/icons` — icônes exportées du Figma (`ArrowRightIcon`, `UserIcon`, `InstagramIcon`, `MailIcon`, `MapPinIcon`), couleur via `text-*`.
- `@/components/layout/Nav` et `Footer` — inclus dans `src/app/layout.tsx` pour toutes les pages. La Nav est en `absolute` par-dessus le haut de page : chaque page doit prévoir ~`pt-40` en haut.
- `@/components/cards/` — `ProductCard`, `TestimonialCard`, `ArticleRow` (états hover du Figma).
- `@/components/sections/home/` — les 10 sections de l'accueil, assemblées dans `src/app/page.tsx`. Données dans `src/data/` (`journal`, `testimonials`, `site`) ; produits via `@/lib/products` (voir « Produits »).
- Ombres au survol : `shadow-card` (cartes produit), `shadow-soft` (témoignages).
- Briques partagées (ajoutées lors de la relecture du 2026-11-13, à réutiliser plutôt que recopier) : `@/components/ui/QuantityStepper` (−/n/+, `compact` pour le panier, `pill` pour la page produit), `@/components/cards/ProductThumb` (vignette des lignes panier / checkout / wishlist), `@/components/ui/EmptyState` (liste vide + « Explore Collection »), `@/components/layout/PageHeader` (titre + sous-titre de page), `@/components/layout/MessagePage` (page message centrée : 404, Expired, Thank You). Limites du panier (`MAX_QUANTITY`, `MAX_LINES`) dans `@/lib/cart` (partagées navigateur / Server Action). URL Instagram : `instagramUrl` dans `src/data/site.ts`.
- Survol et tactile : `hover:` de Tailwind 4 ne s'applique qu'aux appareils avec survol ; pour masquer un élément jusqu'au survol, utiliser `pointer-fine:opacity-0 pointer-fine:group-hover:opacity-100` (jamais `xl:` : une tablette tactile large ne le verrait jamais).
- **Animation d'apparition** (hors Figma) : `@/components/ui/Reveal` — fondu + montée de 48 px, 1,1 s, easing `revealEase`, une seule fois quand le bloc entre à l'écran (`delay` pour décaler des éléments voisins, `as="li" | "header" | "section"`). Utilisée sur chaque section de l'accueil (`src/app/page.tsx`), dans `PageHeader`, `MessagePage`, `AuthSplit`, `ContentPage`, le Footer et les blocs des autres pages. **Toute nouvelle section doit être enveloppée dans `<Reveal>`.** « Réduire les animations » : simple fondu. Le contenu est invisible tant que le JavaScript n'a pas démarré (voir « Tester sur téléphone »).
- Menu burger : le panneau se déroule de haut en bas (0,7 s, `clipPath`) puis les liens montent l'un après l'autre.
- `@/hooks/useDialog` — comportement commun des panneaux plein écran (menu burger, panier) : Échap ferme, scroll de la page bloqué, focus déplacé puis rendu à la fermeture.

## Produits

- Catalogue dans **`src/data/products.json`** : `categories` (bandeau Red Tea • Green Tea • Oolong) + `products` (`slug`, `name`, `origin`, `category` (doit exister dans `categories`), `price` en €, `image`, `weight?`, `description?`, `notes?` (notes de dégustation), `brewing?` (`amount`, `temperature`, `time`), `featured?` → Featured Selection dans l'ordre du fichier, `topSale?` → Top Sales, le premier gagne). Descriptions, notes, infusions et poids (100 g) sont du contenu provisoire à faire valider (le visuel d'Imperial Crimson indique 250 g).
- **Ne jamais importer le JSON dans un composant** : passer par `@/lib/products` → `getProducts()`, `getProductBySlug(slug)`, `getFeaturedProducts()`, `getTopSale()` (null → section masquée), `getCategories()`, `getRelatedProducts(slug)` (même catégorie d'abord). Fonctions `async`, **serveur uniquement**.
- Une seule fonction lit la source : `loadCatalog()` (`"use cache"`, `cacheLife("hours")`, `cacheTag("products")`), via `await import("@/data/products.json")` — **pas `fs.readFile`** : en dev, un fichier lu par `fs` reste en cache jusqu'au redémarrage du serveur, alors qu'un import est suivi par Turbopack (modif du JSON visible au rechargement). Elle valide le fichier (types, slugs uniques) et fait **échouer le build** si le JSON est invalide. Passage à une base de données : ne changer que le corps de `loadCatalog()` (TODO).
- L'accueil reste pré-rendu en statique (`Revalidate 1h` au build). Le JSON étant intégré au build, une modif du catalogue en production demande un nouveau build ; avec une base de données, `revalidateTag("products")` suffira.
- `CategoryMarquee` (client) reçoit `categories` en prop depuis `src/app/page.tsx`.

## Boutique et page produit (hors Figma)

- `/shop` : tout le catalogue, filtre par catégorie via `?category=Red Tea` (`ShopGrid`, client, `useSearchParams` derrière `<Suspense>` ; le fallback statique affiche tout). Lien « Shop » de la Nav, « Explore Collection » partout, fil d'Ariane.
- `/shop/[slug]` : pré-rendu au build (`generateStaticParams`). `export const instant = false` : le slug est lu en haut de page (pas de `<Suspense>`) pour qu'un slug inconnu renvoie un vrai **404** (dans un `<Suspense>`, `notFound()` renverrait 200). Image, catégorie · origine, prix + poids, description, notes, `ProductPurchase` (quantité + « Add to Bag — €96 » + `WishlistButton`), « Brewing Ritual », réassurance (livraison, Stripe, retours → `/shipping`), « You May Also Like » (3 produits).
- **Wishlist** : `@/hooks/useWishlist` (`WishlistProvider` dans le layout, `localStorage` clé `xay-wishlist`, comme le panier). Bouton sur la page produit ; `/wishlist` liste les thés encore au catalogue, au prix actuel (Remove / Add to Bag). Lien depuis le menu du compte.

## Pages de contenu (hors Figma)

- `@/components/layout/ContentPage` : grand titre + intro + sections numérotées (shipping, privacy, terms).
- `/philosophy` (« Read Our Story », lien Nav « Philosophy »), `/shipping` (livraison gratuite UE + CH, MC, GB, retours 14 jours), `/privacy` (décrit Supabase, Stripe, localStorage, pas de cookie de suivi), `/terms` (CGV). **Textes juridiques à faire relire avant la mise en ligne** (raison sociale, médiateur…).
- `not-found.tsx` : page 404 « 404 » (Back Home / Explore Collection).

## Panier

- État local : **React Context + `useReducer`** dans `@/hooks/useCart` (`CartProvider` dans `src/app/layout.tsx`). Pas de dépendance (pas de Zustand).
- `useCart()` → `lines`, `count` (somme des quantités), `subtotal` (€), `isOpen`, `openCart`, `closeCart`, `addItem(product)` (+1 et ouvre le panier), `addItems([{ product, quantity }])` (plusieurs d'un coup, ex. Reorder), `setQuantity(slug, n)` (0 = retire la ligne, max 99), `removeItem`, `clearCart`.
- Sauvegardé dans `localStorage` (clé `xay-cart`), relu après le premier rendu (le serveur rend toujours un panier vide → « Cart (0) » le temps de l'hydratation), synchronisé entre onglets. Les lignes gardent une copie du produit (nom, origine, prix, image).
- `@/components/cart/CartDrawer` (Figma « Your Bag », 1:648) : panneau à droite 400 px (plein écran sur mobile), lignes avec −/+ et « Remove », sous-total `€48.00`, « Checkout Now » → `/checkout` (voir « Paiement »). **Construit sans accès au nœud Figma** (limite MCP, navigateur non connecté) : à comparer à la maquette.
- `CartButton` : le « Cart (n) » de la Nav. `AddToBagButton` : pastille « Add to Bag » sur l'image des `ProductCard` (**hors Figma**, à valider) — visible en permanence sur écran tactile (centrée en haut de l'image sur mobile, en haut à droite dès `md`), au survol avec une souris. Top Sales : bouton outline « Add to Bag » (`variant="outline"`, **hors Figma**) avant « Shop Now » (→ `/shop/…`), les deux passent sur 2 lignes sur mobile.

## Auth (Supabase)

- **Configuration requise** : copier `.env.example` en `.env.local` et remplir `NEXT_PUBLIC_SUPABASE_URL` + `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` (clé publishable ou ancienne clé « anon », **jamais** la clé secrète / service_role). Redémarrer `npm run dev` après. `NEXT_PUBLIC_SITE_URL` (optionnel en dev) = adresse publique utilisée dans les liens des emails.
- **Dans le tableau de bord Supabase** (Authentication → URL Configuration) : Site URL = `http://localhost:3000` en dev ; ajouter `http://localhost:3000/auth/confirm` (et l'URL de prod) aux Redirect URLs, sinon les liens des emails sont refusés.
- Projet Supabase relié (clés vérifiées le 2026-11-12). Inscription + email de confirmation + arrivée sur `/account` testés de bout en bout par l'utilisateur le 2026-11-12. Les variables `NEXT_PUBLIC_…` sont lues au démarrage : **redémarrer `npm run dev`** après toute modif de `.env.local`.
- Email gratuit de Supabase : quelques emails par heure, et seulement vers les membres de l'équipe du projet (sinon `signUp` renvoie « We cannot send a confirmation email to this address yet »). Pour de vrais clients : brancher un SMTP (Authentication → Emails → SMTP Settings).
- Sans clés : rien ne plante — `isSupabaseConfigured` (`@/lib/supabase/env`) est faux, les formulaires affichent « Sign-in is not available yet », `/account` renvoie vers `/identify`.
- Clients : `@/lib/supabase/server` (`createClient()`, un par requête, Server Components / Actions / Route Handlers) ; il appelle `await connection()` en premier, car le client Supabase lit l'horloge (`Date.now()`), interdit pendant le pré-rendu avec Cache Components. Pas de client navigateur (tout passe par des Server Actions). `src/proxy.ts` → `@/lib/supabase/proxy` rafraîchit le cookie de session à chaque requête (aucun contrôle d'accès dans le proxy).
- **Lire l'utilisateur uniquement via `@/lib/auth`** : `getCurrentUser()` (→ `{ id, email, fullName, firstName, memberSince }` ou `null`, via `supabase.auth.getUser()`) et `requireUser()` (redirige vers `/identify`). Lit les cookies → **toujours derrière un `<Suspense>`** (sinon erreur de build avec Cache Components). Ne pas mettre de lecture de session dans un layout ni dans un `"use cache"`.
- **Server Actions** (`src/app/actions/auth.ts`, utilisées avec `useActionState`) : `signIn` (→ `?next=` si chemin interne, sinon `/account` ; `/checkout` propose « Sign in to save this order to your account » → `/sign-in?next=/checkout`), `signUp` (nom stocké dans `user_metadata.full_name` ; message « check your inbox » si la confirmation email est active, sinon → `/account`), `requestPasswordReset` (même réponse que le compte existe ou non), `updatePassword` (mot de passe + confirmation, → `/account`), `signOut` (→ `/`). Validation refaite côté serveur, mot de passe ≥ 8 caractères, erreurs Supabase traduites en messages clairs (jamais « cet email n'existe pas »). Après une erreur, l'email/nom est remis dans le champ (jamais le mot de passe).
- **Liens des emails** : `src/app/auth/confirm/route.ts` accepte `?code=` (emails par défaut, flux PKCE) ou `?token_hash=&type=` (modèles d'email personnalisés), ouvre la session puis redirige vers `next` (chemins internes uniquement, `//…` refusé). Échec → `/auth/error` (page « Expired », hors Figma). Un lien PKCE ne marche que dans le navigateur qui a fait la demande.
- **Pas de `redirect()` après connexion** (`signIn`, `signUp` avec session, `updatePassword`) : l'action renvoie `redirectTo` et le formulaire charge la page avec `useAuthRedirect` (`@/hooks/useAuthRedirect`, vrai chargement de page). Avec `redirect()`, Next prépare `/account` dans la même réponse (≈ 5 s, plusieurs allers-retours Supabase à ~0,6 s) : la réponse était abandonnée, le formulaire restait affiché et il fallait se connecter deux fois (corrigé le 2026-11-13, vérifié en build de prod locale). `signOut` garde `redirect("/")` (accueil statique).
- Reset en 2 étapes : `/reset-password` (Figma) envoie l'email → `/auth/confirm?next=/reset-password/update` → `/reset-password/update` (hors Figma, même mise en page « RESET ») : nouveau mot de passe ; sans session de récupération, message « lien expiré ».

## Commandes (Supabase)

- Tables `orders` (`number` « XAY-10001… » via séquence, `user_id`, `created_at`, `status` ∈ Processing/Shipped/Delivered/Archived, `total` en €) et `order_items` (copie du produit à l'achat : `product_slug`, `product_name`, `origin`, `unit_price`, `quantity`). SQL : `supabase/migrations/20261112000000_orders.sql`, **à exécuter à la main** dans Supabase → SQL Editor (pas de CLI Supabase dans le projet).
- **RLS** : un client ne lit que ses commandes (`auth.uid() = user_id`). Aucune policy d'écriture : les commandes sont créées côté serveur après paiement Stripe (voir « Paiement »), jamais par le navigateur.
- Migration et données de test exécutées sur le projet le 2026-11-12 ; affichage vérifié par l'utilisateur (/account et /account/orders), RLS vérifiée (lecture et écriture anonymes refusées).
- Données de test : `supabase/seed-orders.sql` (les 4 commandes du Figma, données au **dernier compte créé** ; à lancer une seule fois, les numéros sont uniques).
- Lecture via `@/lib/orders` → `getMyOrders({ limit? })` (plus récentes d'abord ; `null` = chargement impossible, ex. migration absente). Serveur uniquement, lit les cookies → derrière `<Suspense>`.
- `/account` : les 2 dernières (`OrderRow`) ; `/account/orders` : toutes (`OrderTable`). La colonne « Selection » est calculée : 1er article (« ×2 » si quantité > 1), détail = « + autres articles » ou origine, icône décorative choisie selon le slug. `OrdersNotice` (hors Figma) : « No orders yet » + Explore Collection, ou message d'erreur.
- « Reorder » (`@/components/cart/ReorderButton`) : remet les produits de la commande dans le panier, avec les quantités commandées, **au prix actuel du catalogue**, et ouvre le panier. Les articles qui ne sont plus au catalogue sont ignorés (ex. « Ceremonial Bamboo Whisk » du jeu de test) ; si aucun ne l'est, bouton désactivé. `OrderTable` reçoit le catalogue (`getProducts()`) depuis `/account/orders`. Testé par l'utilisateur le 2026-11-12.

## Paiement (Stripe)

- **Stripe Checkout** (page de paiement hébergée par Stripe) : aucune donnée bancaire ne passe par le site. Mode **test** (`sk_test_…`) tant que le site n'est pas en ligne ; carte de test `4242 4242 4242 4242`, date future, CVC quelconque.
- Parcours : panier → « Checkout Now » / « Guest Checkout » → **`/checkout`** (hors Figma : récapitulatif + « Proceed to Payment », `CheckoutView` client) → Stripe (email, adresse de livraison, carte) → **`/checkout/success?session_id=…`** (hors Figma : « Thank You », n° de commande, vide le panier via `ClearCart`). Annuler sur Stripe → retour à `/checkout`, panier intact.
- **Prix** : le navigateur n'envoie que `slug` + quantité ; `startCheckout` (`src/app/actions/checkout.ts`) reprend nom et prix dans le catalogue (`getProducts()`), max 50 lignes × 99. Livraison **gratuite** (pas de frais définis) ; pays de livraison : UE + CH, MC, GB (`SHIPPING_COUNTRIES`). Images envoyées à Stripe seulement si le site est en `https://`.
- Connecté : commande liée au compte (`client_reference_id` = id utilisateur), email pré-rempli. **Invité** accepté : commande sans compte (`user_id` null), email gardé dans `customer_email`.
- **Création de la commande** (`@/lib/checkout` → `fulfillCheckoutSession(sessionId)`) : relit la session chez Stripe (payée ? montants, articles via `metadata.slug`), puis appelle la fonction SQL `create_paid_order` avec le client **admin** (`@/lib/supabase/admin`, clé secrète, contourne la RLS). Appelée par la page de succès **et** par le webhook (`/api/stripe/webhook`, événements `checkout.session.completed` et `async_payment_succeeded`, signature vérifiée) : `stripe_session_id` unique → jamais de doublon. Statut initial « Processing ».
- SQL : `supabase/migrations/20261112010000_stripe_checkout.sql` (user_id facultatif, `customer_email`, `stripe_session_id`, `shipping` JSON, fonction `create_paid_order` réservée à `service_role`).
- Variables serveur (**jamais** `NEXT_PUBLIC_`) : `STRIPE_SECRET_KEY`, `SUPABASE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET` (facultative en dev ; `stripe listen --forward-to localhost:3000/api/stripe/webhook` avec la Stripe CLI). Sans clés : « Payment is not available yet », webhook → 503.
- Le proxy ignore `/api/stripe/` (pas de session à rafraîchir).
- `/checkout` affiche les **prix actuels du catalogue** (le panier garde une copie qui peut être périmée) et signale les produits retirés : même calcul que `startCheckout`.
- Clés et migration vérifiées le 2026-11-12. **Paiement test de bout en bout réussi** (invité, carte 4242) : commande XAY-10002, €131, articles et prix du catalogue, adresse enregistrée, panier vidé, pas de doublon au rechargement. Achat **connecté** testé par l'utilisateur le même jour : XAY-10006 lié au compte, visible dans `/account/orders` (« Processing »). Changer le statut (Shipped, Delivered…) se fait pour l'instant à la main dans Supabase → Table Editor → orders (pas d'interface d'admin). Les numéros peuvent sauter (un appel en double consomme un numéro de la séquence avant d'être rejeté) : normal, sans conséquence.
- Reste à faire : frais de port, stock, emails de confirmation XAY (Stripe envoie déjà un reçu si activé), commandes invitées rattachées à un compte créé plus tard, passage en mode live.

## Pages compte : état

- `/identify` (Figma « Login », 10:2) : page d'**aiguillage** « Identify Yourself » à 3 cartes (Returning / New Client / Visitor) — elle ne connecte personne, d'où le nom (pas `/login`). « Sign In » → `/sign-in`, « Guest Checkout » → `/checkout`.
- Parcours : lien « Account » du menu → `/account` → si déconnecté, `/identify` → `/sign-in` (connexion) ou `/register` (création de compte).
- `/sign-in` : **pas dans le Figma**, construit dans le style de Register (même mise en page `@/components/layout/AuthSplit`, partagée avec `/register`). Liens : « Forgot password? » → `/reset-password`, « Create Account » → `/register`. Register « Sign In » et Reset « Back to Login » pointent vers `/sign-in`.
- `/sign-in`, `/register` (10:115) et `/reset-password` (10:425) : branchés sur Supabase (voir « Auth »). Boutons désactivés pendant l'envoi (« Signing In… », « Joining… », « Sending… »).
- Comparés au Figma : footer à ±4 px sur les 3 pages.
- `/account` (Figma « user-page », 10:226) : **réservé aux connectés** (`requireUser()` derrière `<Suspense>`). En-tête « Welcome, {prénom} » + menu latéral collant (`AccountNav`, ancres `#orders` / `#addresses` / `#settings`, Wishlist → `/wishlist`) + 3 sections : commandes (`OrderRow` + `Badge`), adresses (`AddressCard`), réglages (`SettingRow`, chevron visible au survol). Composants dans `src/components/account/`. **Tout est réel** (plus de données factices depuis la relecture du 2026-11-13) : prénom, email, « Member since », Logout (`signOut`), commandes, **adresses** = adresses de livraison distinctes des commandes passées (saisies sur Stripe, `getMyShippingAddresses()` dans `@/lib/orders`, badge « Last Used » sur la plus récente ; message si aucune), **newsletter** = « Subscribed / Not subscribed » (`isSubscribed()`, ligne masquée si la table n'existe pas). Boutons Edit / Remove / « + Add New » retirés (ils ne faisaient rien) : un carnet d'adresses modifiable reste à faire. La ligne « Password » mène à `/reset-password`. Comparé au Figma : ±10 px, footer à 12 px.
- `/account/orders` (Figma « 1440w light », 10:487) : réservé aux connectés (nom affiché = vrai nom, sinon email), vraies commandes. Fil d'Ariane « Dashboard / Order History », titre « Archive », vrai `<table>` (`@/components/account/OrderTable`) avec icône produit (`@/components/ui/product-icons`, chemins exacts du Figma), badge `strong` (Archived en `text-tea-500/40`), bouton « Reorder » `size="sm"` (voir « Commandes »). Comparé au Figma : lignes 131 px (130,6), footer à 4 px.
- Lien « View All » à côté de « Order History » sur `/account` → `/account/orders` : **ajout hors Figma** (aucun accès prévu dans la maquette).
- Pages compte et auth : **responsive** depuis le 2026-11-13 (mêmes paliers que l'accueil, rendu desktop ≥ `xl` inchangé). Tableau des commandes : défilement horizontal sous `xl`. Pages compte connectées non vérifiées sur mobile.

## Accueil : état

- Codé en desktop 1440 px, comparé au Figma : hauteurs de section à ±13 px, page totale 9 803 px vs 9 836 px.
- Images dans `public/images/` (exportées du Figma, originaux lourds : `next/image` les optimise).
- **Hero : vidéo** (`public/videos/hero.mp4`, 768 × 768, 8 s, 1,6 Mo) à la place de la photo du Figma, desktop et mobile (2026-11-13). Composant client `HeroVideo` : muette, en boucle, `playsInline` (obligatoire pour la lecture auto sur iPhone), lancée après l'hydratation ; « Réduire les animations » → reste sur la 1re image. Fond `bg-tea-500` pendant le chargement (même rouge que la vidéo).
- **Responsive** (hors Figma, choix à valider avec le designer). Mobile d'abord, 3 paliers Tailwind par défaut : mobile < 768 (classes sans préfixe, `px-6`), tablette `md:` (`px-10`), desktop Figma `xl:` ≥ 1280 (`px-16`, valeurs d'origine). Titres réduits de 2 à 3 crans sur mobile, `rounded-card` → `rounded-panel` sous `md`/`xl`, espacements verticaux réduits d'environ ⅓. Rendu à 1440 px inchangé (9 801 px).
  - Menu burger mobile : `@/components/layout/MobileMenu` (panneau rouge plein écran, Échap, scroll bloqué).
  - Featured Selection : grille 2 colonnes sur mobile et tablette (prix sous le nom sur mobile), 3 décalées en desktop. « Scroll for more » visible seulement en desktop.
  - Voices en colonne jusqu'au desktop ; Journal : date au-dessus du titre sur mobile ; Follow Us en 2 × 2 ; Footer : logo puis 2 colonnes.
- Journal : plus de lien « Read all stories » ni de pages articles. Chaque titre est une question : la réponse (`answer` dans `src/data/journal.ts`) s'affiche dans un popup rouge au survol du texte (souris), au tap (tactile) ou au focus clavier, Échap ferme (`ArticleRow`, client). Hors Figma.
- Featured Selection : « Scroll for more » supprimé.
- **Newsletter** (« Join the List ») : Server Action `joinNewsletter` (`src/app/actions/newsletter.ts`) → table `newsletter_subscribers` via le client admin (`@/lib/newsletter`). SQL : `supabase/migrations/20261113000000_newsletter.sql` (**à exécuter** dans Supabase, sinon message « We could not add you to the list »). Pas d'envoi d'emails : la liste est à exporter vers un service d'emailing.

## Production (relecture du 2026-11-13)

- Redirections après connexion / liens d'email : `safePath()` de `@/lib/safe-path` (chemins internes uniquement, refuse `//…` et `/\…`). Toujours l'utiliser pour un `next=`.
- En-têtes de sécurité dans `next.config.ts` (X-Frame-Options, nosniff, Referrer-Policy, Permissions-Policy, HSTS), `poweredByHeader: false`.
- `src/app/robots.ts` (bloque compte, checkout, auth, api, wishlist) et `src/app/sitemap.ts` (pages + produits) ; `metadataBase` dans le layout. Adresse via `@/lib/public-site-url` → **`NEXT_PUBLIC_SITE_URL` obligatoire en production** (sinon localhost dans le sitemap, et l'en-tête Host est utilisé pour les liens Stripe / emails).
- `localStorage` (panier, wishlist) : écritures protégées par `try/catch` (navigation privée, quota plein).
- `lang="en"` (les textes sont en anglais).
- Checklist de mise en ligne : `README.md`.
- **En ligne sur Vercel** depuis le 2026-11-13 : https://red-tea-shop.vercel.app (projet `red-tea-shop`, équipe « Tefy », offre Hobby), déployé automatiquement à chaque `git push` sur `main`. Variables : les 4 de `.env.local` + `NEXT_PUBLIC_SITE_URL=https://red-tea-shop.vercel.app` (Stripe en mode **test**). Pas d'intégrations Vercel Stripe/Supabase (elles écraseraient les clés). Supabase (Site URL + Redirect URL `/auth/confirm`) et webhook Stripe (`/api/stripe/webhook`, `STRIPE_WEBHOOK_SECRET` en Production) configurés. **Achat test en ligne réussi** le 2026-11-13 (compte connecté) : XAY-10008, €62, prix du catalogue, adresse enregistrée, une seule commande pour la session Stripe.

## Conventions

- **Prix toujours en euros (€)**. Le « $12 » de Top Sales dans le Figma est une erreur → 12 €. Formater via `@/lib/format` (format par défaut à confirmer : `€48.00` comme le Figma, ou `48,00 €`).
- Textes de l'interface : reprendre ceux du Figma (en anglais).
- Pas de couleurs ou tailles en dur (`#A20606`, `text-[17.3px]`) quand un token existe.
- Composants serveur par défaut ; `"use client"` seulement pour l'interactivité et les animations.
- Commentaires de code en anglais, courts, et seulement pour le **pourquoi** (piège Next/Supabase, sécurité, choix non évident) : pas de commentaire qui répète le code. Les références Figma (nœuds, « Not in the Figma ») vont dans ce fichier, pas dans le code (nettoyage du 2026-11-13).
- Fins de ligne **LF** partout (`.gitattributes`). `.gitignore` : `.env*` sauf `.env.example`, `.next`, `node_modules`, `.claude/`, fichiers système.
- Dépôt git depuis le 2026-11-13 : branche `main`, poussée sur GitHub `tefisoamihaja/red-tea-shop` (**public** : jamais de clé dans le code). Committer et pousser régulièrement (une coupure de courant a déjà vidé ce fichier une fois).

## Questions ouvertes

- Format d'affichage des prix (`€48.00` ou `48,00 €`).
- Back-end : auth, commandes, paiement (Stripe test), adresses (issues des commandes) et newsletter branchés ; carnet d'adresses modifiable, envoi des emails newsletter, frais de port et passage en mode live restent à faire. Le catalogue pourra passer dans la même base Supabase. Le panier est local (navigateur).
