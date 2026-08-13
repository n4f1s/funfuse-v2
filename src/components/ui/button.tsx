import type { ComponentPropsWithoutRef, ReactNode } from "react";

import { Link } from "@/components/navigation";
import { cn } from "@/lib/cn";

/**
 * The pressable primitive.
 *
 * Two details that matter more than the styling:
 *   - `:active` scales to 0.97, so a press is acknowledged in the same frame
 *     the finger lands. Without it the UI feels like it did not hear you.
 *   - Only transform and colour transition, never `all`. Tailwind v4 already
 *     compiles `hover:` behind `(hover: hover)`, so a tap on touch does not
 *     leave the control stuck in its hovered state.
 *
 * Contrast note: the brand red (#EB3845, brand-500) is 4.05:1 on white, which
 * is not enough behind a white label. Filled buttons therefore use brand-600
 * (5.5:1) and brand-500 stays the identity colour for large type and graphics.
 * See docs/design-system.md.
 */

type Variant = "primary" | "secondary" | "ghost";
type Size = "sm" | "md" | "lg";

const base = [
  "inline-flex items-center justify-center gap-2 rounded-full",
  "font-medium whitespace-nowrap select-none",
  "transition-[transform,background-color,border-color,color,box-shadow]",
  "duration-[var(--duration-press)] ease-out",
  "active:scale-[0.97]",
  "disabled:pointer-events-none disabled:opacity-50",
  "aria-disabled:pointer-events-none aria-disabled:opacity-50",
].join(" ");

const variants: Record<Variant, string> = {
  primary: cn(
    "bg-accent-strong text-inverse shadow-xs",
    "hover:bg-brand-700 hover:shadow-accent",
    "active:bg-accent-pressed",
  ),
  secondary: cn(
    "border border-line bg-surface text-heading shadow-xs",
    "hover:border-line-strong hover:bg-surface-muted",
  ),
  ghost: cn("text-heading", "hover:bg-surface-muted"),
};

const sizes: Record<Size, string> = {
  sm: "h-9 px-4 text-sm",
  md: "h-11 px-5 text-[0.9375rem]",
  lg: "h-13 px-7 text-base",
};

type CommonProps = {
  children: ReactNode;
  variant?: Variant;
  size?: Size;
  className?: string;
};

type ButtonAsButton = CommonProps &
  Omit<ComponentPropsWithoutRef<"button">, "className" | "children"> & {
    href?: never;
  };

type ButtonAsLink = CommonProps &
  Omit<ComponentPropsWithoutRef<"a">, "className" | "children" | "href"> & {
    href: string;
  };

export type ButtonProps = ButtonAsButton | ButtonAsLink;

export function Button({
  children,
  variant = "primary",
  size = "md",
  className,
  ...rest
}: ButtonProps) {
  const classes = cn(base, variants[variant], sizes[size], className);

  if ("href" in rest && rest.href !== undefined) {
    const { href, ...linkProps } = rest as ButtonAsLink;
    const external = /^(https?:|mailto:|tel:)/.test(href);

    if (external) {
      return (
        <a
          href={href}
          className={classes}
          rel="noopener noreferrer"
          target={href.startsWith("http") ? "_blank" : undefined}
          {...linkProps}
        >
          {children}
        </a>
      );
    }

    return (
      <Link href={href} className={classes} {...linkProps}>
        {children}
      </Link>
    );
  }

  const { type = "button", ...buttonProps } = rest as ButtonAsButton;

  return (
    <button type={type} className={classes} {...buttonProps}>
      {children}
    </button>
  );
}
