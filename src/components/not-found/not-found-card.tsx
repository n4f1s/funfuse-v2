"use client";

import { useRef } from "react";

import { cn } from "@/lib/cn";
import { gsap, MOTION_QUERY, registerGsap, useGSAP } from "@/lib/motion/gsap";
import { ease } from "@/lib/motion/tokens";

/**
 * The 404 prop: a dealt card that turned out to be the wrong one.
 *
 * Why it animates: the catalogue is card games, so a dead end on this site is
 * a card, not a broken robot. The float is what makes it read as an object
 * held in space rather than a rectangle printed on the page, and it is the
 * only thing on a page whose whole message is "there is nothing here".
 *
 * Four elements, four owners, so no two tweens ever write one property:
 *   - `.notfound-shadow` sits outside every transform and stays on the ground,
 *   - `[data-tilt]` takes the perspective lean (rotationX / rotationY),
 *   - `.notfound-lean` holds the resting angle as a plain CSS `rotate`,
 *   - `[data-float]` and `[data-drift]` take the idle bob of each card.
 *
 * The resting pose is in the server HTML, so a visitor with reduced motion, no
 * JavaScript or a failed chunk still gets a finished composition.
 */
export function NotFoundCard({ className }: { className?: string }) {
  const stage = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      registerGsap();

      const root = stage.current;
      if (!root) return;

      const float = root.querySelector<HTMLElement>("[data-float]");
      const drift = root.querySelector<HTMLElement>("[data-drift]");
      const tilt = root.querySelector<HTMLElement>("[data-tilt]");
      if (!float || !drift || !tilt) return;

      const media = gsap.matchMedia();

      media.add(
        {
          ok: MOTION_QUERY.ok,
          // The 3D lean is desktop-pointer only. Perspective on a subtree is
          // a compositor layer for an effect a phone shows at a third of the
          // size, and the float already carries the idea there.
          pointer: "(hover: hover) and (pointer: fine)",
        },
        (context) => {
          const { ok, pointer } = context.conditions as {
            ok: boolean;
            pointer: boolean;
          };

          // Reduced motion: the card is already dealt and already leaning.
          // A static composition is the correct end state.
          if (!ok) return;

          // Each leg is symmetric around the resting pose, and the three
          // durations are deliberately coprime-ish so the loop never lands on
          // an obvious beat.
          const tweens = [
            gsap.fromTo(
              float,
              { y: 9, rotation: -2 },
              {
                y: -9,
                rotation: 2,
                duration: 4.4,
                ease: ease.loop,
                repeat: -1,
                yoyo: true,
              },
            ),
            gsap.fromTo(
              drift,
              { y: -5, rotation: 1.4 },
              {
                y: 5,
                rotation: -1.4,
                duration: 5.7,
                ease: ease.loop,
                repeat: -1,
                yoyo: true,
              },
            ),
          ];

          if (pointer) {
            tweens.push(
              gsap.fromTo(
                tilt,
                { rotationX: -4, rotationY: 6 },
                {
                  rotationX: 4,
                  rotationY: -6,
                  duration: 7.1,
                  ease: ease.loop,
                  repeat: -1,
                  yoyo: true,
                },
              ),
            );
          }

          return () => {
            for (const tween of tweens) tween.kill();
          };
        },
      );

      return () => media.revert();
    },
    { scope: stage },
  );

  return (
    // Decorative in full: every word on this card is already in the copy
    // beside it, and a screen reader reading out four suit glyphs is noise.
    <div ref={stage} aria-hidden className={cn("notfound-stage", className)}>
      <span className="notfound-shadow" />
      <div data-tilt className="notfound-tilt">
        <div className="notfound-lean">
          <div className="notfound-back">
            <div data-drift className="notfound-drift">
              <span className="notfound-back-face" />
            </div>
          </div>
          <div data-float className="notfound-float">
            <div className="notfound-face">
              <span className="notfound-glow" />
              <span className="notfound-frame" />
              <span className="notfound-index notfound-index--top">
                <span>404</span>
                <span>♠</span>
              </span>
              <div className="notfound-body">
                <span className="notfound-number">404</span>
                <span className="notfound-label">Page not found</span>
                <span className="notfound-pips">
                  <span>♠</span>
                  <span data-red>♥</span>
                  <span data-red>♦</span>
                  <span>♣</span>
                </span>
              </div>
              <span className="notfound-index notfound-index--bottom">
                <span>404</span>
                <span>♠</span>
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
