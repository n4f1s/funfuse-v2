# SEO migration

The live site is WordPress (All in One SEO, Elementor, "Gamico" theme). Its
sitemap on **2026-08-11** contained the 24 URLs below.

## The rule

**Preserve, do not tidy.**

If an existing WordPress URL can serve the equivalent new content, the new site
serves it at that exact path, trailing slash included. A cleaner URL structure
is not a reason to move a page that already ranks. For this first migration,
minimising URL change matters more than a perfect structure.

A permanent redirect is only justified when one of these is true:

- the old content is genuinely being consolidated into something else,
- the path is a CMS artifact with nothing worth retaining,
- there is no equivalent content in the new site.

Every redirect in `src/config/routes.ts` carries a written `reason` field for
exactly this. If a proposed redirect cannot be given one, the URL stays.

The public URL structure and the internal code structure are separate concerns.
Game detail pages are served at `/projects/<slug>/` because that is where they
are indexed, while the implementation is a single reusable game detail view fed
by `src/content/games`. The route file is thin; the architecture is not shaped
by the legacy path.

**Trailing slashes are preserved.** `trailingSlash: true` in `next.config.ts`.
WordPress served every URL with a slash, so matching it means preserved URLs
survive byte for byte with no redirect at all. The cost is that canonicals,
sitemap entries and JSON-LD `@id`s must all carry the slash, which is why
`absoluteUrl()` normalises it and nothing builds URLs by hand.

## URLs that do not change

| URL                                | Serves                                  |
| ---------------------------------- | --------------------------------------- |
| `/`                                | Home                                    |
| `/projects/tongit/`                | Game detail                             |
| `/projects/hazari-grand/`          | Game detail                             |
| `/projects/callbreak-offline/`     | Game detail                             |
| `/projects/3-2-5-offline-fun-card-game/` | Game detail                       |
| `/projects/gin-rummy-master-offline/`    | Game detail                       |
| `/projects/tarneeb/`               | Game detail                             |
| `/projects/ludo-challenge-offline-play/` | Game detail                       |
| `/projects/puzzle-twist-game/`     | Game detail                             |
| `/project-genre/card-game/`        | Card games listing                      |
| `/project-genre/board-game/`       | Board games listing                     |
| `/blogs/`                          | Blog listing                            |
| `/tongits-star-offline-2/`         | Blog post, stays at the root            |
| `/hazari-grand-1000-points-game/`  | Blog post, stays at the root            |
| `/poker-full-house-offline/`       | Blog post, stays at the root            |
| `/careers/`                        | Careers                                 |
| `/contact-us/`                     | Contact                                 |
| `/faq/`                            | FAQ                                     |
| `/tos/`                            | Terms of Service                        |
| `/privacy-policy/`                 | Privacy Policy                          |

That is 20 of the 24 indexed URLs kept exactly as they are, plus the seven
redirects below.

Blog posts keep root-level slugs. The route is `app/[postSlug]/page.tsx` with
`generateStaticParams` and `dynamicParams: false`; static segments win over
dynamic ones in the App Router, so `/games/`, `/careers/` and friends are
unaffected and any unknown root slug 404s.

## Permanent redirects (308)

Seven, each with a reason.

| Old                            | New       | Why                                                                                                             |
| ------------------------------ | --------- | --------------------------------------------------------------------------------------------------------------- |
| `/funfuse-home/games/`         | `/games/` | CMS artifact. "funfuse-home" is a WordPress page-tree remnant that nobody links or searches. The catalogue it held is consolidated onto `/games/`. |
| `/projects/`                   | `/games/` | Bare post-type archive with no content of its own. The individual `/projects/<slug>/` pages are untouched.        |
| `/project-genre/strategy/`     | `/games/` | No equivalent. The catalogue has card, board and puzzle categories; nothing maps to "strategy".                   |
| `/category/company/`           | `/blogs/` | Every post is in this one category, so the archive duplicates the blog listing.                                   |
| `/category/company/card-game/` | `/blogs/` | Nested duplicate of the same three posts.                                                                         |
| `/our-team/`                   | `/studio/` | Consolidated. WordPress split the studio across `/our-team/` for the people and `/services/` for the work. Both are now one page, which is about the studio rather than about a team roster, so neither old title describes it. `/studio/` is the name the navigation has used for this section since launch. |
| `/services/`                   | `/studio/` | Consolidated into the same page, including the three disciplines this URL listed. A thinner second copy would compete with the real one. |

**The one judgment call worth your sign-off:** `/funfuse-home/games/` is a real
indexed URL, and preserving it strictly would mean not creating `/games/` at
all. Serving both would be duplicate content. Redirecting the CMS-artifact path
to the clean one is the call taken here. If you would rather keep
`/funfuse-home/games/` as the catalogue and drop `/games/`, that is a one-line
change in `src/config/routes.ts`.

