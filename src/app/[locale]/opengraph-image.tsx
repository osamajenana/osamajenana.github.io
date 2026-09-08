import { ImageResponse } from 'next/og';

import { company, owner } from '@/content/site';
import { routing } from '@/i18n/routing';

/**
 * Social share card for the site root.
 *
 * Text is English in both locales on purpose: Satori lays glyphs out without a
 * bidi or Arabic shaping engine, so Arabic comes out as disconnected letters in
 * the wrong order. A correct English card beats a broken Arabic one — the same
 * reason the generated CV PDF is English-only.
 *
 * No custom font is registered, so there is no font file to ship or fail to
 * load; the layout is built to carry the design instead of the typeface.
 */

export const alt = `${company.legalName.en} — ${owner.role.en}`;
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

/** Without this the card is rendered per request instead of once at build. */
export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

const INK = '#f4f5f7';
const MUTED = '#9ba1ac';
const SUBTLE = '#6b727e';
const BRAND = '#5b8cff';
const AI = '#35e0a1';

export default async function OgImage() {
  return new ImageResponse(
    <div
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        padding: '72px 80px',
        backgroundColor: '#08090c',
        // Mirrors the hero's radial wash.
        backgroundImage:
          'radial-gradient(120% 90% at 50% -20%, #10131c 0%, #08090c 62%, #08090c 100%)',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
        <div style={{ width: 12, height: 12, borderRadius: 999, backgroundColor: AI }} />
        <div style={{ fontSize: 24, color: MUTED }}>
          WhatsApp Business Platform · AI systems · Product engineering
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column' }}>
        <div style={{ fontSize: 78, color: INK, lineHeight: 1.05, letterSpacing: -2 }}>
          I build complete products —
        </div>
        <div style={{ fontSize: 78, color: MUTED, lineHeight: 1.05, letterSpacing: -2 }}>
          and I make them intelligent.
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <div style={{ fontSize: 30, color: INK }}>{company.legalName.en}</div>
          <div style={{ width: 5, height: 5, borderRadius: 999, backgroundColor: SUBTLE }} />
          <div style={{ fontSize: 30, color: BRAND }}>{company.locality.en}</div>
        </div>
        {/* One interpolation, not three: Satori refuses a <div> with more than
            one child unless it is given an explicit display. */}
        <div style={{ fontSize: 22, color: SUBTLE }}>
          {`${owner.fullName} · ${owner.role.en} · 40+ shipped systems`}
        </div>
      </div>
    </div>,
    size,
  );
}
