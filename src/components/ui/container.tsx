import type { ElementType, ReactNode } from "react";

import { cn } from "@/lib/cn";

/**
 * The page gutter. One component so the left edge of every section lines up.
 * `--container-page` (1320px) is defined in globals.css.
 */
export function Container({
  children,
  as: Tag = "div",
  width = "page",
  className,
}: {
  children: ReactNode;
  as?: ElementType;
  /** `prose` narrows to a 672px reading measure for long-form copy. */
  width?: "page" | "prose";
  className?: string;
}) {
  return (
    <Tag
      className={cn(
        "mx-auto w-full px-5 sm:px-8",
        width === "page" ? "max-w-page" : "max-w-prose",
        className,
      )}
    >
      {children}
    </Tag>
  );
}
