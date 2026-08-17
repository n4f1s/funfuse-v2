import { readFile } from "node:fs/promises";
import { join } from "node:path";

import { ImageResponse } from "next/og";

import { site } from "@/config/site";
import { OG_IMAGE_SIZE } from "@/lib/seo";

/**
 * The default social card.
 *
 * **Why this file exists.** `createMetadata` omits `images` unless a route
 * supplies its own, on the documented assumption that the file-convention
 * image fills the gap. Nothing filled it: game and blog pages passed their own
 * cover art, and the other nine routes — the homepage included — shipped
 * `twitter:card="summary_large_image"` with no image behind it. Every share of
 * those URLs rendered as a bare link.
 *
 * Being a route segment file, this applies to every page under `/` that does
 * not pass its own image, so it is one file rather than nine metadata edits.
 * Routes that already carry real artwork keep it: an explicit `openGraph.images`
 * wins over the convention, so no game or blog card changes.
 *
 * **It is deliberately not a design.** Satori reads `ttf`/`otf`/`woff` and
 * next/font ships `woff2`, so Bricolage cannot render here and the type falls
 * to the bundled default. Everything else is taken from what already exists:
 * the brand icon asset, and the token hexes copied out of the `@theme` block in
 * globals.css. Drop a designed `opengraph-image.png` (1200x630) in this folder
 * and it replaces this file with no other change — the file convention prefers
 * a literal image over a generated one.
 *
 * Statically generated at build time. It reads no request data, so it does not
 * make any route dynamic.
 */

export const alt = `${site.name} - ${site.tagline}`;
export const size = OG_IMAGE_SIZE;
export const contentType = "image/png";

/** Token hexes, mirrored from the `@theme` block in globals.css. */
const CANVAS = "#fcf9f9";
const HEADING = "#130c0b";
const MUTED = "#635857";
const BRAND = "#eb3845";

/**
 * Read once at module scope rather than per render. The 512px icon is the only
 * brand asset Satori can take — the wordmark beside it in the header is WebP,
 * which Satori does not decode.
 */
const icon = await readFile(
  join(process.cwd(), "src/assets/brand/funfuse-games-icon.png"),
);
const iconSrc = `data:image/png;base64,${icon.toString("base64")}`;

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          backgroundColor: CANVAS,
          padding: "84px 88px",
        }}
      >
        {/* The one accent mark on the card. A rule rather than a filled panel:
            the brand red is an identity colour here, not a background. */}
        <div
          style={{ display: "flex", width: 128, height: 10, backgroundColor: BRAND }}
        />

        <div style={{ display: "flex", alignItems: "center", gap: 44 }}>
          {/* A plain img on purpose: Satori rasterises this tree itself and
              next/image has no meaning inside an ImageResponse. */}
          <img src={iconSrc} alt="" width={168} height={168} style={{ borderRadius: 36 }} />

          <div style={{ display: "flex", flexDirection: "column" }}>
            <div style={{ display: "flex", fontSize: 76, fontWeight: 700, color: HEADING, letterSpacing: -2 }}>
              {site.name}
            </div>
            <div style={{ display: "flex", fontSize: 34, color: MUTED, marginTop: 12 }}>
              {site.tagline}
            </div>
          </div>
        </div>

        <div style={{ display: "flex", fontSize: 28, color: MUTED }}>
          {site.url.replace(/^https?:\/\//, "")}
        </div>
      </div>
    ),
    size,
  );
}
