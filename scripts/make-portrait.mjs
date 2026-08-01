// Derives the site's portrait assets from the single source photo in _assets-in.
//
// Two crops, because the two placements want different framing:
//   portrait — 4:5, head to waist, for the hero column
//   avatar   — 1:1, head and shoulders, for the about page and JSON-LD
//
// Both are emitted as AVIF + WebP + a JPEG floor. The JPEG exists so the OG
// image and any mail client that cannot decode AVIF still has something.
//
// _assets-in/ is gitignored, so this cannot be re-run from a fresh clone — the
// outputs in public/me are committed and are what the site actually serves.
// Re-run it only when the source photograph or a crop window changes.

import { mkdir } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import sharp from 'sharp';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const SOURCE = path.join(root, '_assets-in', 'profile-original.JPG');
const OUT = path.join(root, 'public', 'me');

// Crop windows in source pixels, measured against the 3024x4032 original.
// The subject stands right of centre, so neither crop is centred on the frame.
const CROPS = {
  portrait: { left: 989, top: 700, width: 1900, height: 2375, widths: [640, 900, 1280] },
  avatar: { left: 1189, top: 502, width: 1500, height: 1500, widths: [200, 400, 800] },
};

async function main() {
  await mkdir(OUT, { recursive: true });

  for (const [name, crop] of Object.entries(CROPS)) {
    for (const width of crop.widths) {
      // .rotate() with no argument applies the EXIF orientation before the crop
      // is measured — without it a phone photo can be cropped on the wrong axis.
      const pipeline = sharp(SOURCE)
        .rotate()
        .extract({ left: crop.left, top: crop.top, width: crop.width, height: crop.height })
        .resize({ width, withoutEnlargement: true });

      const stem = path.join(OUT, `${name}-${width}`);

      await Promise.all([
        pipeline.clone().avif({ quality: 62, effort: 6 }).toFile(`${stem}.avif`),
        pipeline.clone().webp({ quality: 80 }).toFile(`${stem}.webp`),
        pipeline.clone().jpeg({ quality: 82, mozjpeg: true }).toFile(`${stem}.jpg`),
      ]);

      console.log(`  ${name}-${width}`);
    }
  }
}

await main();
