import Link from "next/link";

import { cn } from "@/lib/cn";

/**
 * Typographic wordmark.
 *
 * Placeholder for the real logo: when the brand supplies an SVG, swap the span
 * for it here and every surface updates. Set as display type rather than a
 * hand-drawn mark so it never looks like a stand-in.
 */
export function Wordmark({
  className,
  href = "/",
}: {
  className?: string;
  href?: string;
}) {
  return (
    <Link
      href={href}
      aria-label="FunFuse Games, home"
      className={cn(
        "font-display text-heading text-xl leading-none font-bold tracking-tightest",
        "transition-opacity duration-[var(--duration-hover)] ease-out hover:opacity-70",
        className,
      )}
    >
      FunFuse
      <span className="text-accent">.</span>
    </Link>
  );
}
