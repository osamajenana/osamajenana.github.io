import { getTranslations } from 'next-intl/server';

import { Reveal } from '@/components/ui/Reveal';
import { pillars } from '@/content/site';
import type { Locale } from '@/i18n/routing';
import { filterByPillar, getWorkGrid } from '@/lib/projects';
import type { Pillar } from '@/lib/schemas';
import { cn } from '@/lib/utils';

/**
 * Each card gets its pillar's accent as a wash behind the index number and as
 * the rule along its top edge — three cards that differ only in their text read
 * as a table, and the accent is what makes them read as three things.
 */
const accent: Record<Pillar, { rule: string; wash: string; ink: string }> = {
  web: {
    rule: 'bg-brand',
    wash: 'from-brand/12',
    ink: 'text-brand',
  },
  ai: {
    rule: 'bg-ai',
    wash: 'from-ai/12',
    ink: 'text-ai',
  },
  infra: {
    rule: 'bg-ink-subtle',
    wash: 'from-ink-subtle/12',
    ink: 'text-ink-muted',
  },
};

export async function Pillars({ locale }: { locale: Locale }) {
  const t = await getTranslations('pillars');
  const grid = getWorkGrid();

  const entries = Object.entries(pillars) as [Pillar, (typeof pillars)[Pillar]][];

  return (
    <section aria-labelledby="pillars-heading" className="border-t border-line">
      <div className="container-page py-20 sm:py-28">
        <Reveal>
          <h2 id="pillars-heading" className="display-title max-w-2xl text-display-sm text-ink">
            {t('title')}
          </h2>
          <p className="mt-5 max-w-2xl text-lg leading-relaxed text-ink-muted">{t('lead')}</p>
        </Reveal>

        <ul className="mt-14 grid gap-5 md:grid-cols-3">
          {entries.map(([key, pillar], index) => {
            const count = filterByPillar(grid, key).length;
            const tone = accent[key];

            return (
              <Reveal as="li" key={key} delay={index * 0.08}>
                <article className="panel lift relative h-full overflow-hidden p-7 sm:p-8">
                  <span aria-hidden className={cn('absolute inset-x-0 top-0 h-px', tone.rule)} />
                  <span
                    aria-hidden
                    className={cn(
                      'pointer-events-none absolute inset-x-0 top-0 h-32 bg-gradient-to-b to-transparent',
                      tone.wash,
                    )}
                  />

                  <div className="relative flex items-center justify-between gap-4">
                    <span className={cn('nums text-sm font-medium', tone.ink)}>
                      {String(index + 1).padStart(2, '0')}
                    </span>
                    <span className="nums rounded-pill border border-line bg-canvas px-2.5 py-1 text-[11px] text-ink-subtle">
                      {t('count', { count })}
                    </span>
                  </div>

                  <h3 className="relative mt-8 text-xl font-semibold tracking-tight text-ink">
                    {pillar.label[locale]}
                  </h3>
                  <p className="relative mt-3.5 text-sm leading-relaxed text-ink-muted">
                    {pillar.blurb[locale]}
                  </p>
                </article>
              </Reveal>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
