"use client";

import { useRef } from "react";

import { Button } from "@/components/ui";
import { gsap, MOTION_QUERY, registerGsap, useGSAP } from "@/lib/motion/gsap";
import { duration, ease, stagger, travel } from "@/lib/motion/tokens";

/**
 * What replaces a form once it has been sent.
 *
 * A panel rather than a green bar above the fields, because a confirmation
 * sitting on top of a form still full of the text somebody just sent reads as
 * "not sent yet", and the second thing they do is press submit again.
 *
 * "Send another" reloads rather than clearing state by hand. The form is
 * uncontrolled and its defaults come from the server action's response, so a
 * reload is both the shortest way back to an empty form and the only one that
 * cannot leave a stale value behind.
 */
export function SentPanel({
  title,
  message,
  actionLabel,
}: {
  title: string;
  message: string;
  actionLabel: string;
}) {
  const scope = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const root = scope.current;
      if (!root) return;

      registerGsap();
      const media = gsap.matchMedia();

      media.add(MOTION_QUERY.ok, () => {
        // The panel arrives where the form was, so it enters rather than
        // appears. Reduced motion gets the same panel with no travel.
        const tween = gsap.from(root.children, {
          autoAlpha: 0,
          y: travel.base,
          duration: duration.reveal,
          ease: ease.entrance,
          stagger: stagger.base,
        });

        return () => tween.kill();
      });

      return () => media.revert();
    },
    { scope },
  );

  return (
    <div
      ref={scope}
      role="status"
      className="border-line bg-surface rounded-lg border p-8 shadow-sm sm:p-10"
    >
      <span
        aria-hidden
        className="bg-accent-tint text-accent-text grid h-12 w-12 place-items-center rounded-full text-xl"
      >
        ♠
      </span>

      <h3 className="text-h3 text-heading mt-6 font-semibold tracking-tighter">
        {title}
      </h3>

      <p className="text-muted mt-3 max-w-md text-lg">{message}</p>

      <Button
        variant="secondary"
        size="md"
        className="mt-7"
        onClick={() => window.location.reload()}
      >
        {actionLabel}
      </Button>
    </div>
  );
}
