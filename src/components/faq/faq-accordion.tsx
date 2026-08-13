"use client";

import { useId, useState } from "react";

import type { FaqEntry } from "@/content/faq";
import { cn } from "@/lib/cn";

const SUITS = ["♠", "♥", "♦", "♣"] as const;

export function FaqAccordion({
  entries,
}: {
  entries: readonly FaqEntry[];
}) {
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const rootId = useId();

  return (
    <div className="space-y-3">
      {entries.map((entry, index) => {
        const open = openIndex === index;
        const panelId = `${rootId}-panel-${index}`;
        const buttonId = `${rootId}-button-${index}`;
        const suit = SUITS[index % SUITS.length];
        const redSuit = suit === "♥" || suit === "♦";

        return (
          <article
            key={entry.question}
            className={cn(
              "group overflow-hidden rounded-lg border bg-surface",
              "transition-[border-color,box-shadow,background-color] duration-[var(--duration-hover)]",
              open
                ? "border-accent/25 shadow-md"
                : "border-line shadow-xs hover:border-line-strong hover:shadow-sm",
            )}
          >
            <h2>
              <button
                id={buttonId}
                type="button"
                aria-expanded={open}
                aria-controls={panelId}
                onClick={() => setOpenIndex(open ? null : index)}
                className="flex w-full items-center gap-4 px-5 py-5 text-left sm:gap-5 sm:px-6 sm:py-6"
              >
                <span
                  aria-hidden="true"
                  className={cn(
                    "grid h-10 w-10 shrink-0 place-items-center rounded-md border text-lg shadow-xs sm:h-11 sm:w-11",
                    redSuit
                      ? "border-accent/15 bg-accent-tint text-accent"
                      : "border-line bg-surface-muted text-heading",
                  )}
                >
                  {suit}
                </span>

                <span className="min-w-0 flex-1 font-display text-[1.05rem] font-semibold leading-snug tracking-tight text-heading sm:text-xl">
                  {entry.question}
                </span>

                <span
                  aria-hidden="true"
                  className={cn(
                    "relative h-9 w-9 shrink-0 rounded-full border border-line bg-surface-muted",
                    "transition-[transform,background-color,border-color] duration-[var(--duration-hover)]",
                    open && "rotate-45 border-accent/20 bg-accent-tint",
                  )}
                >
                  <span className="absolute left-1/2 top-1/2 h-px w-3.5 -translate-x-1/2 -translate-y-1/2 bg-heading" />
                  <span className="absolute left-1/2 top-1/2 h-3.5 w-px -translate-x-1/2 -translate-y-1/2 bg-heading" />
                </span>
              </button>
            </h2>

            <div
              id={panelId}
              role="region"
              aria-labelledby={buttonId}
              aria-hidden={!open}
              className={cn(
                "grid transition-[grid-template-rows] duration-[var(--duration-overlay)] ease-[var(--ease-out)]",
                open ? "grid-rows-[1fr]" : "grid-rows-[0fr]",
              )}
            >
              <div className="overflow-hidden">
                <div
                  className={cn(
                    "border-t border-line/80 px-5 pb-6 pt-5 sm:px-[4.75rem] sm:pb-7 sm:pt-6",
                    "transition-opacity duration-[var(--duration-overlay)]",
                    open ? "opacity-100" : "opacity-0",
                  )}
                >
                  <p className="max-w-[44rem] text-[0.975rem] leading-7 text-body sm:text-base sm:leading-8">
                    {entry.answer}
                  </p>
                </div>
              </div>
            </div>
          </article>
        );
      })}
    </div>
  );
}
