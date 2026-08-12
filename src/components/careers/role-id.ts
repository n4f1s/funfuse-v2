/**
 * The anchor id for a role.
 *
 * Shared by the hero, which links straight to a role, and the switcher, which
 * reads the hash back to decide which one to open. Derived from the title so
 * the catalogue of jobs stays the only place a role is written down.
 */
export function roleId(title: string): string {
  const slug = title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

  return `role-${slug}`;
}
