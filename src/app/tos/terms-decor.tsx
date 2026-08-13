"use client";

import { useRef } from "react";

import {
  MOTION_QUERY,
  gsap,
  registerGsap,
  useGSAP,
} from "@/lib/motion/gsap";
import { ease } from "@/lib/motion/tokens";

registerGsap();

type Suit = "♠" | "♥" | "♦" | "♣";

type FaceCardProps = {
  suit: Suit;
  rank: "A" | "K" | "Q" | "J" | "10";
};

function isRedSuit(suit: Suit) {
  return suit === "♥" || suit === "♦";
}

function FaceCard({ suit, rank }: FaceCardProps) {
  const red = isRedSuit(suit);

  return (
    <div className="relative h-full w-full overflow-hidden rounded-[1.6rem] border border-line bg-surface shadow-lg">
      <div className="pointer-events-none absolute inset-[5%] rounded-[1.25rem] border border-line/80" />

      <div
        className={[
          "absolute left-[9%] top-[7%] flex flex-col items-center",
          "font-display font-semibold leading-none",
          red ? "text-accent" : "text-heading",
        ].join(" ")}
      >
        <span className="text-[1.2rem] sm:text-[1.45rem]">{rank}</span>
        <span className="mt-1 text-[1.05rem] sm:text-[1.25rem]">{suit}</span>
      </div>

      <div
        className={[
          "absolute bottom-[7%] right-[9%] flex rotate-180 flex-col items-center",
          "font-display font-semibold leading-none",
          red ? "text-accent" : "text-heading",
        ].join(" ")}
      >
        <span className="text-[1.2rem] sm:text-[1.45rem]">{rank}</span>
        <span className="mt-1 text-[1.05rem] sm:text-[1.25rem]">{suit}</span>
      </div>

      <div className="absolute inset-0 grid place-items-center">
        <div
          className={[
            "relative grid aspect-square w-[44%] place-items-center rounded-full",
            red ? "bg-accent-tint" : "bg-surface-muted",
          ].join(" ")}
        >
          <div
            aria-hidden="true"
            className={[
              "absolute inset-[-22%] rounded-full border",
              red ? "border-accent/10" : "border-line",
            ].join(" ")}
          />

          <span
            className={[
              "relative text-[3.5rem] leading-none sm:text-[4.5rem]",
              red ? "text-accent" : "text-heading",
            ].join(" ")}
          >
            {suit}
          </span>
        </div>
      </div>

      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-[12%] top-[6%] h-[22%] rounded-full bg-white/35 blur-xl"
      />
    </div>
  );
}

function BackPattern() {
  return (
    <div className="relative h-full w-full overflow-hidden rounded-[1.6rem] border border-accent/25 bg-surface shadow-lg">
      {/* Outer printed border */}
      <div className="absolute inset-[5%] rounded-[1.3rem] border-2 border-accent/35" />

      {/* Inner red field */}
      <div className="absolute inset-[9%] overflow-hidden rounded-[1rem] bg-accent">
        {/* Fine diamond pattern */}
        <div
          className="absolute inset-0 opacity-25"
          style={{
            backgroundImage: `
              linear-gradient(45deg, white 1px, transparent 1px),
              linear-gradient(-45deg, white 1px, transparent 1px)
            `,
            backgroundSize: "12px 12px",
          }}
        />

        {/* Center emblem */}
        <div className="absolute left-1/2 top-1/2 grid h-[38%] w-[38%] -translate-x-1/2 -translate-y-1/2 rotate-45 place-items-center rounded-[18%] border-2 border-white/75 bg-accent-strong shadow-sm">
          <div className="-rotate-45 text-[2.6rem] leading-none text-white">
            ♠
          </div>
        </div>
      </div>

      {/* Corner marks */}
      <span className="absolute left-[11%] top-[9%] text-xl text-accent">
        ♥
      </span>

      <span className="absolute bottom-[9%] right-[11%] rotate-180 text-xl text-accent">
        ♦
      </span>
    </div>
  );
}

