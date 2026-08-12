"use client";

import { useRef, type ReactNode } from "react";

import { cn } from "@/lib/cn";
import { gsap, MOTION_QUERY, registerGsap, useGSAP } from "@/lib/motion/gsap";
import { ease } from "@/lib/motion/tokens";

/**
 * A decorative prop that drifts against the scroll.
 *
 * Why it animates: depth. These are 3D game objects sitting in the same flat
 * plane as the type, and the only thing that puts them behind the page rather
 * than on it is moving them at a different rate. Each one takes its own
 * `drift`, so no two travel together.
 *
 * Two elements, two jobs, so the tweens never fight over `transform`:
 *   - the outer node takes the scrubbed drift and spin,
 *   - the inner node takes the idle bob.
 *
 * The bob is desktop-only. An infinite tween keeps a compositor layer alive for
 * as long as the page is open, and four of those idling on a mid-range Android
 * is exactly the sort of cost that never shows up in a screenshot.
 *
 * Always `aria-hidden` and never clickable: nothing here carries meaning, and a
 * prop that eats a click on the text behind it is a bug.
 */
export function FloatingProp({
  children,
  className,
  /**
   * Total scrubbed travel in px across the pass. Negative goes toward the start
   * of the axis: up on `y`, left on `x`.
   */
  drift = -110,
  /**
   * Which way `drift` runs.
   *
   * `y` is the default and reads as depth: the prop hangs behind the page and
   * the page slides past it. `x` is for objects that should read as *going
   * somewhere*, and it only makes sense on a prop that has a front. The jeepney
   * is drawn facing left, so it drives left.
   */
  axis = "y",
  /** Total scrubbed rotation in degrees across the pass. */
  spin = 14,
  /** Idle bob. Turn it off where the prop sits close to running text. */
  bob = true,
}: {
  children: ReactNode;
  className?: string;
  drift?: number;
  axis?: "x" | "y";
  spin?: number;
  bob?: boolean;
}) {
  const scope = useRef<HTMLDivElement>(null);
  const inner = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      registerGsap();

      const root = scope.current;
      const floater = inner.current;
      if (!root || !floater) return;

      const media = gsap.matchMedia();

      media.add(
        { ok: MOTION_QUERY.ok, desktop: MOTION_QUERY.desktop },
        (context) => {
          const { ok, desktop } = context.conditions as {
            ok: boolean;
            desktop: boolean;
          };

          // Reduced motion: the prop stays exactly where the layout put it.
          // It is decoration, so there is nothing to communicate by moving it.
          if (!ok) return;

          // The bob already owns `y` on the inner node, so an `x` prop and a
          // `y` prop never end up writing the same property on the same element.
          const travel = gsap.fromTo(
            root,
            { [axis]: -drift / 2, rotate: -spin / 2 },
            {
              [axis]: drift / 2,
              rotate: spin / 2,
              ease: ease.linear,
              scrollTrigger: {
                trigger: root,
                start: "top bottom",
                end: "bottom top",
                scrub: 0.8,
                invalidateOnRefresh: true,
              },
            },
          );

          const idle =
            desktop && bob
              ? gsap.to(floater, {
                  y: -9,
                  duration: 2.6,
                  ease: ease.loop,
                  yoyo: true,
                  repeat: -1,
                })
              : null;

          return () => {
            travel.scrollTrigger?.kill();
            travel.kill();
            idle?.kill();
          };
        },
      );

      return () => media.revert();
    },
    { scope, dependencies: [drift, axis, spin, bob] },
  );

  return (
    <div
      ref={scope}
      aria-hidden
      className={cn("pointer-events-none absolute select-none", className)}
    >
      <div ref={inner}>{children}</div>
    </div>
  );
}
