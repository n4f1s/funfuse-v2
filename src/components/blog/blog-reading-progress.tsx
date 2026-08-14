"use client";

import { useRef } from "react";

import { gsap, MOTION_QUERY, registerGsap, useGSAP } from "@/lib/motion/gsap";
import { ease } from "@/lib/motion/tokens";

/**
 * How far through the guide you are, pinned under the sticky header.
 *
 * Why it animates: feedback. These articles run past ten screens, and the
 * scrollbar is hidden or overlaid on the phones most of our readers use, so
 * this is the only depth cue they get. It is scrubbed, never autonomous: the
 * bar only moves because the reader moved, which is why it survives
 * `prefers-reduced-motion` unchanged.
 */
export function BlogReadingProgress({ target }: { target: string }) {
  const bar = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    const element = bar.current;
    if (!element) return;

    registerGsap();

    const media = gsap.matchMedia();

    // Both motion preferences get the same tween on purpose. Reduced motion
    // asks for no autonomous movement; a scrub has none, because every frame
    // it draws was caused by the reader's own scroll. Removing it would take
    // away a comprehension aid, which is the opposite of what the setting asks
    // for. The query is written out rather than omitted so this is a decision
    // in the code and not an oversight.
    media.add(`${MOTION_QUERY.ok}, ${MOTION_QUERY.reduced}`, () => {
      const article = document.querySelector<HTMLElement>(target);
      if (!article) return;

      const tween = gsap.fromTo(
        element,
        { scaleX: 0 },
        {
          scaleX: 1,
          ease: ease.linear,
          scrollTrigger: {
            trigger: article,
            start: "top top",
            end: "bottom bottom",
            scrub: 0.2,
          },
        },
      );

      return () => {
        tween.scrollTrigger?.kill();
        tween.kill();
      };
    });

    return () => media.revert();
  });

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-x-0 top-[var(--header-height)] z-40 h-0.5"
    >
      <div ref={bar} className="h-full origin-left scale-x-0 bg-accent" />
    </div>
  );
}
