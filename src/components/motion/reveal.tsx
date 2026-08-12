"use client";

import {
  useRef,
  type CSSProperties,
  type ElementType,
  type ReactNode,
} from "react";

import { cn } from "@/lib/cn";
import {
  failOpenRevealTargets,
  gsap,
  MOTION_QUERY,
  registerGsap,
  useGSAP,
} from "@/lib/motion/gsap";
import {
  duration,
  ease,
  stagger as staggerTokens,
  travel,
} from "@/lib/motion/tokens";

/**
 * Scroll entrance for a block, or for a group of siblings in reading order.
 *
 * This is the one scroll animation most sections should need. It exists so
 * "content arrives as you reach it" is a single tuned, reduced-motion-aware
 * implementation instead of a fresh ScrollTrigger written per section.
 *
 * Why it animates: hierarchy. Content resolves in reading order as the section
 * enters. It fires once — re-animating on every scroll-by turns the page into
 * a slideshow and gets old on the second pass.
 *
 * Anything richer (pinning, scrubbing, split text, parallax) gets its own
 * client leaf; do not grow this component into a motion framework.
 */

type RevealProps = {
  children: ReactNode;
  as?: ElementType;
  /** Stagger the direct children instead of animating the wrapper as one. */
  stagger?: boolean | number;
  /** Vertical travel in px. Keep it small — long distances read as cheap. */
  y?: keyof typeof travel | number;
  /** Seconds to wait after the trigger fires. */
  delay?: number;
  /** Viewport position that fires the animation (ScrollTrigger syntax). */
  start?: string;
  className?: string;
  /**
   * For layout values a class cannot express, such as a track count computed
   * from content. Never put animated properties here: GSAP owns transform and
   * opacity on this element.
   */
  style?: CSSProperties;
  /**
   * Pass `role="list"` whenever `as="ul"`. Tailwind's reset removes the list
   * marker, and Safari drops the list role along with it, so a `<ul>` that
   * carries real list content has to say so again.
   */
  role?: string;
};

export function Reveal({
  children,
  as: Tag = "div",
  stagger = false,
  y = "base",
  delay = 0,
  start = "top 85%",
  className,
  style,
  role,
}: RevealProps) {
  const scope = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const root = scope.current;
      if (!root) return;

      const targets: Element[] = stagger ? [...root.children] : [root];
      const distance = typeof y === "number" ? y : travel[y];
      try {
        registerGsap();

        const media = gsap.matchMedia();

        media.add(MOTION_QUERY.ok, () => {
          try {
            // CSS hides this target before paint. `fromTo()` immediately
            // establishes GSAP's autoAlpha/transform start state, so the
            // trigger can only transition hidden content into its final state.
            const tween = gsap.fromTo(
              targets,
              { autoAlpha: 0, y: distance },
              {
                autoAlpha: 1,
                y: 0,
                immediateRender: true,
                delay,
                duration: duration.reveal,
                ease: ease.entrance,
                stagger:
                  stagger === true
                    ? staggerTokens.base
                    : typeof stagger === "number"
                      ? stagger
                      : 0,
                scrollTrigger: { trigger: root, start, once: true },
                // A permanent will-change keeps a compositing layer alive forever.
                onStart: () => gsap.set(targets, { willChange: "transform, opacity" }),
                onComplete: () => gsap.set(targets, { clearProps: "willChange" }),
              },
            );

            return () => {
              tween.scrollTrigger?.kill();
              tween.kill();
            };
          } catch {
            failOpenRevealTargets(targets);
          }
        });

        // Reduced motion resolves the same CSS-hidden marker in the layout
        // effect, before it can be painted.
        media.add(MOTION_QUERY.reduced, () => {
          gsap.set(targets, {
            autoAlpha: 1,
            y: 0,
            clearProps: "willChange",
          });
        });

        return () => media.revert();
      } catch {
        failOpenRevealTargets(targets);
      }
    },
    { scope, dependencies: [stagger, y, delay, start] },
  );

  return (
    <Tag
      ref={scope}
      style={style}
      role={role}
      className={cn(stagger ? "reveal-stagger" : "will-reveal", className)}
    >
      {children}
    </Tag>
  );
}
