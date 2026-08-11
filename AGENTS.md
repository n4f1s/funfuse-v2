<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# FunFuse Games

Marketing site for an independent mobile game studio with 19 shipped card and
board games. Replaces a WordPress site at `funfusegames.com` that still holds
the rankings, so URL decisions are load-bearing.

Companion docs, both short:

- `docs/design-system.md` — tokens, type, colour, radius, motion vocabulary.
- `docs/seo-migration.md` — the old URL inventory and where each one goes.

## Non-negotiables

- **GSAP is the only general-purpose animation library.** Never install or
  import Framer Motion / `motion`. If a reference uses it, port the principle
  to GSAP, CSS or a native browser API.
- **Light theme only.** No `dark:` variants, no `prefers-color-scheme` branches,
  no section that inverts. `color-scheme: light` is pinned in `globals.css`.
- **One accent hue: `#EB3845`.** It is `--color-brand-500`. Shades of that hue
  are fine; a second accent colour is not.
- **Server Components by default.** `"use client"` only for real interaction or
  GSAP. Push the boundary as far down the tree as it goes.
- **Do not add dependencies casually.** The whole site currently runs on Next,
  React, Tailwind and GSAP. Justify anything else in the PR description.
- **Performance is a feature.** Most players are on mid-range Android over
  mobile data. Rich animation does not license a heavy page.

## Layout of the repo

```
src/
  app/          routes, metadata files (robots, sitemap), error boundaries
  components/
    layout/     header, footer, nav — the site shell
    media/      the Image system. All images go through <Media>
    motion/     GSAP client islands
    seo/        JSON-LD renderer
    ui/         Button, Container, Section
  config/
    site.ts     company facts, navigation
    routes.ts   route registry + legacy redirect table
  content/
    games/      the game catalogue — single source of truth
  lib/
    cn.ts       class joiner
    seo.ts      createMetadata / absoluteUrl
    jsonld.ts   structured-data builders
    motion/     GSAP registration + shared motion tokens
```

## Design

Read `docs/design-system.md` before styling anything. The short version:

- Tokens live in the `@theme` block of `src/app/globals.css`. Use semantic
  names (`text-heading`, `bg-surface`, `text-muted`), not raw ramp steps.
- Type: `font-display` (Bricolage Grotesque) for headings, `font-sans` (Geist)
  for everything else. Native-script game titles must use `font-sans` —
  Bricolage has no Cyrillic or Arabic.
- Radius rule: pressable controls are pills, media and cards are `rounded-lg`,
  inputs and chips are `rounded-md`. Do not mix.
- Contrast: `--color-accent` (#EB3845) is 4.05:1 on white. Fine for large type,
  icons and fills; not fine for body text or a white label on a filled control.
  Those use `--color-accent-strong` / `--color-accent-text`.
- No em-dashes in any user-visible string. Use a period, a comma or a hyphen.
- Icons are hand-written only for the two nav glyphs. When the site needs a
  real icon set, install `@phosphor-icons/react` and replace them; do not grow
  a folder of hand-drawn SVG paths.

## Motion

- **CSS owns states, GSAP owns choreography.** Hover, press, focus and simple
  open/close are CSS transitions: they run off the main thread and retarget
  when interrupted. GSAP is for scroll, timelines and sequencing.
- Every animation must survive the question "what does this communicate?"
  Valid: hierarchy, storytelling, feedback, state change. Not valid: it looked
  cool. Drop anything that fails.
- Durations and easings come from `src/lib/motion/tokens.ts`, which mirrors the
  CSS custom properties. Never invent a curve inline. Never use `ease-in` on
  UI, and never `transition: all`.
- Animate `transform` and `opacity` only.
- GSAP work goes through `useGSAP` from `@gsap/react` (automatic cleanup) and
  is wrapped in `gsap.matchMedia()` so the reduced-motion branch is real code,
  not an afterthought. Register plugins only in `src/lib/motion/gsap.ts`.
- `<Reveal>` covers the ordinary "content arrives on scroll" case. Reach for it
  before writing a new ScrollTrigger.
- **Never put the LCP element behind a reveal.** An element that starts at
  `opacity: 0` is not painted, so a 620ms fade on the hero headline is 620ms
  added to Largest Contentful Paint. Animate the content around it instead.

## Images

Every image goes through `<Media>` (`src/components/media`). It is not a
suggestion — it is what keeps CLS at zero.

- `sizes` is required. Pick a preset from `sizes.ts` that matches the slot.
- `aspect` reserves the box before the bytes arrive.
- `alt` is required by the types. For decoration, pass `decorative` instead.
- LCP: exactly one `priority="lcp"` per route, on the largest above-the-fold
  image. Next 16 deprecated the `priority` prop; `<Media>` emits `preload`.
- Prefer static imports from `src/assets/**` over files in `public/`. They get
  intrinsic dimensions and a build-time blur placeholder for free. `public/` is
  for assets that need a stable URL (favicon, store badges).
- Missing artwork renders a skeleton, not a broken image. Pass
  `placeholderLabel` so it is obvious what belongs there.

## Content and data

- Game facts live in `src/content/games/games.ts` and nowhere else. Never
  hardcode a title, slug or store URL in a page.
- `summary` on a game is a factual sentence about the traditional game and is
  safe to ship. `description` is real store copy and stays `null` until someone
  imports the actual listing text. Do not write marketing copy from
  imagination, and do not invent ratings, download counts or review quotes.

## URLs and SEO

**Preserve, do not tidy.** If a WordPress URL can serve the equivalent new
content, we serve it at that exact path. A cleaner structure is never a reason
to move a page that ranks. Read `docs/seo-migration.md` before touching a route.

- Public URLs are inherited; the code structure is not. Game detail pages are
  `/projects/<slug>/` because that is where they are indexed, and they are one
  reusable view fed by `src/content/games`. Never reshape the architecture to
  match a legacy path, and never reshape a legacy path to match the
  architecture.
- `trailingSlash: true`. Canonicals must match. Build absolute URLs with
  `absoluteUrl()` only.
- A new redirect needs a written `reason` in `src/config/routes.ts` fitting one
  of: content genuinely consolidated, CMS artifact with nothing to retain, no
  equivalent content. If you cannot write one, the URL stays.
  `assertRedirectTable()` fails the build on a self-redirect, a duplicate
  source, or a rule that would shadow a route we serve.
- Changing or removing a route means adding a permanent redirect in the same
  commit. Per-game slug changes go in `legacyPaths` on the game record.
- Every page builds its metadata with `createMetadata()` so it cannot ship
  without a canonical.
- A route only enters the sitemap once its entry in `routes.ts` is `live: true`.
  Flip the flag in the commit that ships the page. Our `sitemap.xml` is the
  authoritative sitemap from launch; the WordPress one is not kept alive.

## Before you finish

```bash
pnpm typecheck && pnpm lint && pnpm build
```

Then read your own diff. For anything visual, open it at 375px as well as
desktop — most of our players are on a phone.