**The second judgment call, and it is a real trade.** `/our-team/` and
`/services/` are both indexed URLs, and the rule at the top of this file says
preserved URLs do not move. They move here because what replaces them is not
either of them: the Studio page is one page about the studio, carrying the
people, the disciplines, the process, the crafts and the catalogue. Neither old
title describes it, serving it at a URL that says "our team" mislabels five
sixths of the page, and serving it at both would be duplicate content.

The cost is honest: `/our-team/` had inbound history and a 308 carries most but
not all of it. What we get is one canonical URL matching the one word the
navigation, the metadata and the page itself all use. Both redirects point
straight at `/studio/` rather than chaining through each other, and every
internal link was repointed in the same commit, so nothing on the site sends a
visitor or a crawler through a hop.

Watch these two paths in Search Console alongside the other five.

## New URLs

| URL       | Notes                                                             |
| --------- | ----------------------------------------------------------------- |
| `/games/` | The catalogue. The old site had no clean URL for one.             |
| `/studio/` | The studio, in one page. Replaces `/our-team/` and `/services/`, which both 308 into it. |
| `/projects/<slug>/` × 11 | The eleven titles that never had a public page. They join the existing namespace rather than starting a second one. |

The eleven: `lucky-9-offline`, `pusoy-offline`, `pusoy-dos-offline`,
`capsa-susun-offline`, `tien-len-club`, `okey-club`, `belote-francaise`,
`mau-mau-offline`, `thousand-offline`, `omi-club`, `bhabhi-thulla-card-game`.

`/projects/` is not the prefix you would pick from scratch. Moving all 19 to
`/games/<slug>/` later is a deliberate, separate migration with its own
redirects, not something to fold into the first launch.

## How the machinery works

- `src/config/routes.ts` holds the route registry and the redirect table. Each
  preserved route is flagged `preserved: true`; each redirect carries a
  `reason`.
- `assertRedirectTable()` runs from `next.config.ts` at build time and throws
  on a self-redirect, a duplicate source, or a rule whose source is a route we
  serve. A redirect that would shadow a preserved URL fails the build.
- Game slugs are the public URL. `getGameRedirects()` is empty at launch and
  filters self-redirects, so it stays safe when a slug does eventually change.
- A route enters `sitemap.xml` only when its registry entry is `live: true`.
- `src/lib/seo.ts` builds canonicals; `src/lib/jsonld.ts` builds structured
  data (Organization and WebSite site-wide, SoftwareApplication + VideoGame per
  game, BreadcrumbList and FAQPage where they apply).
- `robots.ts` disallows everything unless `NEXT_PUBLIC_SITE_URL` is the
  production origin, so preview deploys cannot compete with production.

## Route to implementation map

| Public URL                 | Route file                          |
| -------------------------- | ----------------------------------- |
| `/games/`                  | `app/games/page.tsx`                |
| `/projects/<slug>/`        | `app/projects/[slug]/page.tsx`      |
| `/project-genre/<genre>/`  | `app/project-genre/[genre]/page.tsx`|
| `/blogs/`                  | `app/blogs/page.tsx`                |
| `/<post-slug>/`            | `app/[postSlug]/page.tsx`           |
| `/studio/`, `/careers/`, `/contact-us/`, `/faq/`, `/tos/`, `/privacy-policy/` | one directory each |

## Launch checklist

- [ ] Set `NEXT_PUBLIC_SITE_URL=https://funfusegames.com` in production.
- [ ] Confirm the 22 preserved URLs return **200, not a redirect**. A redirect
      on any of them means something regressed. Against a running build:

      ```bash
      for p in /projects/tongit/ /projects/hazari-grand/ /projects/callbreak-offline/ /projects/3-2-5-offline-fun-card-game/ /projects/gin-rummy-master-offline/ /projects/tarneeb/ /projects/ludo-challenge-offline-play/ /projects/puzzle-twist-game/ /project-genre/card-game/ /project-genre/board-game/ /blogs/ /tongits-star-offline-2/ /hazari-grand-1000-points-game/ /poker-full-house-offline/ /careers/ /contact-us/ /faq/ /tos/ /privacy-policy/ /; do printf "%-42s " "$p"; curl -s -o /dev/null -w "%{http_code}\n" "https://funfusegames.com$p"; done
      ```

- [ ] Confirm the five redirects return a single 308 to the right destination.
- [ ] Flip `live: true` for each route as its page ships.
- [ ] Submit the new `sitemap.xml` in Search Console. It is the authoritative
      sitemap from launch; the WordPress sitemap index and its child sitemaps
      go away with the old site. Remove the old sitemap submissions in Search
      Console so Google is not fed two conflicting URL sets.
- [ ] Watch Search Console coverage for two weeks post-launch, with attention
      to the five redirected paths.
- [ ] Import real store copy into `description` on each game record; until
      then pages fall back to the factual `summary`.
