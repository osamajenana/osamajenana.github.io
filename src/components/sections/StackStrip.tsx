import { getTranslations } from 'next-intl/server';

import { getStackFrequency } from '@/lib/projects';

/**
 * Technologies ordered by how many shipped projects actually use them, so the
 * strip is evidence rather than a wish list. The count is the point.
 */
export async function StackStrip() {
  const t = await getTranslations('stack');
  const stack = getStackFrequency().filter((entry) => entry.count > 1);

  return (
    <section aria-labelledby="stack-heading" className="border-t border-line bg-surface">
      <div className="container-page py-16">
        <h2
          id="stack-heading"
          className="font-mono text-xs tracking-widest text-ink-subtle uppercase"
        >
          {t('title')}
        </h2>
        <p className="mt-3 max-w-2xl text-sm leading-relaxed text-ink-muted">{t('lead')}</p>

        <ul className="mt-8 flex flex-wrap gap-x-5 gap-y-3">
          {stack.map((entry) => (
            <li key={entry.name} className="flex items-baseline gap-1.5">
              <span className="font-mono text-sm text-ink">{entry.name}</span>
              <span className="nums text-[11px] text-ink-subtle">×{entry.count}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
