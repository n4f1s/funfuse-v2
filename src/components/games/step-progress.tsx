"use client";

import { useRef, type ReactNode } from "react";

import { cn } from "@/lib/cn";
import { gsap, MOTION_QUERY, registerGsap, useGSAP } from "@/lib/motion/gsap";
import { duration, ease, stagger, travel } from "@/lib/motion/tokens";

/**
 * Motion for the How to Play rail: an accent line draws down the spine as the
 * steps rise into place after it, so the sequence reads as one continuous
 * progression rather than a list that merely faded in.
 *
 * The neutral hairline (`border-l`) is real CSS and is always there, with or
 * without JS. The accent line layered on top of it is the only thing GSAP
 * owns, which keeps the base layout correct even if motion never runs. The
 * steps are Server Component `<li>` markup passed as children — this wrapper
 * only owns the timeline, the same division of labour as `FigureRail` on the
 * homepage.
 */
export function StepProgress({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  const scope = useRef<HTMLOListElement>(null);

  useGSAP(
    () => {
      registerGsap();

      const root = scope.current;
      if (!root) return;

      const steps = [...root.children].filter(
        (node): node is HTMLLIElement => node.tagName === "LI",
      );
      if (!steps.length) return;

      const spine = root.querySelector<HTMLElement>("[data-spine]");
      const media = gsap.matchMedia();

      media.add(MOTION_QUERY.ok, () => {
        // Set the JS-controlled starting values before the CSS pre-state
        // class comes off, exactly as `FigureRail` does — GSAP owns the
        // number from here, so the tween below never has to infer a start
        // point from a computed transform.
        if (spine) gsap.set(spine, { scaleY: 0, transformOrigin: "top center" });

        const timeline = gsap.timeline({
          scrollTrigger: { trigger: root, start: "top 80%", once: true },
          onStart: () => gsap.set(steps, { willChange: "transform, opacity" }),
          onComplete: () =>
            gsap.set(spine ? [spine, ...steps] : steps, {
              clearProps: "willChange",
            }),
        });

        if (spine) {
          timeline.to(spine, {
            scaleY: 1,
            duration: duration.reveal * 1.6,
            ease: ease.entrance,
          });
        }

        timeline.from(
          steps,
          {
            opacity: 0,
            y: travel.lg,
            duration: duration.reveal,
            ease: ease.entrance,
            stagger: stagger.base * 1.8,
          },
          spine ? 0.15 : 0,
        );

        clearPreState(root);

        return () => {
          timeline.scrollTrigger?.kill();
          timeline.kill();
        };
      });

      media.add(MOTION_QUERY.reduced, () => {
        clearPreState(root);
        if (spine) gsap.set(spine, { clearProps: "all" });
        gsap.set(steps, { opacity: 1, y: 0, clearProps: "willChange" });
      });

      return () => media.revert();
    },
    { scope },
  );

  return (
    <ol
      ref={scope}
      role="list"
      className={cn(
        "border-line relative flex flex-col gap-10 border-l pl-8 sm:gap-14 sm:pl-12",
        className,
      )}
    >
      <span
        aria-hidden
        data-spine
        className="will-draw-y bg-accent absolute top-0 -left-px h-full w-px"
      />
      {children}
    </ol>
  );
}

function clearPreState(root: HTMLElement) {
  root.querySelectorAll(".will-draw-y").forEach((node) => {
    node.classList.remove("will-draw-y");
  });
}
