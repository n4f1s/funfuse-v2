/**
 * The contract between the pre-hydration gate script and the client island.
 *
 * The switch is a `<style>` element the gate script appends to the head, not an
 * attribute on `<html>`. That is deliberate: the root layout renders `<html>`,
 * so React reconciles its attributes, and anything written there before
 * hydration is a genuine mismatch that React reports and refuses to patch. A
 * node the script created itself is outside React's tree, so there is nothing
 * to disagree about.
 *
 * It also makes the state a single object rather than a convention. The element
 * *is* the scroll lock and the overlay's `display`, so dismissing the intro is
 * one `remove()` with no ordering in which the page ends up covered, or
 * scrollable but covered, or uncovered but locked.
 */
export const INTRO_LOCK_ID = "intro-lock";

/**
 * The rules that element carries. Unlayered, so they beat the `display: none`
 * default in globals.css without an `!important` — an unlayered declaration
 * outranks every `@layer`.
 */
export const INTRO_LOCK_CSS = "html{overflow:hidden}.intro-overlay{display:grid}";

/**
 * Set by the island the moment it initialises successfully, which is what makes
 * the gate's failsafe stand down for good.
 *
 * It marks the boundary between the two states the gate has to tell apart:
 * "the bundle has not run yet, keep waiting" and "something owns this now, stop
 * watching it". It is deliberately set at claim time rather than at the start
 * of the exit — the island's fixed animation takes 4.5s, and a failsafe that
 * only stood down at the last second would be racing the thing it is meant to
 * be insuring.
 */
export const INTRO_CLAIM_ATTRIBUTE = "data-claimed";

/** Once per tab. Cleared by the browser when the tab closes, which is right. */
export const INTRO_SESSION_KEY = "ff:intro";

/**
 * The catastrophic escape hatch, and nothing else.
 *
 * Armed by the gate script itself, so it survives the one thing every other
 * guarantee here depends on: the bundle arriving and running. It is the answer
 * to a 404 on a chunk, a parse error, or a browser that cannot run the code —
 * cases where the visitor would otherwise be left looking at a deck of cards
 * for as long as they were willing to.
 *
 * **It is not part of the animation's timing.** On any page where JavaScript
 * runs at all, the island sets `INTRO_CLAIM_ATTRIBUTE` on the lock and this
 * never fires.
 *
 * Twenty seconds because the case it has to survive is a genuinely slow first
 * visit. On a throttled connection the HTML and CSS arrive long before the
 * JavaScript, so the visitor sees the resting deck for as long as the bundle
 * takes, and the animation only starts once it lands. Firing at, say, eight
 * seconds would not be a failsafe, it would be a race that a slow connection
 * loses — tearing the intro down seconds before the code that owns it arrives.
 * Twenty is several times a slow-but-working initialisation, and still a bound.
 */
export const INTRO_FAILSAFE_MS = 20000;

/** The wrapper the island marks `inert` while the overlay is up. */
export const SHELL_ID = "site-shell";
