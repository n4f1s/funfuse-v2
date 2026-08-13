/**
 * Path comparison for the transition system.
 *
 * `trailingSlash: true` means the router normalises `/games` to `/games/`,
 * while the hrefs written throughout the codebase are slash-free. Anything
 * comparing the two has to agree on a shape first, or a same-route click looks
 * like a navigation and a real navigation looks like it never committed.
 */

/** Slash-free, except for the root itself. */
export function normalizePath(path: string): string {
  const trimmed = path.replace(/\/+$/, "");
  return trimmed === "" ? "/" : trimmed;
}

export function isSamePath(a: string, b: string): boolean {
  return normalizePath(a) === normalizePath(b);
}

/**
 * The pathname a link would land on, or `null` if it would leave the site.
 *
 * Next's `<Link>` has already rejected external URLs, `mailto:`, `tel:`,
 * downloads and modified clicks before it calls `onNavigate`, so this is a
 * second lock on a door that is already shut. It earns its place by being the
 * thing that extracts the pathname: a hash-only or query-only href resolves to
 * the page the visitor is already on, which is exactly what must not transition.
 */
export function resolveInternalPath(
  href: string | { pathname?: string | null },
): string | null {
  const raw = typeof href === "string" ? href : (href?.pathname ?? null);
  if (!raw) return null;

  try {
    const url = new URL(raw, window.location.href);
    return url.origin === window.location.origin ? url.pathname : null;
  } catch {
    return null;
  }
}

/**
 * The whole decision, in one place so it can be reasoned about and tested
 * without a browser.
 *
 * False for anything that leaves the site, and for a destination the visitor is
 * already on — a hash link, a query-only change, or the current route. Those
 * last three are the ones that matter: they are local URLs, so `<Link>` hands
 * them to us, but the pathname would never change and a transition would cover
 * the page and sit there until the watchdog rescued it.
 */
export function shouldTransition(
  href: string | { pathname?: string | null },
  currentPath: string,
): boolean {
  const to = resolveInternalPath(href);
  return to !== null && !isSamePath(to, currentPath);
}
