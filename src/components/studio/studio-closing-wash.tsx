"use client";

import { useRef } from "react";

import {
  gsap,
  MOTION_QUERY,
  registerGsap,
  ScrollTrigger,
  useGSAP,
} from "@/lib/motion/gsap";
import { ease } from "@/lib/motion/tokens";

/**
 * The wash behind the sign-off.
 *
 * Why it animates: this is the end of a page whose first screen is a marker
 * stroke painting a grey studio into colour. Closing on a still band would be
 * the page going quiet a beat early. So the ink that did the revealing at the
 * top comes back here as the ground the last two links sit on — same shape
 * language, no repeat of the interaction, and nothing to download.
 *
 * How it stays cheap:
 *   - four `<div>`s with a radial-gradient background and an organic
 *     border-radius. No SVG, no filter, no blur. A CSS filter would have to
 *     re-rasterise every frame; a gradient on a composited layer does not.
 *   - transform only, and never uniform: each blob runs `x`, `y`, `rotation`,
 *     `scaleX` and `scaleY` on five different periods, none of them a multiple
 *     of another. Rotating and stretching an organic radius reads as a shape
 *     changing, which is the whole illusion, and costs one matrix per frame.
 *   - the timelines pause the moment the band leaves the viewport, which is
 *     most of the time on most visits. An idle infinite tween holds a
 *     compositor layer open for as long as the tab is, and this one is at the
 *     bottom of a long page.
 *
 * Reduced motion gets the composition and none of the movement: the blobs are
 * already in place in the markup, so there is nothing to resolve.
 *
 * Decorative in full. The section's meaning is entirely in the two links.
 */

/**
 * Resting layout, in percentages of the band, plus each blob's own clock.
 * `radius` is the organic silhouette; rotation is what makes it read as one.
 */
const BLOBS = [
  {
    className: "-top-[18%] -left-[6%] h-[64%] w-[42%]",
    tint: "var(--color-brand-100)",
    radius: "58% 42% 47% 53% / 46% 39% 61% 54%",
    drift: { x: 28, y: -22, r: 14, sx: 1.09, sy: 0.93 },
    period: { x: 17, y: 13, r: 23, s: 11 },
  },
  {
    className: "top-[24%] left-[38%] h-[86%] w-[46%]",
    tint: "var(--color-brand-50)",
    radius: "42% 58% 63% 37% / 51% 44% 56% 49%",
    drift: { x: -34, y: 26, r: -11, sx: 0.94, sy: 1.08 },
    period: { x: 21, y: 15.5, r: 29, s: 13.5 },
  },
  {
    className: "-top-[10%] right-[2%] h-[78%] w-[38%]",
    tint: "var(--color-brand-100)",
    radius: "51% 49% 38% 62% / 57% 52% 48% 43%",
    drift: { x: -22, y: 30, r: 17, sx: 1.06, sy: 0.95 },
    period: { x: 19, y: 12.5, r: 25, s: 16 },
  },
  {
    className: "bottom-[-22%] left-[16%] h-[58%] w-[34%]",
    tint: "var(--color-accent-tint)",
    radius: "47% 53% 55% 45% / 39% 58% 42% 61%",
    drift: { x: 30, y: -18, r: -15, sx: 0.96, sy: 1.07 },
    period: { x: 14.5, y: 18, r: 31, s: 9.5 },
  },
] as const;

export function StudioClosingWash({ className }: { className?: string }) {
  const scope = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const root = scope.current;
      if (!root) return;

      const blobs = gsap.utils.toArray<HTMLElement>("[data-blob]", root);
      if (!blobs.length) return;

      try {
        registerGsap();

        const media = gsap.matchMedia();

        media.add(MOTION_QUERY.ok, () => {
          const timelines = blobs.map((blob, index) => {
            const { drift, period } = BLOBS[index] ?? BLOBS[0];

            // One timeline per blob so the five properties can run at five
            // unrelated periods. `yoyo` with `repeat: -1` means each leg eases
            // in and out of its own turning point, which is why nothing in the
            // group ever lines up twice.
            const timeline = gsap.timeline({ paused: true });
            const loop = (
              vars: gsap.TweenVars,
              duration: number,
            ): gsap.core.Timeline =>
              timeline.to(
                blob,
                {
                  ...vars,
                  duration,
                  ease: ease.loop,
                  repeat: -1,
                  yoyo: true,
                },
                0,
              );

            loop({ xPercent: drift.x }, period.x);
            loop({ yPercent: drift.y }, period.y);
            loop({ rotation: drift.r }, period.r);
            loop({ scaleX: drift.sx, scaleY: drift.sy }, period.s);

            // Started mid-flight, at a different point per blob, so the band
            // is never caught with four shapes at rest in the same instant.
            timeline.progress((index + 1) / (blobs.length + 1));
            return timeline;
          });

          // Off screen is not just cheaper, it is most of the page's life.
          const trigger = ScrollTrigger.create({
            trigger: root,
            start: "top bottom",
            end: "bottom top",
            onToggle: ({ isActive }) => {
              gsap.set(blobs, {
                willChange: isActive ? "transform" : "auto",
              });
              for (const timeline of timelines) {
                if (isActive) timeline.play();
                else timeline.pause();
              }
            },
          });

          return () => {
            trigger.kill();
            for (const timeline of timelines) timeline.kill();
          };
        });

        return () => media.revert();
      } catch {
        // The band is a background. If the motion cannot start, the resting
        // composition in the markup is already a finished one.
      }
    },
    { scope },
  );

  return (
    <div ref={scope} aria-hidden className={className}>
      {BLOBS.map((blob) => (
        <span
          key={blob.className}
          data-blob
          className={`absolute block ${blob.className}`}
          style={{
            borderRadius: blob.radius,
            background: `radial-gradient(closest-side, ${blob.tint}, transparent)`,
          }}
        />
      ))}
    </div>
  );
}
