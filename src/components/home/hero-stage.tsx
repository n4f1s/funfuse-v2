"use client";

import { useRef, type ReactNode } from "react";

import { cn } from "@/lib/cn";
import { gsap, MOTION_QUERY, registerGsap, useGSAP } from "@/lib/motion/gsap";
import { ease } from "@/lib/motion/tokens";

/**
 * The hero fan: three pieces of key art dealt into a hand.
 *
 * Why it animates: the catalogue is card games, so the first gesture on the
 * page is a deal. It runs once, on load, and it is the only thing above the
 * fold that moves on its own.
 *
 * **Transform only, never opacity.** An element at `opacity: 0` is not painted,
 * so fading these in would add the whole duration to Largest Contentful Paint,
 * and the front plate is the LCP candidate. Dealing them out of a stack leaves
 * every pixel painted in the first frame.
 *
 * Three jobs sit on three different elements so no two tweens ever write the
 * same property:
 *   - the tilt layer takes the pointer (rotationX / rotationY),
 *   - `[data-drift]` wrappers take the scroll parallax (y),
 *   - `[data-plate]` inners take the deal and the pointer depth offset (x).
 *
 * Markup arrives as `children` from the Server Component, so only this
 * behaviour ships to the browser.
 */

/** Peak tilt, in degrees, at the far edge of the stage. */
const TILT = 5;

/** Horizontal travel, in px, of the front plate at full pointer deflection. */
const DEPTH_SHIFT = 14;

/** How much of `DEPTH_SHIFT` each plate takes, back two first, front last. */
const DEPTH = [0.45, 0.45, 1];

export function HeroStage({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  const stage = useRef<HTMLDivElement>(null);
  const tilt = useRef<HTMLDivElement>(null);
  /**
   * The deal is an entrance, so it gets one performance. `matchMedia` re-runs
   * its callback whenever any of its conditions flips, and without this a
   * desktop window dragged across 1024px would re-deal the hand mid-read.
   */
  const dealt = useRef(false);

  useGSAP(
    () => {
      registerGsap();

      const stageEl = stage.current;
      const tiltEl = tilt.current;
      if (!stageEl || !tiltEl) return;

      const plates = gsap.utils.toArray<HTMLElement>("[data-plate]", stageEl);
      const drifts = gsap.utils.toArray<HTMLElement>("[data-drift]", stageEl);
      if (!plates.length) return;

      const media = gsap.matchMedia();

      media.add(
        {
          ok: MOTION_QUERY.ok,
          // Tilt is a pointer affordance. On touch a tap reports as a hover and
          // leaves the fan stuck mid-lean, so it is gated, not just scaled down.
          pointer: "(hover: hover) and (pointer: fine)",
          // The drift is worth a scroll-linked tween per plate on a desktop
          // stage. On a phone the whole fan is about 240px tall, so the effect
          // is invisible and the work is not.
          desktop: MOTION_QUERY.desktop,
        },
        (context) => {
          const { ok, pointer, desktop } = context.conditions as {
            ok: boolean;
            pointer: boolean;
            desktop: boolean;
          };

          // Reduced motion: the hand is already dealt. A static composition is
          // the correct end state, so there is nothing to schedule.
          if (!ok) return;

          const cleanups: (() => void)[] = [];

          // The deal. Resting rotation is whatever the inline transform already
          // set, so a no-JS render shows the finished hand, not a flat stack.
          if (!dealt.current) {
            dealt.current = true;
            gsap.from(plates, {
              xPercent: (index: number) => [34, -34, 0][index] ?? 0,
              yPercent: (index: number) => [7, 5, 10][index] ?? 0,
              rotation: 0,
              scale: 0.9,
              duration: 0.85,
              ease: ease.entrance,
              stagger: 0.11,
              onStart: () => gsap.set(plates, { willChange: "transform" }),
              onComplete: () => gsap.set(plates, { clearProps: "willChange" }),
            });
          }

          // Parallax as the hero leaves. Each wrapper drifts at its own rate,
          // so the fan opens a little instead of sliding away as one block.
          if (desktop) {
            for (const element of drifts) {
              const tween = gsap.to(element, {
                y: () => Number(element.dataset.drift ?? 0),
                ease: "none",
                scrollTrigger: {
                  trigger: stageEl,
                  start: "top top",
                  end: "bottom top",
                  scrub: 0.5,
                  invalidateOnRefresh: true,
                },
              });
              cleanups.push(() => {
                tween.scrollTrigger?.kill();
                tween.kill();
              });
            }
          }

          if (pointer) {
            // `quickTo` writes straight to the element with its own
            // interpolation: no React state, no rAF loop of ours, and it
            // retargets smoothly instead of restarting.
            const rotateX = gsap.quickTo(tiltEl, "rotationX", {
              duration: 0.6,
              ease: ease.out,
            });
            const rotateY = gsap.quickTo(tiltEl, "rotationY", {
              duration: 0.6,
              ease: ease.out,
            });
            const shift = plates.map((plate) =>
              gsap.quickTo(plate, "x", { duration: 0.7, ease: ease.out }),
            );

            const onMove = (event: PointerEvent) => {
              const bounds = stageEl.getBoundingClientRect();
              const x = (event.clientX - bounds.left) / bounds.width - 0.5;
              const y = (event.clientY - bounds.top) / bounds.height - 0.5;

              rotateX(-y * TILT * 2);
              rotateY(x * TILT * 2);
              shift.forEach((to, index) =>
                to(x * DEPTH_SHIFT * (DEPTH[index] ?? 0.5)),
              );
            };

            const onLeave = () => {
              rotateX(0);
              rotateY(0);
              shift.forEach((to) => to(0));
            };

            stageEl.addEventListener("pointermove", onMove);
            stageEl.addEventListener("pointerleave", onLeave);

            cleanups.push(() => {
              stageEl.removeEventListener("pointermove", onMove);
              stageEl.removeEventListener("pointerleave", onLeave);
            });
          }

          return () => {
            for (const cleanup of cleanups) cleanup();
          };
        },
      );

      return () => media.revert();
    },
    { scope: stage },
  );

  return (
    <div ref={stage} className={cn("relative [perspective:1400px]", className)}>
      <div ref={tilt} className="absolute inset-0 [transform-style:preserve-3d]">
        {children}
      </div>
    </div>
  );
}