export function TermsDecor() {
  const scope = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const root = scope.current;
      if (!root) return;

      const mm = gsap.matchMedia();

      mm.add(MOTION_QUERY.ok, () => {
        const shells = gsap.utils.toArray<HTMLElement>(
          "[data-terms-card-shell]",
          root,
        );

        gsap.fromTo(
          shells,
          {
            autoAlpha: 0,
            scale: 0.96,
          },
          {
            autoAlpha: 1,
            scale: 1,
            duration: 0.8,
            stagger: 0.08,
            ease: ease.out,
          },
        );

        const scrollCards = gsap.utils.toArray<HTMLElement>(
          "[data-terms-scroll-card]",
          root,
        );

        scrollCards.forEach((card) => {
          const depth = Number(card.dataset.depth ?? 1);

          gsap.fromTo(
            card,
            {
              yPercent: depth * 6,
            },
            {
              yPercent: depth * -20,
              ease: "none",
              scrollTrigger: {
                trigger: root,
                start: "top top",
                end: "bottom top",
                scrub: 1.2,
              },
            },
          );
        });

        const pointerCards = gsap.utils.toArray<HTMLElement>(
          "[data-terms-pointer-card]",
          root,
        );

        const controls = pointerCards.map((card) => {
          const depth = Number(card.dataset.pointerDepth ?? 1);

          return {
            depth,
            x: gsap.quickTo(card, "x", {
              duration: 0.75,
              ease: "power3.out",
            }),
            y: gsap.quickTo(card, "y", {
              duration: 0.75,
              ease: "power3.out",
            }),
            rotationX: gsap.quickTo(card, "rotationX", {
              duration: 0.8,
              ease: "power3.out",
            }),
            rotationY: gsap.quickTo(card, "rotationY", {
              duration: 0.8,
              ease: "power3.out",
            }),
          };
        });

        const finePointer = window.matchMedia(
          "(hover: hover) and (pointer: fine)",
        );

        const handlePointerMove = (event: PointerEvent) => {
          if (!finePointer.matches) return;

          const x = event.clientX / window.innerWidth - 0.5;
          const y = event.clientY / window.innerHeight - 0.5;

          controls.forEach(
            ({ depth, x: moveX, y: moveY, rotationX, rotationY }) => {
              moveX(x * 22 * depth);
              moveY(y * 14 * depth);
              rotationY(x * 3.2 * depth);
              rotationX(y * -2.5 * depth);
            },
          );
        };

        const resetPointer = () => {
          controls.forEach(
            ({ x, y, rotationX, rotationY }) => {
              x(0);
              y(0);
              rotationX(0);
              rotationY(0);
            },
          );
        };

        window.addEventListener("pointermove", handlePointerMove, {
          passive: true,
        });
        document.documentElement.addEventListener(
          "mouseleave",
          resetPointer,
        );

        return () => {
          window.removeEventListener("pointermove", handlePointerMove);
          document.documentElement.removeEventListener(
            "mouseleave",
            resetPointer,
          );
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
      {/* Ambient lighting */}
      <div className="absolute left-1/2 top-16 h-[28rem] w-[56rem] max-w-[90vw] -translate-x-1/2 rounded-full bg-accent-tint/65 blur-3xl" />

      <div className="absolute -left-[12rem] top-[8rem] h-[34rem] w-[34rem] rounded-full bg-surface opacity-70 blur-3xl" />

      <div className="absolute -right-[13rem] top-[36rem] h-[36rem] w-[36rem] rounded-full bg-accent-tint/50 blur-3xl" />

      {/* Ace of Spades */}
      <div
        data-terms-scroll-card
        data-depth="1"
        className="absolute left-[2%] top-[10rem] hidden h-64 w-44 lg:block xl:left-[4%]"
      >
        <div
          data-terms-pointer-card
          data-pointer-depth="0.7"
          className="h-full w-full transform-3d"
        >
          <div
            data-terms-card-shell
            className="h-full w-full -rotate-[11deg]"
          >
            <FaceCard suit="♠" rank="A" />
          </div>
        </div>
      </div>

      {/* King of Hearts */}
      <div
        data-terms-scroll-card
        data-depth="1.45"
        className="absolute right-[2%] top-[30rem] hidden h-72 w-48 xl:block xl:right-[4%]"
      >
        <div
          data-terms-pointer-card
          data-pointer-depth="0.95"
          className="h-full w-full transform-3d"
        >
          <div
            data-terms-card-shell
            className="h-full w-full rotate-[9deg]"
          >
            <FaceCard suit="♥" rank="K" />
          </div>
        </div>
      </div>

      {/* Queen of Diamonds */}
      <div
        data-terms-scroll-card
        data-depth="0.75"
        className="absolute left-[3%] top-[78rem] hidden h-52 w-36 xl:block xl:left-[7%]"
      >
        <div
          data-terms-pointer-card
          data-pointer-depth="0.52"
          className="h-full w-full transform-3d"
        >
          <div
            data-terms-card-shell
            className="h-full w-full rotate-[7deg]"
          >
            <FaceCard suit="♦" rank="Q" />
          </div>
        </div>
      </div>

      {/* Jack of Clubs */}
      <div
        data-terms-scroll-card
        data-depth="1.2"
        className="absolute right-[2%] top-[116rem] hidden h-60 w-40 lg:block xl:right-[6%]"
      >
        <div
          data-terms-pointer-card
          data-pointer-depth="0.75"
          className="h-full w-full transform-3d"
        >
          <div
            data-terms-card-shell
            className="h-full w-full -rotate-[8deg]"
          >
            <FaceCard suit="♣" rank="J" />
          </div>
        </div>
      </div>

      {/* Decorative card back */}
      <div
        data-terms-scroll-card
        data-depth="0.55"
        className="absolute left-[4%] top-[158rem] hidden h-52 w-36 xl:block xl:left-[8%]"
      >
        <div
          data-terms-pointer-card
          data-pointer-depth="0.4"
          className="h-full w-full transform-3d"
        >
          <div
            data-terms-card-shell
            className="h-full w-full rotate-[12deg] opacity-90"
          >
            <BackPattern />
          </div>
        </div>
      </div>

      {/* Ten of Hearts lower down */}
      <div
        data-terms-scroll-card
        data-depth="1.05"
        className="absolute right-[3%] top-[202rem] hidden h-56 w-40 xl:block xl:right-[7%]"
      >
        <div
          data-terms-pointer-card
          data-pointer-depth="0.65"
          className="h-full w-full transform-3d"
        >
          <div
            data-terms-card-shell
            className="h-full w-full rotate-[6deg]"
          >
            <FaceCard suit="♥" rank="10" />
          </div>
        </div>
      </div>
    </div>
  );
}