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

/** Set by the island when it starts the exit, so the failsafe stands down. */
export const INTRO_EXIT_ATTRIBUTE = "data-exit";

/** Once per tab. Cleared by the browser when the tab closes, which is right. */
export const INTRO_SESSION_KEY = "ff:intro";

/**
 * The one guarantee that survives a missing JavaScript chunk.
 *
 * Armed by the gate script itself, so it does not depend on React, GSAP or any
 * bundle arriving. Comfortably later than the island's own deadlines (the
 * reveal starts by 4.2s and the island force-stops at 6.6s), so it only ever
 * fires when nothing else did.
 */
export const INTRO_FAILSAFE_MS = 7200;

/** The wrapper the island marks `inert` while the overlay is up. */
export const SHELL_ID = "site-shell";
