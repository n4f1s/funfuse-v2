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
homepage is a holding page and the remaining routes are not built yet.
