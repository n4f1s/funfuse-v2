"use client";

import { useRef } from "react";

import {
  MOTION_QUERY,
  gsap,
  registerGsap,
  useGSAP,
} from "@/lib/motion/gsap";
registerGsap();

type Suit = "♠" | "♥" | "♦" | "♣";

function MiniCard({
  rank,
  suit,
}: {
  rank: string;
  suit: Suit;
}) {
  const red = suit === "♥" || suit === "♦";

  return (
    <div className="relative h-full w-full overflow-hidden rounded-lg border border-line bg-surface shadow-lg">
      <div className="absolute inset-[6%] rounded-md border border-line/80" />
      <div
        className={`absolute left-[10%] top-[8%] flex flex-col font-display text-lg font-semibold leading-none ${
          red ? "text-accent" : "text-heading"
        }`}
      >
        <span>{rank}</span>
        <span className="mt-1 text-base">{suit}</span>
      </div>
      <span
        className={`absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-5xl leading-none ${
          red ? "text-accent" : "text-heading"
        }`}
      >
        {suit}
      </span>
    </div>
  );
}

export function FaqDecor() {
  const scope = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const root = scope.current;
      if (!root) return;

      const mm = gsap.matchMedia();

      mm.add(MOTION_QUERY.ok, () => {
        const cards = gsap.utils.toArray<HTMLElement>("[data-faq-card]", root);

        cards.forEach((card) => {
          const depth = Number(card.dataset.depth ?? 1);

          gsap.to(card, {
            yPercent: -12 * depth,
            ease: "none",
            scrollTrigger: {
              trigger: root,
              start: "top top",
              end: "bottom top",
              scrub: 1.1,
            },
          });
        });

        const pointer = window.matchMedia("(hover: hover) and (pointer: fine)");
        const movers = gsap.utils
          .toArray<HTMLElement>("[data-faq-pointer]", root)
          .map((card) => {
            const depth = Number(card.dataset.pointerDepth ?? 1);
            return {
              depth,
              x: gsap.quickTo(card, "x", { duration: 0.7, ease: "power3.out" }),
              y: gsap.quickTo(card, "y", { duration: 0.7, ease: "power3.out" }),
              rotation: gsap.quickTo(card, "rotation", {
                duration: 0.8,
                ease: "power3.out",
              }),
            };
          });

        const move = (event: PointerEvent) => {
          if (!pointer.matches) return;
          const nx = event.clientX / window.innerWidth - 0.5;
          const ny = event.clientY / window.innerHeight - 0.5;

          movers.forEach(({ depth, x, y, rotation }) => {
            x(nx * 18 * depth);
            y(ny * 10 * depth);
            rotation(nx * 2.2 * depth);
          });
        };

        const reset = () => {
          movers.forEach(({ x, y, rotation }) => {
            x(0);
            y(0);
            rotation(0);
          });
        };

        window.addEventListener("pointermove", move, { passive: true });
        document.documentElement.addEventListener("mouseleave", reset);

        return () => {
          window.removeEventListener("pointermove", move);
          document.documentElement.removeEventListener("mouseleave", reset);
        };
      });

      return () => mm.revert();
    },
    { scope },
  );

  return (
    <div
      ref={scope}
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 overflow-hidden"
    >
      <div className="absolute left-1/2 top-8 h-[30rem] w-[60rem] max-w-[92vw] -translate-x-1/2 rounded-full bg-accent-tint/70 blur-3xl" />

      <div
        data-faq-card
        data-depth="0.8"
        className="absolute -left-10 top-24 hidden h-48 w-32 lg:block xl:left-[3%]"
      >
        <div
          data-faq-pointer
          data-pointer-depth="0.65"
          className="h-full w-full -rotate-[10deg]"
        >
          <MiniCard rank="A" suit="♠" />
        </div>
      </div>

      <div
        data-faq-card
        data-depth="0.65"
        className="absolute bottom-28 left-[5%] hidden h-44 w-28 xl:block"
      >
        <div
          data-faq-pointer
          data-pointer-depth="0.45"
          className="h-full w-full rotate-[6deg] opacity-90"
        >
          <MiniCard rank="J" suit="♦" />
        </div>
      </div>
    </div>
  );
}
