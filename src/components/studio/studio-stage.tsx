"use client";

import { useRef, type ReactNode } from "react";

import {
  failOpenRevealTargets,
  gsap,
  MOTION_QUERY,
  registerGsap,
  useGSAP,
} from "@/lib/motion/gsap";
import { duration, ease } from "@/lib/motion/tokens";

/**
 * The Studio hero stage: one studio, drawn twice.
 *
 * Two plates of the same room sit in exactly the same box — a pencil version
 * underneath and the colour version on top of it — and the colour plate is
 * clipped to a marker stroke that follows the pointer. Moving across the
 * artwork paints the studio into colour, which is the page's whole argument
 * about how the work goes: it is a sketch on a table before it is a game.
 *
 * Why this shape and not a circle. A circular spotlight is a lens, and a lens
 * says "look closer". This is a nib: a lumpy hand-drawn blob, five of them at
 * increasing lag, so a fast sweep smears into a stroke with a tapered tail and
 * a slow one settles into a single dab. The elongation is not faked from a
 * velocity number, it is what a trail of lagging shapes does. It says
 * "somebody drew this", which is the correct sentence for this page.
 *
 * Why it never holds still. The five nibs sit at slightly different offsets and
 * each one turns and breathes on its own clock: two sine pulses per shape, on
 * separate axes and out of phase with each other and with every other shape.
 * The silhouette is the union of all five, so a set of small independent
 * wobbles compounds into an outline that is always moving and never repeats a
 * shape. That is the whole trick — it is liquid because nothing in it is
 * synchronised, not because a path is being redrawn point by point.
 *
 * That last part matters for the frame budget: morphing by rewriting `d` on
 * five paths every tick means five path re-parses per frame. Transforms on a
 * fixed path do not, and they compose with the pointer tweens instead of
 * fighting them. The ticker only runs while there is something on screen, and
 * this whole branch is desktop-only.
 *
 * The registration rule: the two plates are the same `<Media>` geometry in one
 * box, and nothing here ever transforms either of them. Only the clip moves.
 * A parallax on one layer would be one pixel of drift away from looking like a
 * printing error.
 *
 * Three audiences, three deliberate experiences:
 *   - fine pointer, motion allowed — the reveal, plus one unprompted sweep
 *     across the tabletop about a second in, because a reveal nobody knows is
 *     there is a reveal that does not exist.
 *   - touch or any coarse pointer — no pointer to follow, so the colour blooms
 *     out of the tabletop once and stays. The story lands, nothing is left
 *     hanging.
 *   - reduced motion — the colour plate is simply there, faded in. A fade is a
 *     colour change, which reduced motion keeps; travel is what it removes.
 *
 * Nothing paints until the colour plate has actually loaded. A reveal over a
 * half-decoded image shows the loading surface rather than the studio.
 */

const CLIP_ID = "studio-brush-clip";

/**
 * Two nib shapes, authored around the origin so `svgOrigin: "0 0"` rotates and
 * scales them about their own middle and `x`/`y` place that middle on the
 * pointer. Roughly 124 units across, which is what `NIB_UNITS` divides by.
 * They are deliberately lopsided: a symmetrical blob reads as a shape, an
 * uneven one reads as ink.
 */
const NIB = [
  "M -62 -4 C -58 -22, -40 -34, -18 -34 C 2 -34, 18 -40, 38 -34 C 56 -29, 64 -14, 60 2 C 56 18, 38 30, 16 32 C -6 34, -30 30, -46 20 C -58 12, -64 6, -62 -4 Z",
  "M -60 2 C -64 -14, -48 -30, -26 -32 C -4 -34, 14 -28, 34 -32 C 54 -36, 66 -20, 62 -2 C 58 14, 42 26, 20 30 C 0 34, -22 32, -40 24 C -54 18, -58 12, -60 2 Z",
] as const;

/**
 * The trail, front to back.
 *
 *   follow   seconds this shape takes to reach the pointer. The spread between
 *            the first and the last is the length of the stroke at any speed.
 *   scale    sizes fall away toward the tail, because a marker lifts off the
 *            page rather than stopping dead.
 *   dx, dy   a resting offset in nib units, so a stationary pointer leaves a
 *            lopsided cluster rather than five blobs stacked on one point.
 *   spin     degrees per second. Slow, and no two share a direction or a rate.
 *   pulse*   radians per second for the breathing on each axis. Deliberately
 *            not multiples of each other: any common factor and the shape
 *            starts repeating on a loop the eye can hear.
 *   phase    where each shape is in its own cycle at time zero.
 */
