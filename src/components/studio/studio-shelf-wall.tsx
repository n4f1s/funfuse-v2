"use client";

import { useRef, type ReactNode } from "react";

import { cn } from "@/lib/cn";
import {
  failOpenRevealTargets,
  gsap,
  MOTION_QUERY,
  registerGsap,
  useGSAP,
} from "@/lib/motion/gsap";
import { duration, ease } from "@/lib/motion/tokens";

/**
 * The shelf, assembling.
 *
 * Why it animates: this is the only place on the page where the whole body of
 * work is on screen at once, and nineteen icons appearing together is a grid.
 * Landing them on a diagonal makes it a set being laid out, which is the
 * sentence the section is trying to say.
 *
 * One timeline, one pass, transform and opacity only. `grid: "auto"` reads the
 * real positions after layout, so the wave travels correctly at three columns
 * on a phone and at six on a desktop without either being described here.
 *
 * The tiles are Server Components and every one is a real link. This wrapper
 * owns motion and nothing else.
 */
export function StudioShelfWall({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  const scope = useRef<HTMLUListElement>(null);

  useGSAP(
    () => {
      const root = scope.current;
      if (!root) return;

      const tiles = [...root.children] as HTMLElement[];
      if (!tiles.length) return;

      try {
        registerGsap();

        const media = gsap.matchMedia();

        media.add(MOTION_QUERY.ok, () => {
          try {
            const tween = gsap.fromTo(
              tiles,
              { autoAlpha: 0, scale: 0.82, y: 22 },
              {
                autoAlpha: 1,
                scale: 1,
                y: 0,
                immediateRender: true,
                duration: duration.reveal,
                ease: ease.entrance,
                stagger: {
                  // Total, not per tile: nineteen icons at a fixed per-item
                  // delay would take three seconds to finish.
                  amount: 0.7,
                  grid: "auto",
                  from: "start",
                },
                scrollTrigger: { trigger: root, start: "top 88%", once: true },
                onStart: () =>
                  gsap.set(tiles, { willChange: "transform, opacity" }),
                onComplete: () => gsap.set(tiles, { clearProps: "willChange" }),
              },
            );

            return () => {
              tween.scrollTrigger?.kill();
              tween.kill();
            };
          } catch {
            failOpenRevealTargets(tiles);
          }
        });

        media.add(MOTION_QUERY.reduced, () => {
          gsap.set(tiles, { autoAlpha: 1, scale: 1, y: 0 });
        });

        return () => media.revert();
      } catch {
        failOpenRevealTargets(tiles);
      }
    },
    { scope },
  );

  return (
    // `reveal-stagger` hides the children before first paint, so the assemble
    // cannot flash a finished grid and then rebuild it. The utility resolves
    // itself under reduced motion and with scripting off.
    <ul ref={scope} role="list" className={cn("reveal-stagger", className)}>
      {children}
    </ul>
  );
}
