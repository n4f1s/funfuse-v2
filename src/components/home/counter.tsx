"use client";

import { useRef } from "react";

import { gsap, MOTION_QUERY, registerGsap, useGSAP } from "@/lib/motion/gsap";
import { duration, ease } from "@/lib/motion/tokens";

/**
 * A figure that counts up when it arrives.
 *
 * Why it animates: the number is the message, and counting is the one motion
 * that says "this is a quantity" rather than "this is a heading". It runs once.
 *
 * The value is rendered on the server, so the correct figure is in the HTML
 * before any JavaScript runs. That covers no-JS, reduced motion, and anything
 * that reads the page rather than watching it. The tween only replaces the text
 * once it knows the element has not been seen yet.
 *
 * The unit sits in its own element rather than in the counted string: it is set
 * smaller than the digits, and keeping it out of the tween means the digits are
 * the only thing being rewritten sixty times a second.
 */
export function Counter({
  value,
  suffix = "",
  countDecimals = 0,
}: {
  value: number;
  suffix?: string;
  /**
   * Decimal places to show *while counting*. A figure like 3 has only four
   * integer states between zero and itself, so counting it whole reads as a
   * stutter. Counting it to one decimal is smooth and still lands on `value`.
   */
  countDecimals?: number;
}) {
  const node = useRef<HTMLSpanElement>(null);

  useGSAP(
    () => {
      registerGsap();

      const element = node.current;
      if (!element) return;

      const settled = `${value}`;
      const running = (n: number) =>
        countDecimals > 0 ? n.toFixed(countDecimals) : `${Math.round(n)}`;

      const media = gsap.matchMedia();

      media.add(MOTION_QUERY.ok, () => {
        // If the figure is already on screen the trigger fires in this frame,
        // so resetting the text is invisible. If it is not, the reset has to
        // happen now or the number would show its answer and then rewind to
        // zero the moment it scrolled into view.
        element.textContent = running(0);

        const count = { current: 0 };

        const tween = gsap.to(count, {
          current: value,
          duration: duration.reveal * 2,
          ease: ease.entrance,
          onUpdate: () => {
            element.textContent = running(count.current);
          },
          // A count that ends on "3.0" has not finished counting.
          onComplete: () => {
            element.textContent = settled;
          },
          scrollTrigger: { trigger: element, start: "top 88%", once: true },
        });

        return () => {
          tween.scrollTrigger?.kill();
          tween.kill();
          element.textContent = settled;
        };
      });

      return () => media.revert();
    },
    { scope: node, dependencies: [value, countDecimals] },
  );

  // `tabular` so the digits do not jostle the unit as the count runs.
  return (
    <>
      <span ref={node} className="tabular">
        {value}
      </span>
      {suffix ? (
        <span className="align-baseline text-[0.55em] tracking-tight">
          {suffix}
        </span>
      ) : null}
    </>
  );
}
