"use client";

import { useRef, type ReactNode } from "react";

import { gsap, MOTION_QUERY, registerGsap, useGSAP } from "@/lib/motion/gsap";
import {
  duration,
  ease,
  stagger as staggerTokens,
  travel,
} from "@/lib/motion/tokens";

/**
 * The open roles, as a tab list.
 *
 * Why it exists: three roles printed in full is roughly forty bullet points
 * stacked down the page, and nobody reads their way to the one they came for.
 * A rail of titles beside one open role is the same content at a density a
 * person can scan.
 *
 * **No height is ever animated.** The panels are stacked in a single grid cell
 * (see `.role-stack` in globals.css), so the container is always as tall as the
 * longest role and switching is a crossfade. Nothing below this section moves
 * when a tab is pressed, and the only properties in flight are transform and
 * opacity.
 *
 * Panels arrive as `children` from the Server Component, so the requirement
 * lists are in the HTML for a crawler and only this behaviour ships to the
 * browser. Without JavaScript the rail stands down and every role prints in
 * full — again, from globals.css, because the fallback has to work when the
 * failed thing is this file.
 *
 * The rail also answers the hash, which is how a role pill in the hero opens
 * the role it names.
 */

export type Role = { id: string; title: string };

export function RoleSwitcher({
  roles,
  children,
}: {
  roles: readonly Role[];
  children: ReactNode;
}) {
  const scope = useRef<HTMLDivElement>(null);
  /** Survives a matchMedia re-run, so a resize cannot reopen the first role. */
  const active = useRef(0);

  useGSAP(
    () => {
      const root = scope.current;
      if (!root) return;

      registerGsap();

      const tabs = gsap.utils.toArray<HTMLButtonElement>("[data-role-tab]", root);
      const panels = gsap.utils.toArray<HTMLElement>("[data-role-panel]", root);
      if (!tabs.length || tabs.length !== panels.length) return;

      // The server marks the first panel open and leaves the rest to CSS. Only
      // once this runs can the closed ones be taken out of the tab order.
      panels.forEach((panel, index) => {
        panel.inert = index !== active.current;
      });

      const media = gsap.matchMedia();

      // The object form, so the callback runs in both motion states rather than
      // only the one that matches. The tabs have to work either way; `ok` only
      // decides whether the swap is animated or instant.
      media.add({ ok: MOTION_QUERY.ok }, (context) => {
        const { ok } = context.conditions as { ok: boolean };

        const show = (next: number, withMotion: boolean) => {
          const previous = active.current;
          if (next === previous || !panels[next]) return;
          active.current = next;

          tabs.forEach((tab, index) => {
            const on = index === next;
            tab.setAttribute("aria-selected", String(on));
            tab.dataset.active = String(on);
            tab.tabIndex = on ? 0 : -1;
          });

          const outgoing = panels[previous];
          const incoming = panels[next];

          panels.forEach((panel, index) => {
            const on = index === next;
            panel.dataset.active = String(on);
            panel.inert = !on;
          });

          const rows = gsap.utils.toArray<HTMLElement>(
            "[data-role-row]",
            incoming,
          );

          gsap.killTweensOf([outgoing, incoming, ...rows]);

          if (!withMotion || !ok) {
            gsap.set(outgoing, { autoAlpha: 0 });
            gsap.set(incoming, { autoAlpha: 1 });
            gsap.set(rows, { autoAlpha: 1, y: 0 });
            return;
          }

          // The incoming panel is only made visible by the tween that follows,
          // so anything that throws in here would leave the selected role
          // hidden with no way back. Fail open onto the finished state.
          try {
            gsap.to(outgoing, {
              autoAlpha: 0,
              duration: duration.popover,
              ease: ease.out,
            });

            gsap.fromTo(
              incoming,
              { autoAlpha: 0 },
              { autoAlpha: 1, duration: duration.popover, ease: ease.out },
            );

            // The rows arrive in reading order behind the crossfade, so a
            // switch reads as a page of a role turning rather than as two
            // panels swapping places.
            gsap.fromTo(
              rows,
              { autoAlpha: 0, y: travel.sm },
              {
                autoAlpha: 1,
                y: 0,
                delay: 0.05,
                duration: duration.reveal * 0.6,
                ease: ease.entrance,
                stagger: staggerTokens.tight,
                onStart: () =>
                  gsap.set(rows, { willChange: "transform, opacity" }),
                onComplete: () => gsap.set(rows, { clearProps: "willChange" }),
              },
            );
          } catch {
            outgoing.style.visibility = "hidden";
            outgoing.style.opacity = "0";
            incoming.style.visibility = "visible";
            incoming.style.opacity = "1";
            for (const row of rows) {
              row.style.visibility = "visible";
              row.style.opacity = "1";
              row.style.transform = "none";
            }
          }
        };

        const onClick = (event: Event) => {
          const index = tabs.indexOf(event.currentTarget as HTMLButtonElement);
          if (index >= 0) show(index, true);
        };

        // Automatic activation, which is the default for a tab list: moving the
        // focus moves the panel. There are three roles and no cost to opening
        // one, so making the user press twice would be ceremony.
        const onKeyDown = (event: KeyboardEvent) => {
          const current = tabs.indexOf(event.target as HTMLButtonElement);
          if (current < 0) return;

          const step =
            event.key === "ArrowDown" || event.key === "ArrowRight"
              ? 1
              : event.key === "ArrowUp" || event.key === "ArrowLeft"
                ? -1
                : 0;

          let next = current;
          if (step !== 0) {
            next = (current + step + tabs.length) % tabs.length;
          } else if (event.key === "Home") {
            next = 0;
          } else if (event.key === "End") {
            next = tabs.length - 1;
          } else {
            return;
          }

          event.preventDefault();
          show(next, true);
          tabs[next]?.focus();
        };

        /** A role pill in the hero links to a tab id. Open what it names. */
        const fromHash = (withMotion: boolean) => {
          const id = window.location.hash.slice(1);
          if (!id) return;

          const index = tabs.findIndex((tab) => tab.id === id);
          if (index >= 0) show(index, withMotion);
        };

        const onHashChange = () => fromHash(true);

        for (const tab of tabs) {
          tab.addEventListener("click", onClick);
          tab.addEventListener("keydown", onKeyDown);
        }
        window.addEventListener("hashchange", onHashChange);

        fromHash(false);

        return () => {
          for (const tab of tabs) {
            tab.removeEventListener("click", onClick);
            tab.removeEventListener("keydown", onKeyDown);
          }
          window.removeEventListener("hashchange", onHashChange);
        };
      });

      return () => media.revert();
    },
    { scope },
  );

  return (
    <div ref={scope} className="lg:grid lg:grid-cols-12 lg:gap-x-8">
      <div className="role-rail lg:col-span-5">
        <div
          role="tablist"
          aria-labelledby="positions-heading"
          aria-orientation="vertical"
          className="border-line flex flex-col border-b"
        >
          {roles.map((role, index) => (
            <button
              key={role.id}
              id={role.id}
              type="button"
              role="tab"
              data-role-tab
              data-active={index === 0}
              aria-selected={index === 0}
              aria-controls={`${role.id}-panel`}
              tabIndex={index === 0 ? 0 : -1}
              className="group border-line relative block w-full border-t py-5 pl-6 text-left"
            >
              {/* The one mark that says which role is open. It grows from the
                  middle rather than sliding between rows: a measured indicator
                  would have to be re-measured on every resize and reflow. */}
              <span
                aria-hidden
                className="bg-accent duration-[var(--duration-hover)] group-data-[active=true]:scale-y-100 absolute top-1/2 left-0 h-10 w-[3px] origin-center -translate-y-1/2 scale-y-0 rounded-full transition-transform ease-out"
              />
              <span className="font-display text-h3 text-faint group-hover:text-heading group-data-[active=true]:text-heading duration-[var(--duration-hover)] block font-semibold tracking-tighter transition-colors ease-out">
                {role.title}
              </span>
            </button>
          ))}
        </div>
      </div>

      <div className="role-stack mt-8 lg:col-span-7 lg:mt-0">{children}</div>
    </div>
  );
}