const TRAIL = [
  {
    nib: 0,
    scale: 1,
    rotate: -6,
    follow: 0.16,
    dx: 0,
    dy: 0,
    spin: 7,
    pulseX: 1.7,
    pulseY: 2.3,
    phase: 0,
  },
  {
    nib: 1,
    scale: 0.94,
    rotate: 11,
    follow: 0.26,
    dx: -9,
    dy: -6,
    spin: -9,
    pulseX: 2.1,
    pulseY: 1.5,
    phase: 1.2,
  },
  {
    nib: 0,
    scale: 0.84,
    rotate: -16,
    follow: 0.4,
    dx: 11,
    dy: 7,
    spin: 6,
    pulseX: 1.3,
    pulseY: 2.7,
    phase: 2.4,
  },
  {
    nib: 1,
    scale: 0.7,
    rotate: 5,
    follow: 0.58,
    dx: -14,
    dy: 9,
    spin: -12,
    pulseX: 2.5,
    pulseY: 1.9,
    phase: 3.6,
  },
  {
    nib: 0,
    scale: 0.54,
    rotate: -9,
    follow: 0.8,
    dx: 13,
    dy: -10,
    spin: 10,
    pulseX: 1.9,
    pulseY: 3.1,
    phase: 4.8,
  },
] as const;

/** How far each shape swells and shrinks, as a share of its own size. */
const PULSE = { x: 0.18, y: 0.22 } as const;

/** Width of the nib artwork in its own units. */
const NIB_UNITS = 124;

/**
 * Size of the leading nib, as a share of the stage. Whichever of the two is
 * smaller wins: roughly a fat marker on a laptop, and still a marker rather
 * than a wash on a monitor twice as wide as it is tall.
 */
const NIB_WIDTH = 0.3;
const NIB_HEIGHT = 0.62;

/** Enough scale for one nib to cover the whole box, corners included. */
const FLOOD = 22;

/** Where the colour lives: the tabletop, not the empty upper third. */
const TABLE_Y = 0.74;

