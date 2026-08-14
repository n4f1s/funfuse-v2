"use client";

import { useRef } from "react";

import heroCharacter from "@/assets/decorative/characters/traditional-dress-woman.png";
import { Media } from "@/components/media";
import {
  failOpenRevealTargets,
  gsap,
  MOTION_QUERY,
  registerGsap,
  useGSAP,
} from "@/lib/motion/gsap";
import { duration, ease } from "@/lib/motion/tokens";

/**
 * The index hero prop: three cards dealt into a fan beside the dealer.
 *
 * Why it animates: storytelling. Every guide on this page is about a hand
 * being dealt, so the page opens by dealing one. It runs once on load, it is
 * decorative (`aria-hidden`), and it deliberately leaves the character alone —
 * that image is painted eagerly and must not sit behind an opacity tween.
 */
export function BlogHeroDeck() {
  const stage = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const root = stage.current;
      if (!root) return;

      const cards = [...root.querySelectorAll<HTMLElement>(".blog-hero-card")];
      if (cards.length === 0) return;

      try {
        registerGsap();

        const media = gsap.matchMedia();

        media.add(MOTION_QUERY.ok, () => {
          try {
            // The fanned resting angle lives in CSS as the independent
            // `rotate` property, so GSAP's transform-based `rotation` composes
            // with it instead of fighting it.
            const tween = gsap.fromTo(
              cards,
              { autoAlpha: 0, x: 44, y: -26, rotation: -14, scale: 0.9 },
              {
                autoAlpha: 1,
                x: 0,
                y: 0,
                rotation: 0,
                scale: 1,
                duration: duration.reveal,
                ease: ease.out,
                stagger: 0.09,
                delay: 0.15,
                onStart: () => gsap.set(cards, { willChange: "transform, opacity" }),
                onComplete: () => gsap.set(cards, { clearProps: "willChange" }),
              },
            );

            return () => tween.kill();
          } catch {
            failOpenRevealTargets(cards);
          }
        });

        media.add(MOTION_QUERY.reduced, () => {
          gsap.set(cards, { autoAlpha: 1, x: 0, y: 0, rotation: 0, scale: 1 });
        });

        return () => media.revert();
      } catch {
        failOpenRevealTargets(cards);
      }
    },
    { scope: stage },
  );

  return (
    <div ref={stage} aria-hidden="true" className="blog-hero-stage hidden lg:block">
      <div className="blog-hero-character">
        <Media
          src={heroCharacter}
          decorative
          aspect="intrinsic"
          sizes="cutout"
          fit="contain"
          tone="none"
          rounded="none"
          priority="eager"
          className="w-full"
        />
      </div>
      <span className="blog-hero-card blog-hero-card--one will-reveal">A</span>
      <span className="blog-hero-card blog-hero-card--two will-reveal">K</span>
      <span className="blog-hero-card blog-hero-card--three will-reveal">Q</span>
    </div>
  );
}
