import { ImageResponse } from 'next/og';

import { owner } from '@/content/site';
import { routing } from '@/i18n/routing';
import { getBySlug, getCaseStudySlugs } from '@/lib/projects';

/**
 * Per-project share card. English-only for the same reason as the root card:
 * Satori has no Arabic shaping engine.
 */

export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export function generateStaticParams() {
  return routing.locales.flatMap((locale) => getCaseStudySlugs().map((slug) => ({ locale, slug })));
}

const INK = '#f4f5f7';
const MUTED = '#9ba1ac';
const SUBTLE = '#6b727e';
const BRAND = '#5b8cff';
const LINE = '#22262e';

export default async function ProjectOgImage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const project = getBySlug(slug);

  const name = project?.name.en ?? owner.fullName;
  const tagline = project?.tagline.en ?? owner.role.en;
  const stack = project?.stack.slice(0, 5).join(' · ') ?? '';
  const metrics = project?.metrics.slice(0, 3) ?? [];

  return new ImageResponse(
    <div
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        padding: '68px 80px',
        backgroundColor: '#08090c',
        backgroundImage:
          'radial-gradient(120% 90% at 20% -20%, #131a2e 0%, #08090c 60%, #08090c 100%)',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 14, fontSize: 22, color: SUBTLE }}>
        <div>{owner.fullName}</div>
        <div style={{ width: 5, height: 5, borderRadius: 999, backgroundColor: LINE }} />
        <div>Case study</div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 22 }}>
        <div style={{ fontSize: 64, color: INK, lineHeight: 1.08, letterSpacing: -1.5 }}>
          {name}
        </div>
        <div style={{ fontSize: 30, color: MUTED, lineHeight: 1.35, maxWidth: 940 }}>{tagline}</div>
      </div>

      {metrics.length > 0 && (
        <div style={{ display: 'flex', gap: 56 }}>
          {metrics.map((metric) => (
            <div key={metric.label.en} style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
              <div style={{ fontSize: 44, color: BRAND }}>{metric.value}</div>
              <div style={{ fontSize: 20, color: SUBTLE }}>{metric.label.en}</div>
            </div>
          ))}
        </div>
      )}

      <div
        style={{
          display: 'flex',
          paddingTop: 24,
          borderTop: `1px solid ${LINE}`,
          fontSize: 22,
          color: SUBTLE,
        }}
      >
        {stack}
      </div>
    </div>,
    size,
  );
}