export function StudioStage({
  base,
  paint,
  className,
}: {
  /** The pencil plate. Painted immediately — this is the route's LCP element. */
  base: ReactNode;
  /** The colour plate. Same box, same geometry, never transformed. */
  paint: ReactNode;
  className?: string;
}) {
  const stage = useRef<HTMLDivElement>(null);
  const layer = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const stageEl = stage.current;
      const layerEl = layer.current;
      if (!stageEl || !layerEl) return;

      const nibs = gsap.utils.toArray<SVGPathElement>("[data-nib]", stageEl);
      const image = layerEl.querySelector("img");
      if (nibs.length !== TRAIL.length || !image) return;

      try {
        registerGsap();

        const media = gsap.matchMedia();

        media.add(
          {
            ok: MOTION_QUERY.ok,
            // The reveal is a pointer affordance. On touch a tap reports as a
            // hover, so this is gated rather than scaled down, and the coarse
            // branch below gets its own ending instead of a dead interaction.
            pointer: "(hover: hover) and (pointer: fine)",
          },
          (context) => {
            const { ok, pointer } = context.conditions as {
              ok: boolean;
              pointer: boolean;
            };

            const cleanups: (() => void)[] = [];

            gsap.set(nibs, {
              svgOrigin: "0 0",
              rotation: (index: number) => TRAIL[index]?.rotate ?? 0,
              scale: 0,
            });

            /**
             * Runs `start` once the colour plate is on screen. `complete` is
             * already true for a cached plate, which is the common case on a
             * second visit and would otherwise wait for a `load` that never
             * fires again.
             */
            const whenPainted = (start: () => void) => {
              if (image.complete && image.naturalWidth > 0) {
                start();
                return;
              }
              image.addEventListener("load", start, { once: true });
              cleanups.push(() => image.removeEventListener("load", start));
            };

            if (!ok) {
              // Reduced motion. No stroke, no travel, no invitation: the
              // studio is in colour and the page is finished.
              whenPainted(() =>
                gsap.to(layerEl, {
                  autoAlpha: 1,
                  duration: duration.overlay,
                  ease: ease.out,
                }),
              );

              return () => {
                for (const cleanup of cleanups) cleanup();
              };
            }

            if (!pointer) {
              // Coarse pointer. Colour blooms out along the tabletop once and
              // stays, so a phone gets the same idea without an interaction it
              // has no way to perform. The clip is dropped at the end rather
              // than left holding a shape 22 times the size of the stage.
              whenPainted(() => {
                const box = stageEl.getBoundingClientRect();

                gsap.set(nibs, {
                  x: (index: number) => box.width * (0.2 + index * 0.15),
                  y: box.height * TABLE_Y,
                });
                gsap.set(layerEl, {
                  clipPath: `url(#${CLIP_ID})`,
                  autoAlpha: 1,
                });

                gsap.to(nibs, {
                  scale: FLOOD,
                  duration: 1.1,
                  ease: ease.entrance,
                  stagger: 0.05,
                  onComplete: () =>
                    gsap.set(layerEl, { clipPath: "none" }),
                });
              });

              return () => {
                for (const cleanup of cleanups) cleanup();
              };
            }

            // ---- Fine pointer: the reveal ---------------------------------

            // `quickTo` writes straight to each nib with its own
            // interpolation: no React state, no rAF loop of ours, and a
            // retarget rather than a restart on every move. The pointer
            // handler does one layout read and then only writes.
            const moveX = nibs.map((nib, index) =>
              gsap.quickTo(nib, "x", {
                duration: TRAIL[index]?.follow ?? 0.3,
                ease: ease.out,
              }),
            );
            const moveY = nibs.map((nib, index) =>
              gsap.quickTo(nib, "y", {
                duration: TRAIL[index]?.follow ?? 0.3,
                ease: ease.out,
              }),
            );

            /**
             * The size the nibs are drawn at, in scale units, for the stage as
             * it is right now. Read from the box, never guessed, and refreshed
             * on every engage so a resized window does not keep painting with
             * the old marker.
             */
            let unit = 0;

            /**
             * How much of each nib is on the page, 0 to 1. Kept off the element
             * on purpose: the ticker below owns `scaleX` and `scaleY`, and two
             * tweens writing one property is the bug that ends with a shape
             * stuck at whatever size the loser was at. Presence is a number
             * that GSAP tweens, and the ticker multiplies it in.
             */
            const presence = TRAIL.map(() => ({ value: 0 }));

            const place = (x: number, y: number) => {
              for (let index = 0; index < nibs.length; index += 1) {
                const node = TRAIL[index];
                if (!node) continue;
                moveX[index]?.(x + node.dx * unit);
                moveY[index]?.(y + node.dy * unit);
              }
            };

            /** Drops the whole trail on a point with no travel to get there. */
            const jump = (x: number, y: number) => {
              for (let index = 0; index < nibs.length; index += 1) {
                const node = TRAIL[index];
                if (!node) continue;
                const nx = x + node.dx * unit;
                const ny = y + node.dy * unit;
                moveX[index]?.(nx, nx);
                moveY[index]?.(ny, ny);
              }
            };

            /**
             * Nib size for the stage as it is now. Read, never guessed, and
             * taken from whichever dimension is the tighter of the two: the
             * stage is full-bleed and short, so a marker sized off the width
             * alone would be taller than the picture on a wide monitor.
             */
            const measure = (box: DOMRect) => {
              unit =
                Math.min(NIB_WIDTH * box.width, NIB_HEIGHT * box.height) /
                NIB_UNITS;
            };

            let live = false;
            let inked = false;
            let flowing = false;
            let invitation: gsap.core.Timeline | null = null;

            /**
             * The liquid. Each nib turns at its own rate and breathes on two
             * axes at two more, so the union of the five never settles into a
             * shape it has held before. `gsap.set` rather than a tween per
             * property: this runs on the ticker, and a tween that is re-created
             * every frame is a tween that never gets to interpolate anything.
             */
            const flow = () => {
              const time = gsap.ticker.time;

              for (let index = 0; index < nibs.length; index += 1) {
                const node = TRAIL[index];
                const nib = nibs[index];
                if (!node || !nib) continue;

                const size = unit * node.scale * (presence[index]?.value ?? 0);

                gsap.set(nib, {
                  scaleX:
                    size *
                    (1 + Math.sin(time * node.pulseX + node.phase) * PULSE.x),
                  scaleY:
                    size *
                    (1 +
                      Math.sin(time * node.pulseY + node.phase * 1.7) *
                        PULSE.y),
                  rotation: node.rotate + time * node.spin,
                });
              }
            };

            /** Nothing on screen, nothing on the ticker. */
            const startFlow = () => {
              if (flowing) return;
              flowing = true;
              gsap.ticker.add(flow);
            };

            const stopFlow = () => {
              if (!flowing) return;
              flowing = false;
              gsap.ticker.remove(flow);
            };
            cleanups.push(stopFlow);

            const ink = () => {
              inked = true;
              startFlow();
              gsap.to(presence, {
                value: 1,
                duration: 0.55,
                ease: ease.out,
                stagger: 0.035,
                overwrite: "auto",
              });
            };

            const lift = () => {
              inked = false;
              gsap.to(presence, {
                value: 0,
                duration: 0.45,
                ease: ease.out,
                // Tail first. A marker leaves the page from the back.
                stagger: { each: 0.035, from: "end" },
                overwrite: "auto",
                // One last pass writes the zeros, then the ticker stops. The
                // other order leaves five shapes parked a fraction above zero
                // and a clip path quietly rasterising nothing forever.
                onComplete: () => {
                  flow();
                  stopFlow();
                },
              });
            };

            /** Kills the unprompted stroke. True if there was one to kill. */
            const stopInvitation = () => {
              if (!invitation) return false;
              invitation.kill();
              invitation = null;
              return true;
            };

            /**
             * One unprompted stroke across the tabletop, a beat after the
             * plate lands. It runs where the two plates actually differ —
             * the cards, the sketches and the board — because the upper third
             * of this artwork is white in both and a reveal up there reveals
             * nothing. One pass, never a loop.
             */
            const invite = () => {
              const box = stageEl.getBoundingClientRect();
              const from = { x: box.width * 0.18, y: box.height * 0.72 };
              const head = { ...from };

              measure(box);
              jump(from.x, from.y);
              startFlow();
              inked = true;

              invitation = gsap
                .timeline({
                  delay: 0.9,
                  onUpdate: () => place(head.x, head.y),
                  onComplete: () => {
                    inked = false;
                    invitation = null;
                    flow();
                    stopFlow();
                  },
                })
                .to(
                  presence,
                  {
                    value: 1,
                    duration: 0.5,
                    ease: ease.out,
                    stagger: 0.03,
                  },
                  0,
                )
                .to(
                  head,
                  { x: box.width * 0.82, duration: 2, ease: ease.inOut },
                  0.15,
                )
                // A shallow bow through the middle, so the stroke reads as a
                // hand rather than a slider.
                .to(
                  head,
                  {
                    y: box.height * 0.58,
                    duration: 1,
                    ease: ease.loop,
                    yoyo: true,
                    repeat: 1,
                  },
                  0.15,
                )
                .to(
                  presence,
                  {
                    value: 0,
                    duration: 0.55,
                    ease: ease.out,
                    stagger: { each: 0.03, from: "end" },
                  },
                  "-=0.4",
                );
            };

            /**
             * One handler for both entering and moving. `pointerenter` does
             * not fire for a cursor that was already sitting over the stage
             * when the page loaded, so the first move has to be able to start
             * the stroke on its own.
             *
             * One layout read at the top, then only writes: `quickTo` retargets
             * a tween and leaves the rendering to the ticker, so nothing here
             * can interleave a read with a write.
             */
            const engage = (event: PointerEvent) => {
              if (!live) return;

              const interrupted = stopInvitation();
              const box = stageEl.getBoundingClientRect();
              measure(box);

              const x = event.clientX - box.left;
              const y = event.clientY - box.top;

              // Mid-invitation the trail is already on the artwork, so it
              // glides over instead of teleporting. From rest it starts under
              // the pointer, because ink does not fly in from the corner.
              if (!inked) jump(x, y);

              // Cutting the invitation short leaves presence at whatever that
              // timeline had reached, which is anything between nothing and
              // full. Re-inking retargets it; `inked` alone would take the
              // killed tween's last frame as the resting size.
              if (!inked || interrupted) ink();

              place(x, y);
            };

            const onLeave = () => {
              if (!live) return;
              stopInvitation();
              lift();
            };

            stageEl.addEventListener("pointerenter", engage);
            stageEl.addEventListener("pointermove", engage);
            stageEl.addEventListener("pointerleave", onLeave);
            cleanups.push(() => {
              stageEl.removeEventListener("pointerenter", engage);
              stageEl.removeEventListener("pointermove", engage);
              stageEl.removeEventListener("pointerleave", onLeave);
              stopInvitation();
            });

            whenPainted(() => {
              gsap.set(layerEl, {
                clipPath: `url(#${CLIP_ID})`,
                autoAlpha: 1,
              });
              live = true;
              invite();
            });

            return () => {
              for (const cleanup of cleanups) cleanup();
            };
          },
        );

        return () => media.revert();
      } catch {
        // Anything at all going wrong here leaves a grey studio on screen,
        // which is not the page. Fail open to the colour plate, unclipped.
        failOpenRevealTargets([layerEl]);
      }
    },
    { scope: stage },
  );

  return (
    <div ref={stage} className={className}>
      {base}

      {/* Decorative in full: it is the same room as the plate underneath it,
          and the alt text on that one already describes the room. */}
      <div ref={layer} aria-hidden className="studio-paint">
        {paint}
      </div>

      {/* `userSpaceOnUse`, so the nibs are positioned in the stage's own CSS
          pixels and the shapes keep their proportions in a box that is not
          square. An objectBoundingBox clip would stretch every nib into an
          ellipse at 16:9. The children of a clipPath are OR'd together, which
          is what makes five lagging blobs one continuous stroke. */}
      <svg
        className="studio-brush-defs"
        width="0"
        height="0"
        aria-hidden
        focusable="false"
      >
        <defs>
          <clipPath id={CLIP_ID} clipPathUnits="userSpaceOnUse">
            {TRAIL.map((node, index) => (
              <path key={index} data-nib d={NIB[node.nib]} />
            ))}
          </clipPath>
        </defs>
      </svg>
    </div>
  );
}
