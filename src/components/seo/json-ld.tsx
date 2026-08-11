/**
 * Renders a JSON-LD document.
 *
 * Server Component. The payload is produced by src/lib/jsonld.ts, which
 * JSON.stringify's it — the only injection surface is `<` inside a string
 * value, which we escape below.
 */
export function JsonLd({ data }: { data: string }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: data.replace(/</g, "\\u003c") }}
    />
  );
}
