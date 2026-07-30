/**
 * Generates the app icon set from a single source image.
 *
 *   node scripts/make-icons.mjs [--source _assets-in/favicon-source.png]
 *
 * Next picks these up by filename convention from src/app and emits the right
 * <link> tags, so there is no icon markup to maintain by hand.
 */

import { readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { parseArgs } from 'node:util';

import sharp from 'sharp';

const { values } = parseArgs({
  options: {
    source: { type: 'string', default: '_assets-in/favicon-source.png' },
    out: { type: 'string', default: 'src/app' },
  },
});

const source = await readFile(values.source);
const meta = await sharp(source).metadata();

const targets = [
  // Browser tab and PWA icon. Transparency preserved.
  { file: 'icon.png', size: 512, background: null },
  /**
   * iOS composites an apple-touch-icon onto black, so a transparent one gets a
   * dark halo. Flattening onto the site's canvas colour avoids that.
   */
  { file: 'apple-icon.png', size: 180, background: '#08090c' },
];

for (const target of targets) {
  let pipeline = sharp(source).resize(target.size, target.size, {
    fit: 'contain',
    background: { r: 0, g: 0, b: 0, alpha: 0 },
  });

  if (target.background) {
    pipeline = pipeline.flatten({ background: target.background });
  }

  const png = await pipeline.png({ compressionLevel: 9 }).toBuffer();
  await writeFile(path.join(values.out, target.file), png);

  console.log(
    `  ${target.file.padEnd(16)} ${target.size}x${target.size}  ${String(Math.round(png.length / 1024)).padStart(3)} KB` +
      (target.background ? `  on ${target.background}` : '  transparent'),
  );
}

console.log(`\nfrom ${values.source} (${meta.width}x${meta.height}, ${meta.format})`);
