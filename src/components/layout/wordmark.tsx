import logo from "@/assets/brand/funfuse-games-logo.webp";
import { Media, type MediaPriority } from "@/components/media";
import { Link } from "@/components/navigation";
import { cn } from "@/lib/cn";

/**
 * The official brand lockup, linked to home. Shared by the header and footer
 * so the mark only needs to be swapped in one place.
 *
 * Sized by width; height follows from the asset's own aspect ratio. The link
 * carries the accessible name, so the image itself is decorative.
 */
export function Wordmark({
  className,
  href = "/",
  priority = "lazy",
}: {
  className?: string;
  href?: string;
  priority?: MediaPriority;
}) {
  return (
    <Link
      href={href}
      aria-label="FunFuse Games, home"
      className="inline-flex transition-opacity duration-(--duration-hover) ease-out hover:opacity-70"
    >
      <Media
        src={logo}
        decorative
        aspect="intrinsic"
        sizes="lockup"
        fit="contain"
        tone="none"
        rounded="none"
        priority={priority}
        className={cn("w-28", className)}
      />
    </Link>
  );
}
