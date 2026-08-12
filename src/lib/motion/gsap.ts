"use client";

import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

/**
 * The single place GSAP is configured.
 *
 * Rules for this project:
 *   - Import GSAP only from here or from a `"use client"` leaf. Nothing in a
 *     Server Component may pull it in — GSAP is ~70kb before plugins.
 *   - Register plugins here, once. Registering twice is harmless but scatters
 *     the bundle graph and makes it hard to see what is actually loaded.
 *   - Always animate through `useGSAP`, which reverts everything the effect
 *     created on unmount. Never a bare `useEffect` with manual cleanup.
 *   - Animate transform and opacity only. Anything touching width, height,
 *     top or left goes through layout on every frame.
 *   - Wrap motion in `gsap.matchMedia()` so the reduced-motion branch is a
 *     first-class code path, not an afterthought.
 */

let registered = false;

/**
 * Escape hatch for reveal islands whose setup throws after server HTML has
 * applied the FOUC-safe `visibility: hidden` marker. This deliberately uses
 * the DOM rather than GSAP so it still works when plugin registration itself
 * is the failed step.
 */
export function failOpenRevealTargets(targets: Iterable<Element>) {
  for (const target of targets) {
    if (!(target instanceof HTMLElement)) continue;

    target.style.visibility = "visible";
    target.style.opacity = "1";
    target.style.removeProperty("will-change");
  }
}

export function registerGsap() {
  if (registered || typeof window === "undefined") return;

  gsap.registerPlugin(useGSAP, ScrollTrigger);

  gsap.defaults({
    ease: "power3.out",
    duration: 0.6,
  });

  ScrollTrigger.config({
    // Mobile browsers fire resize when the URL bar hides. Recalculating on
    // that causes triggers to jump mid-scroll on every phone.
    ignoreMobileResize: true,
  });

  registered = true;
}

/** Media query keys used with `gsap.matchMedia()` across the site. */
export const MOTION_QUERY = {
  ok: "(prefers-reduced-motion: no-preference)",
  reduced: "(prefers-reduced-motion: reduce)",
  desktop: "(min-width: 1024px)",
  mobile: "(max-width: 1023px)",
} as const;

export { gsap, ScrollTrigger, useGSAP };
