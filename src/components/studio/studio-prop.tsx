import type { StaticImageData } from "next/image";

import { Media } from "@/components/media";
import { FloatingProp } from "@/components/motion";

/**
 * One of the studio's own 3D objects, dropped into a section as scenery.
 *
 * Markup only — the drift lives in `<FloatingProp>`, which is the client leaf.
 * Decorative in full: no alt text, no tab stop, nothing to read.
 *
 * **Resolution is the constraint.** These sources are 93px to 250px wide, so
 * they are accents at 40 to 120px, not illustrations. Sizing one past its own
 * pixels is the fastest way to make a careful page look cheap.
 */
export function StudioProp({
  src,
  className,
  drift,
  spin,
  bob,
}: {
  src: StaticImageData;
  /** Position and width. The wrapper is already `absolute`. */
  className?: string;
  drift?: number;
  spin?: number;
  bob?: boolean;
}) {
  return (
    <FloatingProp className={className} drift={drift} spin={spin} bob={bob}>
      <Media
        src={src}
        decorative
        aspect="intrinsic"
        sizes="prop"
        tone="none"
        rounded="none"
        fit="contain"
      />
    </FloatingProp>
  );
}
