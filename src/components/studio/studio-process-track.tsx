"use client";

import { useRef, type ReactNode } from "react";

import {
  gsap,
  MOTION_QUERY,
  registerGsap,
  ScrollTrigger,
  useGSAP,
} from "@/lib/motion/gsap";

/**
 * The process list, drawn as it is read.
 *
 * Why it animates: the section is a sequence, and a list of five paragraphs is
 * not. One line grows down the column as the page moves, and each step lights
 * when the line reaches it, so the order is something you watch happen rather
 * than something you infer from the numbering.
 *
 * It is also the page's second statement of the hero's idea. The markers start
 * in pencil grey and turn brand red on arrival — the same "a sketch becomes a
 * finished thing" the hero says with two images, said here with two colours
 * and no second download.
 *
 * Cheap by construction:
 *   - the line is one `scaleY` scrub on a one-pixel element. No layout, no
 *     paint, one compositor property.
 *   - lighting a step is an attribute flip that CSS reads. Five triggers that
 *     fire once each way, not five tweens running down the page.
 *
 * The children are Server Components, so this finds its targets by data
 * attribute rather than taking them as props: `data-progress` is the line,
 * `data-step` is a step.
 *
 * Without JavaScript the line is already full and every step is lit, because
 * the markup ships that way and this island is what takes it back to zero.
 */
export function StudioProcessTrack({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  const scope = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const root = scope.current;
      if (!root) return;

      const line = root.querySelector<HTMLElement>("[data-progress]");
      const steps = gsap.utils.toArray<HTMLElement>("[data-step]", root);
      if (!line || !steps.length) return;

      const light = (step: HTMLElement, on: boolean) => {
        if (on) step.setAttribute("data-lit", "");
        else step.removeAttribute("data-lit");
      };

      const lightAll = () => {
        gsap.set(line, { scaleY: 1 });
        for (const step of steps) light(step, true);
      };

      try {
        registerGsap();

        const media = gsap.matchMedia();

        media.add(MOTION_QUERY.ok, () => {
          for (const step of steps) light(step, false);

          const tween = gsap.fromTo(
            line,
            { scaleY: 0 },
            {
              scaleY: 1,
              ease: "none",
              immediateRender: true,
              scrollTrigger: {
                trigger: root,
                // Starts as the head of the list reaches the lower third and
                // finishes as the last step clears the middle, so the line is
                // always slightly ahead of what is being read.
                start: "top 72%",
                end: "bottom 62%",
                scrub: 0.5,
                invalidateOnRefresh: true,
              },
            },
          );

          // Reversible on purpose: scrolling back up un-lights the steps, so
          // the line and the markers never disagree about where the page is.
          const triggers = steps.map((step) =>
            ScrollTrigger.create({
              trigger: step,
              start: "top 68%",
              onEnter: () => light(step, true),
              onLeaveBack: () => light(step, false),
            }),
          );

          return () => {
            tween.scrollTrigger?.kill();
            tween.kill();
            for (const trigger of triggers) trigger.kill();
          };
        });

        // Reduced motion: the whole thing is already drawn. The order is in the
        // numbers, and none of it needs travel to be understood.
        media.add(MOTION_QUERY.reduced, lightAll);

        return () => media.revert();
      } catch {
        // A failed setup must never leave the column half grey and half red.
        lightAll();
      }
    },
    { scope },
  );

  return (
    <div ref={scope} className={className}>
      {children}
    </div>
  );
}
