# Design system

Tokens live in the `@theme` block of `src/app/globals.css`. That file is the
source of truth; this document explains the reasoning so the rules survive
contact with a new page.

## The read

A mobile game studio whose catalogue is traditional card and board games:
Tongits, Belote, Okey, Ludo, Tarneeb. The games are familiar; the studio is
not. So the site has to feel like a confident product company, not a folk-art
site, while the artwork stays the loudest thing on the page.

Direction: light, airy, asymmetric, type-led, with motion that arrives with the
content rather than performing at it.

| Dial          | Value | Why                                                              |
| ------------- | ----- | ---------------------------------------------------------------- |
| Variance      | 8     | Asymmetric, generous negative space. Not a grid of equal cards.   |
| Motion        | 7     | Highly animated, but scroll-driven and short. Never blocking.     |
| Visual density| 3     | Gallery spacing. The game art is the artwork.                     |

## Colour

One accent hue, derived from the brand red.

```
brand-500  #eb3845   the brand. Identity, large type, icons, fills.
brand-600  #c92736   filled controls with a white label (5.5:1).
brand-700  #aa1b2a   brand-coloured text on light surfaces (7.2:1).
```

**The contrast rule that shapes everything:** `#EB3845` on white is **4.05:1**.
That passes for large text (>=24px, or >=18.66px bold), icons and non-text UI.
It fails WCAG AA for body text, and it fails behind a white button label. So
identity uses `brand-500` and anything carrying small text uses `brand-600` or
`brand-700`. This is one hue, not a second brand colour.

Neutrals sit on the same hue (`oklch(... 25)`) at near-zero chroma, so greys
never read as cold blue beside the red. They are faintly warm, deliberately not
cream or beige.

Semantic roles are what components use:

| Token                   | Role                                            |
| ----------------------- | ----------------------------------------------- |
| `canvas`                | page background (`ink-25`, a warm off-white)    |
| `surface` / `surface-muted` / `surface-sunken` | cards and section tone changes |
| `line` / `line-strong`  | hairlines and borders                            |
| `heading` / `body`      | display and reading text                         |
| `muted`                 | secondary text. 6.8:1 — safe for body copy       |
| `faint`                 | decorative or >=24px only. 4.3:1 — not body copy |
| `accent*`               | see the ramp above                               |

Never reach past a semantic token into a raw ramp step in a component.

## Typography

**Bricolage Grotesque** for display, **Geist** for everything else. Both are
variable fonts loaded through `next/font/google`, so there is no third-party
request and no layout shift from the fallback.

Bricolage carries an optical-size axis: it tightens as it scales up, which is
why headings need almost no manual tracking correction. It has no Cyrillic or
Arabic coverage, so native game titles (`Тысяча-1000`, `لعبة طرنيب`) render in
Geist. The `nativeTitle` field on a game exists for exactly this reason.

The scale is fluid (`clamp`, 360px to 1440px):

`text-2xs · xs · sm · base · lg · xl · h4 · h3 · h2 · h1 · hero`

`text-hero` tops out at 100px and is for headlines of three to five words. A
seven-word headline at that size wraps to four lines and pushes the call to
action below the fold — use `text-h1`.

Rules: headings max two lines; body copy capped near 65 characters; no serif;
no mixed-family emphasis (use italic or weight of the same face).

## Shape

One radius system, one rule:

- **Pressable** (buttons, chips, pills): fully rounded.
- **Media and cards**: `rounded-lg` (18px).
- **Inputs and small chips**: `rounded-md` (12px).

A square card on a page of pill buttons is a bug.

Shadows are tinted with the neutral hue, never pure black, and exist to signal
real elevation. Grouping is done with negative space and hairlines first.

## Spacing and layout

- Page container `--container-page` = 1320px, gutters `px-5 sm:px-8`.
- Reading measure `--container-prose` = 672px.
- Section rhythm: `.section-y` (clamped 56px to 120px), `.section-y-tight`.
- Breakpoints are Tailwind defaults: sm 640, md 768, lg 1024, xl 1280.
- Full-height blocks use `min-h-[100dvh]`, never `h-screen` — the iOS address
  bar makes `vh` jump mid-scroll.
- High-variance desktop layouts collapse to a single column below `md`. Declare
  the collapse in the same component; do not assume it.

## Motion

Durations and curves are shared between CSS and GSAP:
`src/lib/motion/tokens.ts` mirrors the `--ease-*`, `--duration-*` and
`--stagger-*` custom properties. Change them together.

```
ease-out      cubic-bezier(0.23, 1, 0.32, 1)     entering and exiting
ease-in-out   cubic-bezier(0.77, 0, 0.175, 1)    moving across the screen
ease-drawer   cubic-bezier(0.32, 0.72, 0, 1)     sheets and drawers
ease-entrance cubic-bezier(0.16, 1, 0.3, 1)      scroll reveals
```

The stock CSS easings are too weak at these durations; they read as sluggish.
`ease-in` is never used on UI because it delays the first frame, which is the
frame the user is watching.

```
press    140ms    dropdown  200ms
hover    180ms    overlay   320ms
                  reveal    620ms
```

UI motion stays under 300ms. Scroll reveals may be longer because the user is
not waiting on them.

Division of labour:

- **CSS transitions** for hover, press, focus and open/close. They run off the
  main thread and retarget when interrupted; keyframes restart from zero.
- **GSAP** for scroll triggers, timelines and sequencing. Always via `useGSAP`,
  always inside `gsap.matchMedia()`, always transform and opacity only.

Pressable things scale to `0.97` on `:active`. Nothing animates in from
`scale(0)` — start at `0.95` with opacity, because nothing in the real world
appears out of nothing.

The LCP element never starts at `opacity: 0`. An unpainted element does not
count as painted, so fading in the hero headline adds the whole fade duration
to Largest Contentful Paint. Animate what surrounds it.

Reduced motion removes travel and loops, not comprehension. Fades and colour
changes stay.

## Writing

- No em-dashes or en-dashes anywhere a user can see them.
- No invented statistics, ratings or testimonials.
- One label per intent. If the header says "Contact us", the footer does not
  say "Get in touch".
- Section eyebrows are rationed: at most one per three sections, and never a
  numbered one (`01 / Capabilities`).
