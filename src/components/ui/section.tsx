import type { ReactNode } from "react";

import { cn } from "@/lib/cn";

import { Container } from "./container";

/**
 * A page section: vertical rhythm, an optional surface change, and a stable
 * anchor id. Sections do not invert the theme — this site is light throughout
 * and a section that flips to dark reads as a different website.
 */
export function Section({
  children,
  id,
  tone = "canvas",
  density = "default",
  bleed = false,
  className,
  containerClassName,
}: {
  children: ReactNode;
  id?: string;
  /**
   * Adjacent tones give separation without drawing a box around everything.
   *
   * `accent` is the brand tint, not a fourth surface. It is the one band on a
   * page allowed to carry colour, so a second one on the same page cancels
   * out whatever the first was emphasising.
   */
  tone?: "canvas" | "surface" | "sunken" | "accent";
  density?: "default" | "tight";
  /** Skip the container — for full-bleed media that manages its own gutters. */
  bleed?: boolean;
  className?: string;
  containerClassName?: string;
}) {
  const tones = {
    canvas: "bg-canvas",
    surface: "bg-surface",
    sunken: "bg-surface-sunken",
    accent: "bg-accent-tint",
  } as const;

  return (
    <section
      id={id}
      className={cn(
        tones[tone],
        density === "tight" ? "section-y-tight" : "section-y",
        className,
      )}
    >
      {bleed ? (
        children
      ) : (
        <Container className={containerClassName}>{children}</Container>
      )}
    </section>
  );
}
