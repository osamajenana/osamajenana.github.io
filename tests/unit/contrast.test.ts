import { readFileSync } from 'node:fs';

import { describe, expect, it } from 'vitest';

/**
 * WCAG contrast checks against the real stylesheet.
 *
 * The token values are parsed out of globals.css rather than duplicated here, so
 * this cannot drift: changing a colour changes what this test measures. An axe
 * run in the browser found the original palette shipped white text on the
 * primary button at roughly 2.9:1 — this is the guard that stops that returning.
 */

const css = readFileSync(new URL('../../src/styles/globals.css', import.meta.url), 'utf8');

/** Pulls `--name: #hex;` declarations out of a selector block. */
function tokensIn(selector: string): Record<string, string> {
  const escaped = selector.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const block = new RegExp(`${escaped}\\s*\\{([\\s\\S]*?)\\n\\}`).exec(css);
  if (!block?.[1]) throw new Error(`No block found for selector: ${selector}`);

  const out: Record<string, string> = {};
  for (const match of block[1].matchAll(/--([\w-]+):\s*(#[0-9a-fA-F]{3,8})\s*;/g)) {
    if (match[1] && match[2]) out[match[1]] = match[2];
  }
  return out;
}

function channel(value: number): number {
  const c = value / 255;
  return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
}

function luminance(hex: string): number {
  const clean = hex.replace('#', '');
  const full =
    clean.length === 3
      ? clean
          .split('')
          .map((c) => c + c)
          .join('')
      : clean;

  const r = Number.parseInt(full.slice(0, 2), 16);
  const g = Number.parseInt(full.slice(2, 4), 16);
  const b = Number.parseInt(full.slice(4, 6), 16);

  return 0.2126 * channel(r) + 0.7152 * channel(g) + 0.0722 * channel(b);
}

function ratio(foreground: string, background: string): number {
  const a = luminance(foreground);
  const b = luminance(background);
  const [light, dark] = a > b ? [a, b] : [b, a];
  return (light + 0.05) / (dark + 0.05);
}

const light = tokensIn(':root');
const dark = tokensIn("[data-theme='dark']");

/** AA: 4.5 for body text, 3.0 for large text and UI component boundaries. */
const BODY = 4.5;
const LARGE = 3;

type Pair = { fg: string; bg: string; min: number; note?: string };

const pairs: Pair[] = [
  // Body text on every surface it can land on.
  { fg: 'ink', bg: 'canvas', min: BODY },
  { fg: 'ink', bg: 'surface', min: BODY },
  { fg: 'ink', bg: 'raised', min: BODY },
  { fg: 'ink-muted', bg: 'canvas', min: BODY },
  { fg: 'ink-muted', bg: 'surface', min: BODY },
  { fg: 'ink-muted', bg: 'raised', min: BODY },
  /**
   * ink-subtle carries small mono labels — 11px counters, eyebrow headings,
   * footer links — so it is held to the body threshold, not the large-text one.
   */
  { fg: 'ink-subtle', bg: 'canvas', min: BODY },
  { fg: 'ink-subtle', bg: 'surface', min: BODY },
  { fg: 'ink-subtle', bg: 'raised', min: BODY },

  // Accents used as text.
  { fg: 'brand', bg: 'canvas', min: BODY },
  { fg: 'brand', bg: 'surface', min: BODY },
  { fg: 'ai', bg: 'canvas', min: BODY },
  { fg: 'ai', bg: 'surface', min: BODY },
  { fg: 'heat', bg: 'canvas', min: BODY },
  { fg: 'heat', bg: 'surface', min: BODY },

  // Text on a filled accent — the primary button.
  { fg: 'on-brand', bg: 'brand', min: BODY, note: 'primary button label' },

  // Accents on their own tinted backgrounds — tags and callouts.
  { fg: 'brand', bg: 'brand-dim', min: BODY },
  { fg: 'ai', bg: 'ai-dim', min: BODY },

  // Borders and the focus ring only need to be distinguishable.
  { fg: 'line-strong', bg: 'canvas', min: LARGE },
  { fg: 'focus', bg: 'canvas', min: LARGE },
];

for (const [themeName, tokens] of [
  ['light', light],
  ['dark', dark],
] as const) {
  describe(`${themeName} theme contrast`, () => {
    for (const pair of pairs) {
      const label = pair.note
        ? `${pair.fg} on ${pair.bg} (${pair.note})`
        : `${pair.fg} on ${pair.bg}`;

      it(`${label} meets ${pair.min}:1`, () => {
        const fg = tokens[pair.fg];
        const bg = tokens[pair.bg];

        expect(fg, `--${pair.fg} is not defined in the ${themeName} theme`).toBeDefined();
        expect(bg, `--${pair.bg} is not defined in the ${themeName} theme`).toBeDefined();

        const measured = ratio(fg as string, bg as string);
        // Rounded so the failure message reads like a contrast checker.
        expect(Math.round(measured * 100) / 100).toBeGreaterThanOrEqual(pair.min);
      });
    }
  });
}
