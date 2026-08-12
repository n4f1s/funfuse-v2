import type { StaticImageData } from "next/image";

import { Media, type SizePreset } from "@/components/media";
import { FloatingProp } from "@/components/motion";

/**
 * One of the small 3D objects from the games, dropped into the page as scenery.
 *
 * Every one is decorative, so it carries no alt text and no tab stop. They earn
 * their place by giving the big empty column of an asymmetric layout something
 * to hold, and by moving at a different rate from the type so the page has a
 * back plane. Used sparingly: one per section, never more.
 *
 * **Resolution is the constraint.** The source art is between 93px and 587px
 * wide, so these are accents at 40 to 250px, not illustrations. Sizing one past
 * its source is the fastest way to make a premium page look cheap.
 *
 * Markup only. The motion lives in `<FloatingProp>`, which is the client leaf.
 */
export function Prop({
  src,
  className,
  sizes = "prop",
  drift,
  axis,
  spin,
  bob,
}: {
  src: StaticImageData;
  /** Position and width. The wrapper is already `absolute`. */
  className?: string;
  sizes?: SizePreset | (string & {});
  drift?: number;
  axis?: "x" | "y";
  spin?: number;
  bob?: boolean;
}) {
  return (
    <FloatingProp
      className={className}
      drift={drift}
      axis={axis}
      spin={spin}
      bob={bob}
    >
      <Media
        src={src}
        decorative
        aspect="intrinsic"
        sizes={sizes}
        tone="none"
        rounded="none"
        fit="contain"
      />
    </FloatingProp>
  );
}
