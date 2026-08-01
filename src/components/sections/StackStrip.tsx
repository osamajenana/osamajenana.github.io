import { getTranslations } from 'next-intl/server';

import { getStackFrequency } from '@/lib/projects';

/**
 * Technologies ordered by how many shipped projects actually use them, so the
 * strip is evidence rather than a wish list. The count is the point.
 *
 * Rendered as a marquee: the list is long enough that a static wrap became six
 * dense rows of small text, which is the shape of a spreadsheet. The track holds
 * the same list twice and the keyframe shifts it by exactly -50%, so the loop is
 * seamless; the duplicate is hidden from assistive technology and the marquee
 * pauses on hover for anyone trying to read a specific entry.
 */
export async function StackStrip() {
  const t = await getTranslations('stack');
  const stack = getStackFrequency().filter((entry) => entry.count > 1);

  const row = (hidden: boolean) => (
    <ul className="flex shrink-0 items-center gap-3 pe-3" aria-hidden={hidden || undefined}>
      {stack.map((entry) => (
        <li
          key={entry.name}
          className="flex items-baseline gap-2 rounded-pill border border-line bg-surface px-4 py-2 whitespace-nowrap shadow-sm"
        >
          <span className="font-mono text-sm text-ink">{entry.name}</span>
          <span className="nums text-[11px] text-ink-subtle">×{entry.count}</span>
        </li>
      ))}
    </ul>
  );

  return (
    <section aria-labelledby="stack-heading" className="border-t border-line bg-raised py-16">
      <div className="container-page">
        <h2 id="stack-heading" className="eyebrow">
          {t('title')}
        </h2>
        <p className="mt-3 max-w-2xl text-sm leading-relaxed text-ink-muted">{t('lead')}</p>
      </div>

      <div className="marquee-host marquee-mask mt-9 overflow-hidden">
        <div className="marquee-track">
          {row(false)}
          {row(true)}
        </div>
      </div>
    </section>
  );
}
