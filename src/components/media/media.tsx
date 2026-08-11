import Image, { type StaticImageData } from "next/image";
import type { CSSProperties, ReactNode } from "react";

import { cn } from "@/lib/cn";

import { aspectClass, type AspectName } from "./aspect";
import { resolveSizes, type SizePreset } from "./sizes";

/**
 * The image primitive. Every image on the site goes through this component.
 *
 * What it guarantees:
 *   1. Space is always reserved. The wrapper carries the aspect ratio, so the
 *      box exists before the bytes arrive and CLS stays at zero.
 *   2. A responsive `sizes` value is mandatory (see sizes.ts) — no accidental
 *      100vw downloads into a 300px slot.
 *   3. Alt text is enforced by the type system. Either give real `alt`, or
 *      declare `decorative` and get `alt=""` plus `aria-hidden`.
 *   4. Loading state costs zero client JS: a static import gets Next's blur
 *      placeholder for free, and anything else sits on a skeleton that the
 *      loaded image covers.
 *   5. LCP is explicit. `priority="lcp"` is the documented Next 16 `preload`
 *      path — the deprecated `priority` prop is never used.
 *
 * Server Component. Do not add event handlers here; if a slot needs an
 * on-load hook, wrap it in a client island instead of making this one.
 */

/**
 * How urgently the image should load.
 *   lcp    — the single largest above-the-fold image on the route. One per
 *            page, maximum. Emits `preload`, which puts a <link rel=preload>
 *            in <head> before the <body> is parsed.
 *   eager  — above the fold but not the LCP candidate (logos, small hero art).
 *   lazy   — everything else. Default.
 */
export type MediaPriority = "lcp" | "eager" | "lazy";

type AltProps =
  | { alt: string; decorative?: false }
  | { decorative: true; alt?: never };

type BaseMediaProps = {
  /**
   * A static import (preferred — gives intrinsic size and a blur placeholder
   * at build time), a remote/public URL, or null to render the placeholder.
   */
  src: StaticImageData | string | null | undefined;
  sizes: SizePreset | (string & {});
  aspect?: AspectName;
  priority?: MediaPriority;
  fit?: "cover" | "contain";
  /** CSS object-position, e.g. "top" for art that must not crop the top. */
  position?: string;
  /** Required for remote images if you want a blur-up transition. */
  blurDataURL?: string;
  rounded?: "none" | "md" | "lg" | "xl" | "2xl" | "full";
  /**
   * What sits behind the image.
   *   muted   — the default loading surface, correct for opaque photography.
   *   surface — a lighter plate, for `fit="contain"` art that needs a card.
   *   none    — nothing. Required for transparent cutouts: a painted box would
   *             draw a visible rectangle around art that has no rectangle.
   */
  tone?: "muted" | "surface" | "none";
  /**
   * Classes for the frame. Sizing and spacing only.
   *
   * The frame already sets `relative`, and `cn` joins classes without resolving
   * Tailwind conflicts, so passing `absolute` or `fixed` here is decided by
   * stylesheet order rather than by intent. Position the image from a wrapper
   * element instead.
   */
  className?: string;
  imageClassName?: string;
  /** Rendered under the image, outside the frame. Never overlaid on it. */
  caption?: ReactNode;
  /** Shown inside the placeholder while the asset does not exist yet. */
  placeholderLabel?: string;
};

export type MediaProps = BaseMediaProps & AltProps;

const roundedClass = {
  none: "",
  md: "rounded-md",
  lg: "rounded-lg",
  xl: "rounded-xl",
  "2xl": "rounded-2xl",
  full: "rounded-full",
} as const;

const toneClass = {
  muted: "bg-surface-muted",
  surface: "bg-surface",
  none: "",
} as const;

/**
 * Next 16 deprecated `priority` in favour of `preload`, and documents that
 * `preload` should not be combined with `loading` or `fetchPriority`.
 */
