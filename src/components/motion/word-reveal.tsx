"use client";

import { Fragment, useRef, type ElementType } from "react";

import { cn } from "@/lib/cn";
import {
  failOpenRevealTargets,
  gsap,
  MOTION_QUERY,
  registerGsap,
  useGSAP,
} from "@/lib/motion/gsap";
import { ease } from "@/lib/motion/tokens";

/**
 * A section heading that inks in word by word, scrubbed against the scroll.
 *
 * Why it animates: reading order. `<Reveal>` says "this block has arrived";
 * this says "read this, at this pace", and it hands the pacing to the reader
 * rather than to a timeline. Scroll back and the sentence un-inks, because the
 * only thing driving it is where the page is. It is for major section headings
 * and nothing else — a page where several things do this is a page that reads
 * like a slideshow.
 *
 * One span per word, not two.
 * ---------------------------------------------------------------------------
 * The usual build of this effect stacks a faint copy of the word under a
 * second copy tweened from 0 to 1. For identical text in identical ink that is
 * the same picture as one copy tweened from the faint value to 1: a base at
 * `f` under a front at `a` composites to `f + (1 - f)a`, which is the same
 * linear ramp. One copy costs half the nodes, cannot disagree with itself
 * about width or line breaking, and is read out once by a screen reader.
 *
 * The words are real inline text with real spaces between them, so the heading
 * wraps, balances and computes its accessible name exactly as the plain
 * sentence did.
 */

/**
 * Resting ink of a word the scroll has not reached. Mirrors the
 * `.will-word-reveal` rule in globals.css, which owns the same value before
 * first paint. Change both together.
 *
 * Not lower: this is a heading, and a visitor who stops mid-band should still
 * be reading grey text rather than looking for it.
 */
const FAINT = 0.3;

/**
 * The scroll band the sentence is mapped across.
 *
 * `top 85%` is the entry line `<Reveal>` uses, so the heading starts inking at
 * the same moment the paragraph column beside it arrives. Finishing at `top
 * 35%` rather than the reference's 25% leaves the sentence fully inked while
 * it is still the thing being read, and puts the last word out of the way of a
 * short viewport that might not scroll much further.
 */
const START = "top 85%";
const END = "top 35%";

/**
 * Timeline seconds, normalised across the band by `scrub`. `STEP` well under
 * `FADE` is the whole trick: each word takes a little over two steps to ink,
 * so three words are always in flight and the sentence reads as a wave passing
 * over it instead of a row of switches.
 */
const FADE = 1;
const STEP = 0.42;

export function WordReveal({
  text,
  as: Tag = "h2",
  id,
  className,
}: {
  /** The heading, as a plain string. Split on whitespace, one span per word. */
  text: string;
  as?: ElementType;
  /**
   * For headings a landmark points at with `aria-labelledby`. Structural only —
   * nothing about the animation is configurable per instance, so the effect
   * stays one recognisable site-wide behaviour.
   */
  id?: string;
  className?: string;
}) {
  const scope = useRef<HTMLElement>(null);
  const words = text.trim().split(/\s+/);

  useGSAP(
    () => {
      const root = scope.current;
      if (!root) return;

      const nodes = [...root.querySelectorAll<HTMLElement>("[data-word]")];
      if (nodes.length === 0) return;

      try {
        registerGsap();

        const media = gsap.matchMedia();

        media.add(MOTION_QUERY.ok, () => {
          try {
            // `fromTo` rather than `to`: with `invalidateOnRefresh` a `to`
            // tween re-reads its start value from whatever opacity the scrub
            // last wrote, so a refresh mid-band would pin the words at that
            // value and the reveal would never run again.
            const tween = gsap.fromTo(
              nodes,
              { opacity: FAINT },
              {
                opacity: 1,
                duration: FADE,
                // Per word, not across the band — the band is already linear
                // by virtue of being scroll position. Each word inks quickly
                // and settles, which is what keeps the leading edge soft.
                ease: ease.out,
                stagger: STEP,
                scrollTrigger: {
                  trigger: root,
                  start: START,
                  end: END,
                  // Smoothing, so a trackpad flick does not snap the sentence
                  // from grey to black in one frame. Same value as <Parallax>.
                  scrub: 0.6,
                  invalidateOnRefresh: true,
                  // A permanent will-change would keep a layer alive per word
                  // for as long as the page is open. These exist only while
                  // the heading is inside its own band.
                  onToggle: (self) =>
                    gsap.set(
                      nodes,
                      self.isActive
                        ? { willChange: "opacity" }
                        : { clearProps: "willChange" },
                    ),
                },
              },
            );

            return () => {
              tween.scrollTrigger?.kill();
              tween.kill();
            };
          } catch {
            failOpenRevealTargets(nodes);
          }
        });

        // Reduced motion: the sentence is simply ink. The CSS below carries
        // the same end state before paint, so this is the belt to that braces.
        media.add(MOTION_QUERY.reduced, () => {
          gsap.set(nodes, { opacity: 1, clearProps: "willChange" });
        });

        return () => media.revert();
      } catch {
        failOpenRevealTargets(nodes);
      }
    },
    { scope, dependencies: [text] },
  );

  return (
    <Tag ref={scope} id={id} className={cn("will-word-reveal", className)}>
      {words.map((word, index) => (
        <Fragment key={`${index}-${word}`}>
          {/* A real space between the spans, so the browser has something to
              break the line on and the accessible name keeps its gaps. */}
          {index > 0 ? " " : null}
          <span data-word>{word}</span>
        </Fragment>
      ))}
    </Tag>
  );
}
