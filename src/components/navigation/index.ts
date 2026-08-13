/**
 * Only the link is re-exported here.
 *
 * `RouteTransition` is imported from its own path by the root layout, and
 * deliberately not from this barrel: it pulls in GSAP, and a barrel that
 * exported both would put GSAP in the module graph of every file that wanted a
 * link — which is most of them. Barrels do not reliably tree-shake across a
 * `"use client"` boundary, and this is not a thing to find out at build time.
 */
export { Link } from "./link";
