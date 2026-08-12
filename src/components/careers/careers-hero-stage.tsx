"use client";

import { useRef } from "react";

import { cn } from "@/lib/cn";
import { gsap, MOTION_QUERY, registerGsap, useGSAP } from "@/lib/motion/gsap";
import { ease } from "@/lib/motion/tokens";

/**
 * A quiet, card-inspired counterweight to the hero type.
 *
 * It is deliberately abstract. The careers content does not supply an image
 * or a claim that an illustration could truthfully represent, so this borrows
 * the physical language of a deck without inventing studio facts. The resting
 * arrangement is complete in the server HTML; motion only adds a little depth
 * on capable desktop devices.
 */
export function CareersHeroStage({ className }: { className?: string }) {
  const scope = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const root = scope.current;
      if (!root) return;

      registerGsap();
      const cards = gsap.utils.toArray<HTMLElement>("[data-career-card]", root);
      if (!cards.length) return;

      const media = gsap.matchMedia();

      media.add(
        `${MOTION_QUERY.ok} and ${MOTION_QUERY.desktop}`,
        () => {
          const tweens = cards.map((card, index) =>
            gsap.to(card, {
              y: index % 2 === 0 ? -8 : 8,
              duration: 2.6 + index * 0.22,
              ease: ease.loop,
              repeat: -1,
              yoyo: true,
            }),
          );

          return () => {
            for (const tween of tweens) tween.kill();
          };
        },
      );

      return () => media.revert();
    },
    { scope },
  );

  return (
    <div
      ref={scope}
      aria-hidden
      className={cn("relative aspect-[5/4] w-full", className)}
    >
      <div className="absolute left-[5%] top-[18%] h-[52%] w-[43%] -rotate-[13deg] rounded-lg border border-brand-200 bg-surface shadow-md">
        <div className="absolute inset-3 rounded-md border border-brand-100" />
      </div>

      <div
        data-career-card
        className="absolute left-[28%] top-[7%] h-[61%] w-[48%] rotate-[7deg] rounded-lg bg-accent shadow-lg"
      >
        <div className="absolute inset-3 rounded-md border border-surface/45" />
        <span className="absolute left-[17%] top-[18%] h-3 w-3 rounded-full bg-surface/90" />
        <span className="absolute bottom-[18%] right-[17%] h-3 w-3 rounded-full bg-surface/90" />
        <span className="absolute left-1/2 top-1/2 h-16 w-16 -translate-x-1/2 -translate-y-1/2 rounded-full border-[10px] border-surface/90" />
      </div>

      <div
        data-career-card
        className="absolute bottom-[5%] right-[3%] h-[45%] w-[39%] rotate-[18deg] rounded-lg border border-line bg-surface shadow-md"
      >
        <div className="absolute inset-3 rounded-md bg-surface-muted" />
        <span className="absolute left-1/2 top-1/2 h-12 w-12 -translate-x-1/2 -translate-y-1/2 rotate-45 border border-brand-300 bg-brand-50" />
      </div>
    </div>
  );
}
