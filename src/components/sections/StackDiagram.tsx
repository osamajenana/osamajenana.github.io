import { getTranslations } from 'next-intl/server';

import { ArchDiagram } from '@/components/diagrams/ArchDiagram';
import { stack } from '@/components/diagrams';
import { Reveal } from '@/components/ui/Reveal';
import type { Locale } from '@/i18n/routing';

/**
 * The production stack.
 *
 * Drawn with the same component every case-study diagram uses, so the home page
 * and the work pages speak one visual language. It replaced a WebGL node graph:
 * unlit spheres render as flat discs with a blurred halo, which is a look no
 * amount of tuning rescues, and a labelled system diagram is an infographic —
 * infographics want crisp vector edges and readable type, not a 3D canvas.
 */
export async function StackDiagram({ locale }: { locale: Locale }) {
  const t = await getTranslations('diagram');

  return (
    <section aria-labelledby="diagram-heading" className="border-t border-line">
      <div className="container-page py-20 sm:py-28">
        <Reveal>
          <h2 id="diagram-heading" className="display-title max-w-3xl text-display-sm text-ink">
            {t('title')}
          </h2>
          <p className="mt-5 max-w-2xl text-lg leading-relaxed text-ink-muted">{t('lead')}</p>
        </Reveal>

        <Reveal delay={0.08}>
          <div className="panel panel-frame relative mt-12 overflow-hidden p-6 sm:p-10 lg:p-14">
            <div aria-hidden className="aurora" />
            <div className="relative">
              <ArchDiagram spec={stack} locale={locale} animated hideCaption />
            </div>
          </div>

          <p className="mt-6 max-w-2xl text-sm leading-relaxed text-ink-subtle">
            {stack.caption[locale]}
          </p>
        </Reveal>
      </div>
    </section>
  );
}
