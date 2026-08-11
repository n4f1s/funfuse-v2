"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";

import { primaryNav, site } from "@/config/site";
import { cn } from "@/lib/cn";

import { isActive } from "./site-nav";

/**
 * Mobile navigation.
 *
 * Built on the native `<dialog>` element with `showModal()`, which gives focus
 * trapping, inert background content, and Escape-to-close from the platform
 * rather than from a re-implementation that will be subtly wrong.
 *
 * Animated with CSS transitions, not GSAP: the panel can be toggled rapidly,
 * and transitions retarget from their current position while keyframes restart
 * from zero. GSAP is for choreography, not for open/close states.
 */

/** Matches the exit transition in globals.css (--duration-overlay, 320ms),
 *  trimmed so the element leaves the top layer as the panel lands. */
const EXIT_MS = 260;

export function MobileNav({ className }: { className?: string }) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const exitTimer = useRef(0);
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  const close = useCallback(() => {
    const dialog = dialogRef.current;
    if (!dialog?.open) return;
    setOpen(false);
    // Let the exit transition run before the element leaves the top layer.
    window.clearTimeout(exitTimer.current);
    exitTimer.current = window.setTimeout(() => dialog.close(), EXIT_MS);
  }, []);

  // Close on navigation. Without this the panel survives the route change and
  // covers the page the user just asked for.
  useEffect(() => close(), [pathname, close]);

  useEffect(() => () => window.clearTimeout(exitTimer.current), []);

  function openDialog() {
    window.clearTimeout(exitTimer.current);
    dialogRef.current?.showModal();
    setOpen(true);
  }

  return (
    <div className={className}>
      <button
        type="button"
        onClick={openDialog}
        aria-haspopup="dialog"
        aria-expanded={open}
        className={cn(
          "text-heading inline-flex h-10 w-10 items-center justify-center rounded-full",
          "transition-[transform,background-color] duration-[var(--duration-press)] ease-out",
          "hover:bg-surface-muted active:scale-[0.97]",
        )}
      >
        <span className="sr-only">Open menu</span>
        <MenuGlyph />
      </button>

      <dialog
        ref={dialogRef}
        data-open={open || undefined}
        aria-label="Site menu"
        onCancel={(event) => {
          event.preventDefault();
          close();
        }}
        onClick={(event) => {
          // Clicking the backdrop targets the dialog element itself.
          if (event.target === dialogRef.current) close();
        }}
        className="mobile-nav-dialog"
      >
        <div className="mobile-nav-panel">
          <div className="flex h-16 items-center justify-between">
            <span className="text-muted text-sm">Menu</span>
            <button
              type="button"
              onClick={close}
              className={cn(
                "text-heading inline-flex h-10 w-10 items-center justify-center rounded-full",
                "transition-[transform,background-color] duration-[var(--duration-press)] ease-out",
                "hover:bg-surface-muted active:scale-[0.97]",
              )}
            >
              <span className="sr-only">Close menu</span>
              <CloseGlyph />
            </button>
          </div>

          <nav aria-label="Primary" className="mt-4">
            <ul className="flex flex-col">
              {primaryNav.map((item) => (
                <li key={item.href} className="border-line border-b">
                  <Link
                    href={item.href}
                    aria-current={isActive(pathname, item) ? "page" : undefined}
                    className={cn(
                      "font-display block py-4 text-h3 tracking-tighter",
                      isActive(pathname, item) ? "text-accent-text" : "text-heading",
                    )}
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div className="mt-8 flex flex-col gap-1 text-sm">
            <Link href="/contact-us" className="text-heading py-2 font-medium">
              Contact us
            </Link>
            <a href={`mailto:${site.email}`} className="text-muted py-2">
              {site.email}
            </a>
          </div>
        </div>
      </dialog>
    </div>
  );
}

function MenuGlyph() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden>
      <path
        d="M3 6h14M3 13h14"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
      />
    </svg>
  );
}

function CloseGlyph() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden>
      <path
        d="M5 5l10 10M15 5L5 15"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
      />
    </svg>
  );
}
