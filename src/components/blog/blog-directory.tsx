"use client";

import { Fragment, useMemo, useRef, useState, type ReactNode } from "react";

import { cn } from "@/lib/cn";
import {
  failOpenRevealTargets,
  gsap,
  MOTION_QUERY,
  registerGsap,
  ScrollTrigger,
  useGSAP,
} from "@/lib/motion/gsap";
import { duration, ease, stagger, travel } from "@/lib/motion/tokens";

/**
 * The guide index: topic filter plus the card grid.
 *
 * **Why the cards arrive as `ReactNode`.** Only the filter state and the
 * entrance choreography need the client. The cards themselves — `<Media>`,
 * static imports, reading times computed from the article HTML — are rendered
 * on the server and handed over as opaque nodes, so nothing about the card
 * markup ships in the bundle and every guide is still in the initial HTML for
 * crawlers.
 *
 * Why it animates: state change. Re-tweening the grid when the topic changes
 * is the only signal that a filter did something, because the heading and the
 * chips stay put. Off-screen cards keep their normal scroll entrance, so one
 * `ScrollTrigger.batch` covers both cases: anything already in the viewport
 * fires the moment the batch is built, anything below waits for the scroll.
 */

const ALL = "All guides";

export type BlogDirectoryItem = {
  slug: string;
  categories: readonly string[];
  card: ReactNode;
};

export function BlogDirectory({
  items,
  categories,
}: {
  items: readonly BlogDirectoryItem[];
  categories: readonly string[];
}) {
  const [active, setActive] = useState<string>(ALL);
  const grid = useRef<HTMLDivElement>(null);

  const filters = useMemo(
    () => [
      { label: ALL, count: items.length },
      ...categories.map((category) => ({
        label: category,
        count: items.filter((item) => item.categories.includes(category)).length,
      })),
    ],
    [items, categories],
  );

  const visible = useMemo(
    () =>
      active === ALL
        ? items
        : items.filter((item) => item.categories.includes(active)),
    [items, active],
  );

  useGSAP(
    () => {
      const root = grid.current;
      if (!root) return;

      const cards = [...root.children];
      if (cards.length === 0) return;

      try {
        registerGsap();

        const media = gsap.matchMedia();

        media.add(MOTION_QUERY.ok, () => {
          try {
            gsap.set(cards, { autoAlpha: 0, y: travel.base });

            const triggers = ScrollTrigger.batch(cards, {
              start: "top 92%",
              once: true,
              onEnter: (batch) =>
                gsap.to(batch, {
                  autoAlpha: 1,
                  y: 0,
                  duration: duration.reveal,
                  ease: ease.entrance,
                  stagger: stagger.tight,
                  overwrite: true,
                  onStart: () =>
                    gsap.set(batch, { willChange: "transform, opacity" }),
                  onComplete: () => gsap.set(batch, { clearProps: "willChange" }),
                }),
            });

            return () => triggers.forEach((trigger) => trigger.kill());
          } catch {
            failOpenRevealTargets(cards);
          }
        });

        media.add(MOTION_QUERY.reduced, () => {
          gsap.set(cards, { autoAlpha: 1, y: 0, clearProps: "willChange" });
        });

        return () => media.revert();
      } catch {
        failOpenRevealTargets(cards);
      }
    },
    { scope: grid, dependencies: [active] },
  );

  return (
    <>
      <div className="flex flex-wrap items-center gap-2.5">
        {filters.map((filter) => {
          const isActive = filter.label === active;

          return (
            <button
              key={filter.label}
              type="button"
              aria-pressed={isActive}
              onClick={() => setActive(filter.label)}
              className={cn(
                "inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-medium",
                "transition-[background-color,border-color,color,transform] duration-[var(--duration-press)] ease-out",
                "active:scale-[0.97]",
                isActive
                  ? "border-accent-strong bg-accent-strong text-inverse shadow-xs"
                  : "border-line bg-surface text-muted hover:border-line-strong hover:text-heading",
              )}
            >
              {filter.label}
              <span className={cn("text-2xs tabular-nums", isActive ? "opacity-75" : "text-faint")}>
                {filter.count}
              </span>
            </button>
          );
        })}
      </div>

      <p aria-live="polite" className="sr-only">
        Showing {visible.length} of {items.length} guides.
      </p>

      <div
        ref={grid}
        className="reveal-stagger mt-12 grid gap-x-8 gap-y-14 sm:grid-cols-2 lg:mt-14 lg:grid-cols-3 lg:gap-x-10"
      >
        {visible.map((item) => (
          <Fragment key={item.slug}>{item.card}</Fragment>
        ))}
      </div>
    </>
  );
}
