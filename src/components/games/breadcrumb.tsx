import { Link } from "@/components/navigation";

/**
 * Home / Games / Title trail.
 *
 * Callers pass the same `trail` array to `breadcrumbSchema()` (src/lib/jsonld.ts)
 * so the visible crumbs and the structured data can never drift apart.
 */
export function Breadcrumb({
  trail,
}: {
  trail: readonly { name: string; path: string }[];
}) {
  return (
    <nav aria-label="Breadcrumb" className="mb-8">
      <ol className="text-faint flex flex-wrap items-center gap-1.5 text-sm">
        {trail.map((crumb, index) => {
          const last = index === trail.length - 1;
          return (
            <li key={crumb.path} className="flex items-center gap-1.5">
              {last ? (
                <span aria-current="page" className="text-heading font-medium">
                  {crumb.name}
                </span>
              ) : (
                <Link
                  href={crumb.path}
                  className="hover:text-heading transition-colors duration-[var(--duration-hover)] ease-out"
                >
                  {crumb.name}
                </Link>
              )}
              {last ? null : <span aria-hidden>/</span>}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
