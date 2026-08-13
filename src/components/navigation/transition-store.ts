/**
 * The one channel between a link and the overlay.
 *
 * A module store rather than a React context, for one reason: a context whose
 * value changes when a transition starts would re-render every link on the page
 * on every navigation, and there are fifty of them on the games listing. Links
 * only ever *write* here, and the single overlay is the only reader, so a
 * subscription with `useSyncExternalStore` is both cheaper and a better
 * description of the relationship.
 *
 * It carries no navigation of its own. `<Link>` still performs the navigation;
 * this only announces that one has begun, and from where.
 */

export type TransitionRequest = {
  /** Distinguishes two clicks on the same link. */
  id: number;
  /** The pathname at the moment of the click — the reveal's reference point. */
  from: string;
};

let request: TransitionRequest | null = null;
let sequence = 0;

const listeners = new Set<() => void>();

/** Called from a link's `onNavigate`, once the navigation is certain. */
export function requestTransition(from: string): void {
  request = { id: (sequence += 1), from };
  for (const listener of listeners) listener();
}

export function subscribeToTransitions(listener: () => void): () => void {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

/** Stable between requests, which is what `useSyncExternalStore` requires. */
export function getTransitionRequest(): TransitionRequest | null {
  return request;
}

/**
 * Nothing is ever pending during a server render: a transition can only be
 * started by a click, which is the guarantee that this system cannot fire on
 * first paint or hydration.
 */
export function getServerTransitionRequest(): TransitionRequest | null {
  return null;
}
