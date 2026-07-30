/**
 * Turns raw viewport captures into the WebP/AVIF pairs that ship in public/work.
 *
 *   node scripts/process-shots.mjs --src <dir> --map <slug>=<file> [<slug>=<file> ...]
 *
 * Screenshots are captured at whatever the browser viewport happens to be, so
 * this normalises every one of them to the same box before it reaches the site —
 * mismatched aspect ratios in a card grid look like a bug.
 */

import { mkdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { parseArgs } from 'node:util';

import sharp from 'sharp';

/**
 * 12:5 — the natural shape of a wide viewport capture and a good card banner.
 *
 * Two widths are emitted. Cards render around 530 CSS px in a two-column grid,
 * so 720w covers them on a 1x display and 1440w on retina; without the smaller
 * variant every phone downloads roughly three times the pixels it can show.
 */
const ASPECT = 12 / 5;
const WIDTHS = [720, 1440];

const { values } = parseArgs({
  options: {
    src: { type: 'string' },
    map: { type: 'string', multiple: true, default: [] },
    out: { type: 'string', default: 'public/work' },
  },
});

if (!values.src || values.map.length === 0) {
  console.error('usage: node scripts/process-shots.mjs --src <dir> --map slug=file.jpg ...');
  process.exit(1);
}

const entries = values.map.map((pair) => {
  const index = pair.indexOf('=');
  if (index === -1) {
    console.error(`bad --map entry (expected slug=file): ${pair}`);
    process.exit(1);
  }
  return { slug: pair.slice(0, index), file: pair.slice(index + 1) };
});

const results = [];

for (const entry of entries) {
  const source = await readFile(path.join(values.src, entry.file));
  const meta = await sharp(source).metadata();

  const dir = path.join(values.out, entry.slug);
  await mkdir(dir, { recursive: true });

  const sizes = {};

  for (const width of WIDTHS) {
    const height = Math.round(width / ASPECT);

    // Anchored to the top: the hero is what identifies the site, and cropping
    // from the centre would cut the header and headline off every shot.
    const framed = () => sharp(source).resize(width, height, { fit: 'cover', position: 'top' });

    const webp = await framed().webp({ quality: 82, effort: 5 }).toBuffer();
    const avif = await framed().avif({ quality: 52, effort: 5 }).toBuffer();

    const suffix = width === Math.max(...WIDTHS) ? '' : `-${width}`;
    await writeFile(path.join(dir, `cover${suffix}.webp`), webp);
    await writeFile(path.join(dir, `cover${suffix}.avif`), avif);

    sizes[width] = {
      webpKB: Math.round(webp.length / 1024),
      avifKB: Math.round(avif.length / 1024),
    };
  }

  results.push({ slug: entry.slug, source: `${meta.width}x${meta.height}`, sizes });
}

console.log(`widths: ${WIDTHS.join(', ')} at ${ASPECT.toFixed(2)}:1\n`);
for (const r of results) {
  const parts = WIDTHS.map(
    (w) =>
      `${w}w webp ${String(r.sizes[w].webpKB).padStart(3)} KB / avif ${String(r.sizes[w].avifKB).padStart(3)} KB`,
  );
  console.log(`  ${r.slug.padEnd(14)} from ${r.source.padEnd(10)} → ${parts.join('  ·  ')}`);
}

const total = (width, format) =>
  results.reduce((sum, r) => sum + r.sizes[width][format === 'webp' ? 'webpKB' : 'avifKB'], 0);
console.log(
  `\ntotals  ${WIDTHS.map((w) => `${w}w: webp ${total(w, 'webp')} KB / avif ${total(w, 'avif')} KB`).join('   ')}`,
);
