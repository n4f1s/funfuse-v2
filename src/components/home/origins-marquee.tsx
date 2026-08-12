"use client";

import { useRef, type ReactNode } from "react";

import {
  gsap,
  MOTION_QUERY,
  registerGsap,
  ScrollTrigger,
  useGSAP,
} from "@/lib/motion/gsap";
import { ease } from "@/lib/motion/tokens";

/**
 * Two rows of names, drifting past each other, coupled to the scroll.
 *
 * Why it animates: the catalogue's reach is a list of places, and a list sits
 * still. Moving it turns eleven proper nouns into one continuous thing going
 * past, which is the point being made. It is also the only band on the page
 * that moves without being scrolled to, so it has to earn that: the rows run
 * slowly at rest and only come alive when the page itself is moving.
 *
 * The scroll coupling is the whole idea. Scroll speed feeds the rows' speed,
 * scroll direction flips theirs, and the block leans into the movement and
 * springs back when you stop. The band stops being decoration on the page and
 * starts behaving like part of it.
 *
 * Mechanics:
 *   - each row holds its content twice, so `xPercent: -50` lands exactly on
 *     the second copy. The wrap is invisible at any speed, in either
 *     direction, and no width is baked into the loop.
 *   - three jobs, three elements: the tracks take the loop, the wrapper takes
 *     the lean, and the row clips and masks. No two tweens share a property.
 *   - the rows are paused whenever the section is off screen, and
 *     `will-change` goes with them.
 *
 * `aria-hidden`, and deliberately so: every place name here is printed again
 * beside its games in the catalogue further down, so a screen reader that read
 * this would hear the same eleven words twice for no gain.
 */

/** Resting speed in pixels per second. Different per row, so the two never lock. */
const SPEED = { places: 46, titles: 62 };

/** How much scroll velocity buys. Higher numbers make the rows calmer. */
const BOOST_DIVISOR = 900;
const LEAN_DIVISOR = 420;

const MAX_BOOST = 5;
const MAX_LEAN = 7;

/** Seconds to answer a change in scroll speed, and to let go of one. */
const PICK_UP = 0.3;
const SETTLE = 1.1;

export function OriginsMarquee({
  places,
  titles,
}: {
  places: ReactNode;
  titles: ReactNode;
}) {
  const scope = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const root = scope.current;
      if (!root) return;

      try {
        registerGsap();

        const lean = root.querySelector<HTMLElement>("[data-lean]");
        const tracks = gsap.utils.toArray<HTMLElement>("[data-track]", root);
        if (!lean || !tracks.length) return;

        const media = gsap.matchMedia();

        media.add(MOTION_QUERY.ok, () => {
          const loops = tracks.map((track) => {
            const back = track.dataset.direction === "back";
            const speed = Number(track.dataset.speed) || SPEED.places;
            // Measured once. Only the tempo depends on it, never the wrap, so
            // a resize inside one breakpoint drifting a few percent off is not
            // worth re-measuring a 4000px track to correct.
            const copy = track.scrollWidth / 2;

            return gsap.fromTo(
              track,
              { xPercent: back ? -50 : 0 },
              {
                xPercent: back ? 0 : -50,
                duration: copy / speed,
                ease: ease.linear,
                repeat: -1,
                paused: true,
              },
            );
          });

          const leanTo = gsap.quickTo(lean, "skewX", {
            duration: 0.6,
            ease: ease.out,
          });

          // Quantised, so a scroll frame that has not changed the rows' tempo
          // does not build a tween to tell them so.
          let applied = 1;

          const drive = (value: number, duration: number) => {
            applied = value;
            gsap.to(loops, {
              timeScale: value,
              duration,
              ease: ease.out,
              overwrite: true,
            });
          };

          const running = (playing: boolean) => {
            for (const loop of loops) {
              if (playing) loop.play();
              else loop.pause();
            }

            // A track is a very wide layer. It is worth one while the row is
            // moving, and worth nothing at all while it is not.
            gsap.set(
              tracks,
              playing ? { willChange: "transform" } : { clearProps: "willChange" },
            );
          };

          const trigger = ScrollTrigger.create({
            trigger: root,
            start: "top bottom",
            end: "bottom top",
            onToggle: (self) => running(self.isActive),
            onUpdate: (self) => {
              const velocity = self.getVelocity();
              if (!velocity) return;

              const boost = gsap.utils.clamp(
                -MAX_BOOST,
                MAX_BOOST,
                Math.sign(velocity) * (1 + Math.abs(velocity) / BOOST_DIVISOR),
              );
              const stepped = Math.round(boost * 4) / 4;
              if (stepped !== applied) drive(stepped, PICK_UP);

              leanTo(
                gsap.utils.clamp(-MAX_LEAN, MAX_LEAN, -velocity / LEAN_DIVISOR),
              );
            },
          });

          // Back to a drift once the page settles. Deliberately much longer
          // than the pick up: the rows answer the scroll immediately and let
          // go of it slowly, which is what makes the coupling feel like weight
          // rather than like a switch.
          const settle = () => {
            drive(1, SETTLE);
            leanTo(0);
          };

          ScrollTrigger.addEventListener("scrollEnd", settle);
          running(trigger.isActive);

          return () => {
            ScrollTrigger.removeEventListener("scrollEnd", settle);
            trigger.kill();
            for (const loop of loops) loop.kill();
          };
        });

        // Reduced motion keeps the composition and drops the travel. The rows
        // are still two rivers of names cropped by the mask, they simply are
        // not going anywhere, and the offset stops them lining up into a grid.
        media.add(MOTION_QUERY.reduced, () => {
          gsap.set(tracks.slice(1), { xPercent: -17 });
        });

        return () => media.revert();
      } catch {
        // The rows are readable without any of this. Nothing to fail open.
      }
    },
    { scope },
  );

  return (
    <div ref={scope} aria-hidden className="relative">
      <div data-lean className="flex flex-col gap-1 md:gap-2">
        <Row>
          <div
            data-track
            data-speed={SPEED.places}
            className="flex w-max items-center"
          >
            <div className="flex shrink-0 items-center">{places}</div>
            <div className="flex shrink-0 items-center">{places}</div>
          </div>
        </Row>

        <Row>
          <div
            data-track
            data-direction="back"
            data-speed={SPEED.titles}
            className="flex w-max items-center"
          >
            <div className="flex shrink-0 items-center">{titles}</div>
            <div className="flex shrink-0 items-center">{titles}</div>
          </div>
        </Row>
      </div>
    </div>
  );
}

/**
 * One clipped row. The mask is what keeps the band from looking like a strip
 * of text with both ends chopped off: the names arrive out of the page edge
 * and leave through it.
 */
function Row({ children }: { children: ReactNode }) {
  return (
    // The padding is load bearing. `overflow` clips to the padding box, and
    // the display face is set at a line height tighter than its own em box, so
    // without this the descender of every p and g is cut off in a straight
    // line. The mask only fades the ends, so the extra height costs nothing.
    <div className="overflow-hidden py-2 md:py-3 [mask-image:linear-gradient(to_right,transparent,black_7%,black_93%,transparent)]">
      {children}
    </div>
  );
}
