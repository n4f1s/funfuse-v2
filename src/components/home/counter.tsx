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
 */
export function Counter({
  value,
  suffix = "",
}: {
  value: number;
  suffix?: string;
}) {
  const node = useRef<HTMLSpanElement>(null);

  useGSAP(
    () => {
      registerGsap();

      const element = node.current;
      if (!element) return;

      const media = gsap.matchMedia();

      media.add(MOTION_QUERY.ok, () => {
        // If the figure is already on screen the trigger fires in this frame,
        // so resetting the text is invisible. If it is not, the reset has to
        // happen now or the number would show its answer and then rewind to
        // zero the moment it scrolled into view.
        element.textContent = `0${suffix}`;

        const count = { current: 0 };

        const tween = gsap.to(count, {
          current: value,
          duration: duration.reveal * 2,
          ease: ease.entrance,
          onUpdate: () => {
            element.textContent = `${Math.round(count.current)}${suffix}`;
          },
          scrollTrigger: { trigger: element, start: "top 88%", once: true },
        });

        return () => {
          tween.scrollTrigger?.kill();
          tween.kill();
          element.textContent = `${value}${suffix}`;
        };
      });

      return () => media.revert();
    },
    { scope: node, dependencies: [value, suffix] },
  );

  // `tabular` so the digits do not jostle the label as the count runs.
  return (
    <span ref={node} className="tabular">
      {value}
      {suffix}
    </span>
  );
}
