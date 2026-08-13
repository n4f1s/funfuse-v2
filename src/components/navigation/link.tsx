"use client";

import NextLink from "next/link";
import type { ComponentProps } from "react";

import { shouldTransition } from "./paths";
import { requestTransition } from "./transition-store";

/**
 * The site's internal link. A thin wrapper over `next/link` that tells the
 * transition overlay a navigation has begun.
 *
 * **Why `onNavigate` and nothing else.** Next calls it at exactly one moment:
 * after `<Link>` has already declined to handle the click — a modified click
 * (cmd, ctrl, shift, alt, middle button), `target` other than `_self`, a
 * `download` attribute, or an href that is not a local URL — and immediately
 * before it dispatches the navigation. So every link that must keep native
 * browser behaviour keeps it, without this file knowing those rules exist, and
 * without a document-level click listener or a patched `history.pushState`.
 *
 * Everything that makes `<Link>` worth using is untouched: prefetching, the
 * real `<a href>` in the markup for crawlers, and the semantics of an anchor.
 *
 * Two cases do reach `onNavigate` and must not transition, because a same-page
 * href is still a local URL: `#open-positions` on the careers page, and a link
 * to the route already being viewed. Both resolve to the current pathname, and
 * both are dropped below.
 */

type NextLinkProps = ComponentProps<typeof NextLink>;
type NavigateEvent = Parameters<NonNullable<NextLinkProps["onNavigate"]>>[0];

export function Link({ href, onNavigate, ...rest }: NextLinkProps) {
  return (
    <NextLink
      href={href}
      onNavigate={(event: NavigateEvent) => {
        // The caller gets a proxy so it can still cancel the navigation. Next's
        // event only exposes `preventDefault`, with no way to read back whether
        // it was called, so the proxy is what makes composing possible at all.
        let cancelled = false;

        onNavigate?.({
          preventDefault: () => {
            cancelled = true;
            event.preventDefault();
          },
        });

        if (cancelled) return;

        // Read from the document rather than `usePathname()`: a hook here would
        // subscribe every link on the page to the router and re-render all
        // fifty of them on the games listing every time one is clicked.
        const from = window.location.pathname;
        if (!shouldTransition(href, from)) return;

        requestTransition(from);
      }}
      {...rest}
    />
  );
}
