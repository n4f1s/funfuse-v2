"use client";

import { useRef, type ElementType, type ReactNode } from "react";

import { gsap, MOTION_QUERY, registerGsap, useGSAP } from "@/lib/motion/gsap";

/**
 * Vertical drift, scrubbed against the element's pass through the viewport.
 *
 * Why it animates: depth. Two plates that move at the same speed are two flat
 * images; two plates that move at different speeds sit at different distances.
 * That is the only thing this is for, so the travel is deliberately small.
 *
 * Desktop and `no-preference` only. Under reduced motion the element simply
 * stays where the layout put it, and on a phone the effect is not worth a
 * scroll-linked tween per element.
 *
 * `<Reveal>` covers the ordinary "content arrives on scroll" case. Reach for
 * this only when two things need to move at different rates.
 */
export function Parallax({
  children,
  as: Tag = "div",
  /** Total travel in px across the pass. Negative rises, positive lags. */
  distance = -40,
  className,
}: {
  children: ReactNode;
  as?: ElementType;
  distance?: number;
  className?: string;
}) {
  const scope = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      registerGsap();

      const root = scope.current;
      if (!root) return;

      const media = gsap.matchMedia();

      media.add(
        `${MOTION_QUERY.ok} and ${MOTION_QUERY.desktop}`,
        () => {
          const tween = gsap.fromTo(
            root,
            { y: -distance / 2 },
            {
              y: distance / 2,
              ease: "none",
              scrollTrigger: {
                trigger: root,
                start: "top bottom",
                end: "bottom top",
                scrub: 0.6,
                invalidateOnRefresh: true,
              },
            },
          );

          return () => {
            tween.scrollTrigger?.kill();
            tween.kill();
          };
        },
      );

      return () => media.revert();
    },
    { scope, dependencies: [distance] },
  );

  return (
    <Tag ref={scope} className={className}>
      {children}
    </Tag>
  );
}
