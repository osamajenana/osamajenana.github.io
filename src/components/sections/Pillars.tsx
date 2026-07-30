import { getTranslations } from 'next-intl/server';

import { Reveal } from '@/components/ui/Reveal';
import { pillars } from '@/content/site';
import type { Locale } from '@/i18n/routing';
import { filterByPillar, getWorkGrid } from '@/lib/projects';
import type { Pillar } from '@/lib/schemas';
import { cn } from '@/lib/utils';

const accentRing: Record<Pillar, string> = {
  web: 'before:bg-brand',
  ai: 'before:bg-ai',
  infra: 'before:bg-ink-subtle',
};

export async function Pillars({ locale }: { locale: Locale }) {
  const t = await getTranslations('pillars');
  const work = await getTranslations('work');
  const grid = getWorkGrid();

  const entries = Object.entries(pillars) as [Pillar, (typeof pillars)[Pillar]][];

  return (
    <section aria-labelledby="pillars-heading" className="border-t border-line">
      <div className="container-page py-20 sm:py-28">
        <Reveal>
          <h2
            id="pillars-heading"
            className="max-w-2xl text-display-sm font-semibold tracking-tight text-ink"
          >
            {t('title')}
          </h2>
          <p className="mt-5 max-w-2xl text-lg leading-relaxed text-ink-muted">{t('lead')}</p>
        </Reveal>

        <ul className="mt-14 grid gap-px overflow-hidden rounded-panel border border-line bg-line md:grid-cols-3">
          {entries.map(([key, pillar], index) => {
            const count = filterByPillar(grid, key).length;

            return (
              <Reveal as="li" key={key} delay={index * 0.08} className="bg-surface">
                <div
                  className={cn(
                    'relative h-full p-7 before:absolute before:inset-x-0 before:top-0 before:h-px sm:p-8',
                    accentRing[key],
                  )}
                >
                  <div className="flex items-baseline justify-between gap-4">
                    <h3 className="text-lg font-semibold tracking-tight text-ink">
                      {pillar.label[locale]}
                    </h3>
                    <span className="nums text-xs text-ink-subtle">
                      {count} {work('title').toLowerCase()}
                    </span>
                  </div>
                  <p className="mt-4 text-sm leading-relaxed text-ink-muted">
                    {pillar.blurb[locale]}
                  </p>
                </div>
              </Reveal>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
