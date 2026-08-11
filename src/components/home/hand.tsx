"use client";

import { useCallback, useEffect, useRef, useState, type ReactNode } from "react";

import { Container } from "@/components/ui/container";
import { cn } from "@/lib/cn";

/**
 * The featured row: a real horizontal scroll container, not a pinned section.
 *
 * A pinned, scrubbed gallery holds the viewport hostage while it plays, and the
 * design system says motion here is "never blocking". This keeps the platform's
 * own scrolling instead: touch momentum, trackpad, shift-wheel, and the arrow
 * keys once the list is focused. Snap points do the framing.
 *
 * There is no scroll listener and no scroll-linked tween. An IntersectionObserver
 * rooted on the track reports which card is centred, which fires once per card
 * rather than once per frame, and that single index drives the readout, the
 * segment control and the disabled state of the arrows.
 */

export function Hand({
  children,
  label,
  count,
}: {
  children: ReactNode;
  /** Accessible name for the list. */
  label: string;
  count: number;
}) {
  const track = useRef<HTMLUListElement>(null);
  const [active, setActive] = useState(0);

  useEffect(() => {
    const element = track.current;
    if (!element) return;

    const cards = [...element.children] as HTMLElement[];

    // How much of each card is in the track right now. Two cards are usually
    // visible at once, so the readout has to be the *most* visible one rather
    // than whichever entry the observer happened to report last: taking the
    // last one makes a freshly loaded row announce itself as card 2 of 5.
    const ratios = new Array<number>(cards.length).fill(0);

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          const index = cards.indexOf(entry.target as HTMLElement);
          if (index !== -1) ratios[index] = entry.intersectionRatio;
        }

        let best = 0;
        for (let index = 1; index < ratios.length; index += 1) {
          // Strictly greater, so a tie keeps the earlier card.
          if (ratios[index] > ratios[best]) best = index;
        }
        setActive(best);
      },
      // Rooted on the track, so "visible" means visible in the row rather than
      // in the page. The steps are fine enough to tell a half-scrolled card
      // from a fully framed one.
      { root: element, threshold: [0, 0.25, 0.5, 0.75, 1] },
    );

    for (const card of cards) observer.observe(card);
    return () => observer.disconnect();
  }, [count]);

  const goTo = useCallback((index: number) => {
    const element = track.current;
    const card = element?.children[index] as HTMLElement | undefined;
    if (!element || !card) return;

    // scrollTo on the track, not scrollIntoView on the card: the latter also
    // scrolls the page vertically to bring the row into view.
    element.scrollTo({
      left: card.offsetLeft - (element.clientWidth - card.clientWidth) / 2,
      behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches
        ? "auto"
        : "smooth",
    });
  }, []);

  return (
    <>
      {/* `role="list"` because Tailwind's reset removes the list marker and
          Safari drops the list role with it, and this one carries a name and a
          tab stop that only make sense on a list. */}
      <ul
        ref={track}
        role="list"
        tabIndex={0}
        aria-label={label}
        className="hand-track gap-4 pt-2 pb-8 sm:gap-6"
      >
        {children}
      </ul>

      <Container className="flex items-center gap-5 sm:gap-8">
        <p className="text-faint tabular text-sm">
          <span className="text-heading font-medium">{active + 1}</span>
          <span className="px-1.5">/</span>
          {count}
        </p>

        {/* Segments rather than dots: they read as a position along a strip,
            and each one is a real control instead of a status light. */}
        <ul className="flex flex-1 items-center gap-1.5">
          {Array.from({ length: count }, (_, index) => (
            <li key={index} className="max-w-16 flex-1">
              <button
                type="button"
                onClick={() => goTo(index)}
                aria-label={`Show game ${index + 1} of ${count}`}
                aria-current={index === active ? "true" : undefined}
                className="group flex h-8 w-full items-center"
              >
                <span
                  className={cn(
                    "h-0.5 w-full rounded-full transition-colors duration-[var(--duration-hover)] ease-out",
                    index === active
                      ? "bg-accent"
                      : "bg-line-strong group-hover:bg-faint",
                  )}
                />
              </button>
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-2">
          <Arrow
            direction="previous"
            disabled={active === 0}
            onClick={() => goTo(active - 1)}
          />
          <Arrow
            direction="next"
            disabled={active === count - 1}
            onClick={() => goTo(active + 1)}
          />
        </div>
      </Container>
    </>
  );
}

function Arrow({
  direction,
  disabled,
  onClick,
}: {
  direction: "previous" | "next";
  disabled: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={cn(
        "border-line text-heading inline-flex h-10 w-10 items-center justify-center rounded-full border",
        "transition-[transform,background-color,border-color,opacity] duration-[var(--duration-press)] ease-out",
        "hover:border-line-strong hover:bg-surface-muted active:scale-[0.97]",
        "disabled:pointer-events-none disabled:opacity-40",
      )}
    >
      <span className="sr-only">
        {direction === "previous" ? "Previous game" : "Next game"}
      </span>
      {/* One chevron, mirrored. Kept inline rather than starting an icon
          folder; the moment a third control needs a glyph, the project takes
          the dependency named in AGENTS.md instead. */}
      <svg
        width="18"
        height="18"
        viewBox="0 0 18 18"
        fill="none"
        aria-hidden
        className={direction === "previous" ? "rotate-180" : undefined}
      >
        <path
          d="M6.5 3.5L12 9l-5.5 5.5"
          stroke="currentColor"
          strokeWidth="1.75"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </button>
  );
}
