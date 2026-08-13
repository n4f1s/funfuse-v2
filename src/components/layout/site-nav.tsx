"use client";

import { usePathname } from "next/navigation";

import { Link } from "@/components/navigation";
import { primaryNav, type NavItem } from "@/config/site";
import { cn } from "@/lib/cn";

/**
 * Desktop navigation. Client only because it needs the current pathname to
 * mark the active route — nothing else here is interactive.
 */
export function SiteNav({ className }: { className?: string }) {
  const pathname = usePathname();

  return (
    <nav aria-label="Primary" className={className}>
      <ul className="flex items-center gap-1">
        {primaryNav.map((item) => (
          <li key={item.href}>
            <Link
              href={item.href}
              aria-current={isActive(pathname, item) ? "page" : undefined}
              className={cn(
                "relative inline-flex h-9 items-center rounded-full px-3.5 text-[0.9375rem]",
                "transition-colors duration-[var(--duration-hover)] ease-out",
                isActive(pathname, item)
                  ? "text-heading font-medium"
                  : "text-muted hover:text-heading",
              )}
            >
              {item.label}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}

export function isActive(pathname: string, item: NavItem): boolean {
  const candidates = [item.href, ...(item.matchPrefixes ?? [])];

  return candidates.some(
    (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`),
  );
}