function loadingProps(priority: MediaPriority) {
  switch (priority) {
    case "lcp":
      return { preload: true } as const;
    case "eager":
      return { loading: "eager", fetchPriority: "high" } as const;
    default:
      return { loading: "lazy" } as const;
  }
}

export function Media({
  src,
  alt,
  decorative,
  sizes,
  aspect = "wide",
  priority = "lazy",
  fit = "cover",
  position,
  blurDataURL,
  rounded = "lg",
  tone = "muted",
  className,
  imageClassName,
  caption,
  placeholderLabel,
}: MediaProps) {
  // `intrinsic` needs the asset's own dimensions, which only a static import
  // carries. A remote URL and the empty state have none, so they fall back to a
  // real named ratio rather than collapsing the box to zero height.
  const staticSrc = src && typeof src !== "string" ? src : null;
  const resolvedAspect =
    aspect === "intrinsic" && !staticSrc ? "wide" : aspect;

  const frame = cn(
    "relative isolate overflow-hidden",
    aspectClass[resolvedAspect],
    roundedClass[rounded],
    toneClass[tone],
    className,
  );

  const frameStyle: CSSProperties | undefined =
    resolvedAspect === "intrinsic" && staticSrc
      ? { aspectRatio: `${staticSrc.width} / ${staticSrc.height}` }
      : undefined;

  if (!src) {
    return (
      <MediaFigure caption={caption}>
        <div className={frame}>
          <MediaSkeleton label={placeholderLabel} />
        </div>
      </MediaFigure>
    );
  }

  // Static imports get a build-time blurDataURL from Next automatically; for
  // remote sources we only ask for `blur` when a data URL was supplied.
  //
  // `tone="none"` means transparent art. The blur placeholder is painted as a
  // background behind the image, so on a cutout it renders a blurred rectangle
  // in exactly the space the art was chosen for not having. No placeholder is
  // the better loading state there.
  const placeholder =
    tone !== "none" && (staticSrc || blurDataURL) ? ("blur" as const) : undefined;

  const style: CSSProperties = {
    objectFit: fit,
    ...(position ? { objectPosition: position } : {}),
  };

  return (
    <MediaFigure caption={caption}>
      <div className={frame} style={frameStyle}>
        {/* When a blur placeholder exists, Next's own blur-up is the loading
            state and a skeleton underneath would be dead weight. Otherwise the
            skeleton sits behind the image, and the image covers it on load.
            Transparent art gets neither: nothing should show through it. */}
        {placeholder || tone === "none" ? null : <MediaSkeleton />}
        <Image
          src={src}
          alt={decorative ? "" : alt}
          aria-hidden={decorative || undefined}
          fill
          sizes={resolveSizes(sizes)}
          style={style}
          placeholder={placeholder}
          {...(blurDataURL ? { blurDataURL } : {})}
          {...loadingProps(priority)}
          className={cn("relative z-1", imageClassName)}
        />
      </div>
    </MediaFigure>
  );
}

function MediaFigure({
  caption,
  children,
}: {
  caption?: ReactNode;
  children: ReactNode;
}) {
  if (!caption) return <>{children}</>;

  return (
    <figure className="flex flex-col gap-2">
      {children}
      <figcaption className="text-sm text-muted">{caption}</figcaption>
    </figure>
  );
}

/**
 * The loading / missing-asset surface. Pure CSS, no client JS: nothing here
 * needs to know when the image loaded, so the whole system stays a Server
 * Component. The sweep runs a fixed number of passes and stops.
 */
function MediaSkeleton({ label }: { label?: string }) {
  return (
    <div
      aria-hidden
      className="absolute inset-0 grid place-items-center bg-surface-muted"
    >
      <div className="absolute inset-0 animate-shimmer bg-[linear-gradient(100deg,transparent_36%,var(--color-ink-0)_50%,transparent_64%)] opacity-70" />
      {label ? (
        <span className="relative px-4 text-center text-2xs font-medium tracking-wide text-faint uppercase">
          {label}
        </span>
      ) : null}
    </div>
  );
}
