/**
 * The celebration.
 *
 * One implementation, two callers: the contact form's table when a message
 * goes, and the homepage trick table when a hand is won. Both are "you took
 * the trick", so both should look like the same studio said it.
 *
 * `canvas-confetti` is imported at the moment it is needed rather than with
 * the page, so the bytes only ever reach a browser that got far enough to
 * deserve them. It draws to a fixed canvas of its own and cleans up after
 * itself, so there is nothing to mount and nothing to tear down.
 *
 * Colours are the brand ramp and nothing else. Confetti in a hue we do not own
 * is a second accent colour, which this site does not have.
 */

const COLORS = ["#eb3845", "#c92736", "#ffa39f", "#ffe3e1", "#ffffff"];

type Shot = {
  particleCount: number;
  spread: number;
  startVelocity: number;
  scalar: number;
  /** Milliseconds after the first shot. */
  delay: number;
  /** Degrees. 90 is straight up. */
  angle?: number;
  /** Fraction of the origin box's width to shift the source by. */
  offsetX?: number;
};

/** A single handful, from the middle. Enough to mark a moment. */
const MODEST: Shot[] = [
  { particleCount: 90, spread: 78, startVelocity: 38, scalar: 0.95, delay: 0 },
  { particleCount: 45, spread: 110, startVelocity: 26, scalar: 0.8, delay: 220 },
];

/**
 * A whole hand of it. Three shots from three directions: one straight up the
 * middle, then a pair fired inward from the edges a beat later, which is what
 * stops a big burst from reading as one puff that stops dead.
 */
const HUGE: Shot[] = [
  { particleCount: 160, spread: 96, startVelocity: 52, scalar: 1.1, delay: 0 },
  {
    particleCount: 90,
    spread: 70,
    startVelocity: 46,
    scalar: 0.95,
    delay: 180,
    angle: 62,
    offsetX: -0.34,
  },
  {
    particleCount: 90,
    spread: 70,
    startVelocity: 46,
    scalar: 0.95,
    delay: 180,
    angle: 118,
    offsetX: 0.34,
  },
  { particleCount: 70, spread: 130, startVelocity: 28, scalar: 0.8, delay: 460 },
];

/**
 * Fires from wherever `source` is on screen, rather than from the middle of
 * the window, so the burst comes out of the thing that was just won.
 *
 * Silent on failure. A missing chunk costs a celebration, never the outcome it
 * was celebrating — the page has already said what happened in words.
 */
export async function celebrate(
  source: HTMLElement,
  size: "modest" | "huge" = "modest",
): Promise<void> {
  if (
    typeof window === "undefined" ||
    window.matchMedia("(prefers-reduced-motion: reduce)").matches
  ) {
    return;
  }

  try {
    const { default: confetti } = await import("canvas-confetti");
    const box = source.getBoundingClientRect();

    // Off-screen by the time the burst lands. Firing anyway would drop paper
    // into a corner of the viewport with nothing under it.
    if (box.bottom < 0 || box.top > window.innerHeight) return;

    const shots = size === "huge" ? HUGE : MODEST;

    for (const shot of shots) {
      const fire = () =>
        confetti({
          particleCount: shot.particleCount,
          spread: shot.spread,
          startVelocity: shot.startVelocity,
          scalar: shot.scalar,
          angle: shot.angle,
          ticks: 200,
          decay: 0.9,
          colors: COLORS,
          disableForReducedMotion: true,
          origin: {
            x:
              (box.left + box.width * (0.5 + (shot.offsetX ?? 0))) /
              window.innerWidth,
            y: (box.top + box.height * 0.45) / window.innerHeight,
          },
        });

      if (shot.delay === 0) fire();
      else window.setTimeout(fire, shot.delay);
    }
  } catch {
    // Deliberately swallowed. See the note above.
  }
}
