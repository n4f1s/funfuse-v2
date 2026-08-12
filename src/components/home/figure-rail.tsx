"use client";

import { useRef, type ReactNode } from "react";

import { cn } from "@/lib/cn";
import { gsap, MOTION_QUERY, registerGsap, useGSAP } from "@/lib/motion/gsap";
import { duration, ease, stagger, travel } from "@/lib/motion/tokens";

/**
 * Choreography for the figures row: the rules draw across, then each column
 * rises under the one it just measured.
 *
 * Why it animates: the row is a set of separate claims, and drawing each rule
 * before its column arrives says so, left to right, in reading order. It is
 * one timeline rather than four `<Reveal>`s because the rule and the figure it
 * belongs to have to be locked to each other, not merely near each other.
 *
 * The children are Server Components. This wrapper only owns motion, so it
 * finds its targets by data attribute instead of taking them as props:
 * `data-rule` is the hairline, `data-figure` is the column it sits over.
 */
export function FigureRail({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  const scope = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      registerGsap();

      const root = scope.current;
      if (!root) return;

      const rules = gsap.utils.toArray<HTMLElement>("[data-rule]", root);
      const figures = gsap.utils.toArray<HTMLElement>("[data-figure]", root);
      const media = gsap.matchMedia();

      media.add(MOTION_QUERY.ok, () => {
        const timeline = gsap.timeline({
          scrollTrigger: { trigger: root, start: "top 85%", once: true },
          onStart: () =>
            gsap.set(figures, { willChange: "transform, opacity" }),
          onComplete: () =>
            gsap.set([...rules, ...figures], { clearProps: "willChange" }),
        });

        timeline
          .from(rules, {
            scaleX: 0,
            transformOrigin: "left center",
            immediateRender: false,
            duration: duration.reveal * 1.2,
            ease: ease.entrance,
            stagger: stagger.base * 1.5,
          })
          .from(
            figures,
            {
              opacity: 0,
              y: travel.lg,
              immediateRender: false,
              duration: duration.reveal,
              ease: ease.entrance,
              stagger: stagger.base * 1.5,
            },
            // Each column follows its own rule rather than waiting for the
            // last one, so the two passes travel together.
            0.14,
          );

        return () => {
          timeline.scrollTrigger?.kill();
          timeline.kill();
        };
      });

      // Reduced motion: the row is simply there.
      media.add(MOTION_QUERY.reduced, () => {
        gsap.set(rules, { clearProps: "all" });
        gsap.set(figures, { clearProps: "all" });
      });

      return () => media.revert();
    },
    { scope },
  );

  return (
    <div ref={scope} className={className}>
      {children}
    </div>
  );
}

/**
 * The hairline over a column. Accent and a touch thicker on the cell that
 * titles the row, so the eye knows which one is the label.
 */
export function FigureRule({ tone = "line" }: { tone?: "line" | "accent" }) {
  return (
    <span
      aria-hidden
      data-rule
      className={cn(
        "will-draw absolute inset-x-0 top-0 origin-left",
        tone === "accent" ? "bg-accent h-0.5" : "bg-line h-px",
      )}
    />
  );
}
