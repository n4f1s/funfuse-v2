/**
 * Generates `src/content/games/generated/screenshots.generated.ts`.
 *
 * Every game gets exactly five screenshot slots. This script scans
 * `src/assets/games/<folder>/screenshots-1.webp` through `screenshots-5.webp`
 * for each game (folder from `src/content/games/asset-folders.ts`) and emits
 * a static import for every file that exists, `null` for every slot that
 * doesn't. Nothing here is hand-maintained: add a correctly named file and
 * the next `dev`/`build`/`typecheck`/`lint` run (all of which call this
 * script first — see package.json) picks it up with no code edit.
 *
 * Run directly with Node's native TypeScript support — no ts-node/tsx. See
 * `allowImportingTsExtensions` in tsconfig.json for why the relative import
 * below carries an explicit `.ts` extension.
 */

import { existsSync } from "node:fs";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

import { gameAssetFolders } from "../src/content/games/asset-folders.ts";

const SLOT_COUNT = 5;

const SCRIPT_DIR = path.dirname(fileURLToPath(import.meta.url));
const ROOT_DIR = path.resolve(SCRIPT_DIR, "..");
const ASSETS_DIR = path.join(ROOT_DIR, "src/assets/games");
const OUTPUT_DIR = path.join(ROOT_DIR, "src/content/games/generated");
const OUTPUT_FILE = path.join(OUTPUT_DIR, "screenshots.generated.ts");

const HEADER = `/**
 * AUTO-GENERATED — DO NOT EDIT BY HAND.
 *
 * Produced by \`scripts/generate-screenshots.ts\` from two inputs: the slug ->
 * folder mapping in \`src/content/games/asset-folders.ts\`, and a filesystem
 * scan of \`src/assets/games/<folder>/screenshots-1.webp\` through
 * \`screenshots-5.webp\`. A slot with no matching file is \`null\` — the gallery
 * (\`src/components/games/screenshots-gallery.tsx\`) renders that as its
 * placeholder tile, never as a missing import or a broken slot.
 *
 * Regenerate with \`pnpm generate:screenshots\`. It also runs automatically
 * before \`dev\`, \`build\`, \`typecheck\` and \`lint\` (see package.json), so
 * adding a correctly named screenshot file needs no edit here — restart dev
 * or rebuild and it appears.
 */`;

/** Turns a folder name into a valid, collision-free JS identifier. */
function toIdentifier(folder: string, index: number): string {
  return `img_${folder.replace(/[^a-zA-Z0-9]/g, "_")}_${index}`;
}

async function main() {
  const slugs = Object.keys(gameAssetFolders).sort();

  const imports: string[] = [];
  const manifestEntries: string[] = [];
  let resolvedCount = 0;

  for (const slug of slugs) {
    const folder = gameAssetFolders[slug];
    const slots: string[] = [];

    for (let index = 1; index <= SLOT_COUNT; index += 1) {
      const fileName = `screenshots-${index}.webp`;
      const absolutePath = path.join(ASSETS_DIR, folder, fileName);

      if (existsSync(absolutePath)) {
        const identifier = toIdentifier(folder, index);
        imports.push(`import ${identifier} from "@/assets/games/${folder}/${fileName}";`);
        slots.push(identifier);
        resolvedCount += 1;
      } else {
        slots.push("null");
      }
    }

    manifestEntries.push(`  ${JSON.stringify(slug)}: [${slots.join(", ")}],`);
  }

  const output = `${HEADER}

import type { StaticImageData } from "next/image";

${imports.join("\n")}

/** Slug -> exactly ${SLOT_COUNT} slots, real imports or \`null\`. */
export const generatedScreenshots: Readonly<
  Record<string, readonly (StaticImageData | null)[]>
> = {
${manifestEntries.join("\n")}
};
`;

  await mkdir(OUTPUT_DIR, { recursive: true });
  await writeFile(OUTPUT_FILE, output, "utf8");

  const total = slugs.length * SLOT_COUNT;
  console.log(
    `generate-screenshots: ${resolvedCount}/${total} screenshot slots resolved across ${slugs.length} games.`,
  );
}

main().catch((error: unknown) => {
  console.error(error);
  process.exitCode = 1;
});
