"use client";

import { type MouseEvent, useEffect, useState } from "react";

import { cn } from "@/lib/cn";

export type TocItem = { id: string; text: string; level: 2 | 3 };

/**
 * The article contents, with the current section marked.
 *
 * The headings live inside the article's trusted HTML, so this reads them back
 * out of the DOM by id rather than expecting a React tree it does not own.
 *
 * `IntersectionObserver`, not a ScrollTrigger: the only question here is which
 * headings are in the reading band, which is exactly what an observer answers,
 * and it costs nothing on the scroll thread. The band stops below the sticky
 * header and ends well above the fold, so the marker moves when a section
 * takes over the screen rather than when its heading grazes the bottom edge.
 */
export function BlogTableOfContents({
  items,
  target,
}: {
  items: readonly TocItem[];
  target: string;
}) {
  const active = useActiveHeading(items, target);
  const activeItem = items.find((item) => item.id === active);

  return (
    <>
      <aside className="order-first sticky top-[calc(var(--header-height)+0.75rem)] z-20 -mx-1 lg:hidden">
        <details className="blog-toc-mobile group rounded-lg border border-line bg-surface">
          <summary className="flex min-h-14 cursor-pointer items-center justify-between gap-4 px-5 py-3 text-left text-heading">
            <span className="min-w-0">
              <span className="block text-2xs font-semibold uppercase tracking-[0.13em] text-faint">
                On this page
              </span>
              <span className="mt-0.5 block truncate text-sm font-medium">
                {activeItem?.text ?? `${items.length} sections`}
              </span>
            </span>
            <span
              aria-hidden="true"
              className="shrink-0 text-muted transition-transform duration-[var(--duration-popover)] ease-out group-open:rotate-180"
            >
              &#9662;
            </span>
          </summary>
          <div className="max-h-[min(52dvh,22rem)] overflow-y-auto overscroll-contain px-5 pb-5">
            <TocList items={items} active={active} onNavigate={closeMobileToc} />
          </div>
        </details>
      </aside>

      <aside className="hidden self-start lg:sticky lg:top-[calc(var(--header-height)+2.5rem)] lg:block">
        <nav
          aria-label="On this page"
          className="max-h-[calc(100dvh-var(--header-height)-5rem)] overflow-y-auto pr-2"
        >
          <p className="text-2xs font-semibold uppercase tracking-[0.13em] text-faint">
            On this page
          </p>
          <TocList items={items} active={active} className="mt-4" />
        </nav>
      </aside>
    </>
  );
}

function TocList({
  items,
  active,
  className,
  onNavigate,
}: {
  items: readonly TocItem[];
  active: string | null;
  className?: string;
  onNavigate?: (event: MouseEvent<HTMLAnchorElement>) => void;
}) {
  return (
    <ol className={cn("blog-toc-list", className)}>
      {items.map((item) => {
        const isActive = item.id === active;

        return (
          <li key={item.id} className={item.level === 3 ? "pl-4" : ""}>
            <a
              href={`#${item.id}`}
              aria-current={isActive ? "true" : undefined}
              className={cn(
                "blog-toc-link",
                isActive ? "blog-toc-link--active" : "",
              )}
              onClick={onNavigate}
            >
              {item.text}
            </a>
          </li>
        );
      })}
    </ol>
  );
}

function closeMobileToc(event: MouseEvent<HTMLAnchorElement>) {
  event.currentTarget.closest("details")?.removeAttribute("open");
}

function useActiveHeading(items: readonly TocItem[], target: string) {
  const [active, setActive] = useState<string | null>(null);

  useEffect(() => {
    if (items.length === 0) return;

    const root = document.querySelector(target);
    if (!root) return;

    const headings = items
      .map((item) => root.querySelector<HTMLElement>(`#${CSS.escape(item.id)}`))
      .filter((heading): heading is HTMLElement => heading !== null);

    if (headings.length === 0) return;

    const seen = new Map<string, boolean>();

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          seen.set(entry.target.id, entry.isIntersecting);
        }

        // First heading still in the band wins. Falling back to the last one
        // already passed keeps something marked while a long section scrolls
        // by with no heading on screen at all.
        const inBand = headings.find((heading) => seen.get(heading.id));
        if (inBand) {
          setActive(inBand.id);
          return;
        }

        const passed = [...headings]
          .reverse()
          .find((heading) => heading.getBoundingClientRect().top < 0);

        setActive(passed?.id ?? null);
      },
      { rootMargin: "-20% 0px -65% 0px", threshold: 0 },
    );

    headings.forEach((heading) => observer.observe(heading));

    return () => observer.disconnect();
  }, [items, target]);

  return active;
}
