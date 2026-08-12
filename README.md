# FunFuse Games

Marketing site for FunFuse Games, an independent mobile studio with 19 shipped
card and board games. Replaces the WordPress site at
[funfusegames.com](https://funfusegames.com).

Next.js 16 (App Router, Turbopack) · React 19 · TypeScript · Tailwind CSS 4 ·
GSAP.

## Getting started

```bash
pnpm install
pnpm dev
```

Then open http://localhost:3000.

## Scripts

| Command          | What it does                              |
| ---------------- | ----------------------------------------- |
| `pnpm dev`       | Development server                        |
| `pnpm build`     | Production build                          |
| `pnpm start`     | Serve the production build                |
| `pnpm typecheck` | `tsc --noEmit`                            |
| `pnpm lint`      | ESLint                                    |
| `pnpm check`     | typecheck, lint and build in one pass      |

## Environment

| Variable               | Default                     | Notes                                                                 |
| ---------------------- | --------------------------- | --------------------------------------------------------------------- |
| `NEXT_PUBLIC_SITE_URL` | `https://funfusegames.com`  | Canonical origin. Set it on preview deploys so they de-index themselves and emit their own canonicals. |

## Where things are

```
src/app/          routes, metadata files, error boundaries
src/components/   layout · media · motion · seo · ui
src/config/       site facts, navigation, route registry, redirects
src/content/      the game catalogue
src/lib/          seo, json-ld, motion tokens, gsap setup
docs/             design system and SEO migration
```

## Read before contributing

- [`AGENTS.md`](AGENTS.md) — working rules for this repo. Also loaded as
  `CLAUDE.md`.
- [`docs/design-system.md`](docs/design-system.md) — tokens, type, colour,
  radius, motion.
- [`docs/seo-migration.md`](docs/seo-migration.md) — the old URL inventory and
  where each one goes.

Three rules that catch most mistakes:

1. Images go through `<Media>`, never `next/image` directly.
2. Game facts come from `src/content/games`, never a hardcoded string.
3. GSAP only. Never Framer Motion.

## Status

The foundation is in place: design system, layout shell, image and motion
architecture, game catalogue, redirects, sitemap and structured data. The
homepage is built. The remaining routes are not.

Homepage sections live in `src/components/home`. Cover artwork is registered in
`src/content/games/art.ts`, which is deliberately kept out of the
`src/content/games` barrel: `next.config.ts` imports that barrel in a plain Node
context, where a static image import cannot resolve.

Game links on the homepage go to Google Play until `/projects/<slug>/` ships.
That decision lives in one function, `src/components/home/game-link.ts`.







```
funfuse-v2
├─ .agents
│  └─ skills
│     ├─ design-taste-frontend
│     │  └─ SKILL.md
│     ├─ emil-design-eng
│     │  └─ SKILL.md
│     └─ review-animations
│        ├─ SKILL.md
│        └─ STANDARDS.md
├─ .claude
│  ├─ launch.json
│  └─ skills
│     ├─ design-taste-frontend
│     │  └─ SKILL.md
│     ├─ emil-design-eng
│     │  └─ SKILL.md
│     └─ review-animations
│        ├─ SKILL.md
│        └─ STANDARDS.md
├─ AGENTS.md
├─ CLAUDE.md
├─ README.md
├─ docs
│  ├─ design-system.md
│  └─ seo-migration.md
├─ eslint.config.mjs
├─ next.config.ts
├─ package.json
├─ pnpm-lock.yaml
├─ pnpm-workspace.yaml
├─ postcss.config.mjs
├─ public
├─ skills-lock.json
├─ src
│  ├─ app
│  │  ├─ error.tsx
│  │  ├─ favicon.ico
│  │  ├─ globals.css
│  │  ├─ layout.tsx
│  │  ├─ not-found.tsx
│  │  ├─ page.tsx
│  │  ├─ robots.ts
│  │  └─ sitemap.ts
│  ├─ assets
│  │  ├─ brand
│  │  │  └─ funfuse-games-logo-wide.png
│  │  ├─ decorative
│  │  │  ├─ backgrounds
│  │  │  │  ├─ game-art-mosaic.png
│  │  │  │  └─ tropical-beach-scene.png
│  │  │  ├─ characters
│  │  │  │  ├─ card-hero-woman-pink.png
│  │  │  │  ├─ card-player-young-man.png
│  │  │  │  ├─ casual-boy-red-jacket.png
│  │  │  │  ├─ cheerful-boys-pair.png
│  │  │  │  ├─ fantasy-boy-fire-staff.png
│  │  │  │  └─ traditional-dress-woman.png
│  │  │  ├─ illustrations
│  │  │  │  └─ what-we-do-card-game.png
│  │  │  └─ props
│  │  │     ├─ bomb.png
│  │  │     ├─ circular-logo.png
│  │  │     ├─ orange-jeepney.png
│  │  │     ├─ pencil.png
│  │  │     ├─ pink-crystal-gem.png
│  │  │     └─ yellow-lightning-bolt.png
│  │  └─ games
│  │     ├─ 3-2-5-offline
│  │     │  └─ cover.webp
│  │     ├─ belote-francaise
│  │     │  └─ cover.webp
│  │     ├─ bhabhi-thulla
│  │     │  └─ cover.webp
│  │     ├─ callbreak-offline
│  │     │  └─ cover.webp
│  │     ├─ capsa-susun
│  │     │  └─ cover.webp
│  │     ├─ gin-rummy
│  │     │  └─ cover.webp
│  │     ├─ hazari-grand
│  │     │  ├─ cover.webp
│  │     │  └─ logo.webp
│  │     ├─ lucky-9
│  │     │  └─ cover.webp
│  │     ├─ ludo-challenge
│  │     │  └─ cover.webp
│  │     ├─ mau-mau
│  │     │  └─ cover.webp
│  │     ├─ okey-club
│  │     │  └─ cover.webp
│  │     ├─ omi-club
│  │     │  └─ cover.webp
│  │     ├─ pusoy
│  │     │  └─ cover.webp
│  │     ├─ pusoy-dos
│  │     │  └─ cover.webp
│  │     ├─ puzzle-club
│  │     │  └─ cover.webp
│  │     ├─ tarneeb
│  │     │  └─ cover.webp
│  │     ├─ thousand
│  │     │  └─ cover.webp
│  │     ├─ tien-len
│  │     │  └─ cover.webp
│  │     └─ tongits-club-offline
│  │        └─ cover.webp
│  ├─ components
│  │  ├─ home
│  │  │  ├─ catalogue.tsx
│  │  │  ├─ closing.tsx
│  │  │  ├─ counter.tsx
│  │  │  ├─ craft.tsx
│  │  │  ├─ featured-games.tsx
│  │  │  ├─ figure-rail.tsx
│  │  │  ├─ game-link.ts
│  │  │  ├─ hand.tsx
│  │  │  ├─ hero-stage.tsx
│  │  │  ├─ hero.tsx
│  │  │  ├─ index.ts
│  │  │  ├─ prop.tsx
│  │  │  └─ studio.tsx
│  │  ├─ layout
│  │  │  ├─ index.ts
│  │  │  ├─ mobile-nav.tsx
│  │  │  ├─ site-footer.tsx
│  │  │  ├─ site-header.tsx
│  │  │  ├─ site-nav.tsx
│  │  │  └─ wordmark.tsx
│  │  ├─ media
│  │  │  ├─ aspect.ts
│  │  │  ├─ index.ts
│  │  │  ├─ media.tsx
│  │  │  └─ sizes.ts
│  │  ├─ motion
│  │  │  ├─ floating-prop.tsx
│  │  │  ├─ index.ts
│  │  │  ├─ parallax.tsx
│  │  │  └─ reveal.tsx
│  │  ├─ seo
│  │  │  └─ json-ld.tsx
│  │  └─ ui
│  │     ├─ button.tsx
│  │     ├─ container.tsx
│  │     ├─ index.ts
│  │     └─ section.tsx
│  ├─ config
│  │  ├─ routes.ts
│  │  └─ site.ts
│  ├─ content
│  │  └─ games
│  │     ├─ art.ts
│  │     ├─ games.ts
│  │     ├─ index.ts
│  │     └─ types.ts
│  └─ lib
│     ├─ cn.ts
│     ├─ jsonld.ts
│     ├─ motion
│     │  ├─ gsap.ts
│     │  └─ tokens.ts
│     └─ seo.ts
└─ tsconfig.json

```