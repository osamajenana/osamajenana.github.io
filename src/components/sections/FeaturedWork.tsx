import { getTranslations } from 'next-intl/server';

import { ButtonLink } from '@/components/ui/Button';
import { Reveal } from '@/components/ui/Reveal';
import { ProjectCard } from '@/components/work/ProjectCard';
import type { Locale } from '@/i18n/routing';
import { getFeatured } from '@/lib/projects';

export async function FeaturedWork({ locale }: { locale: Locale }) {
  const t = await getTranslations('work');
  const featured = getFeatured();

  return (
    <section aria-labelledby="featured-heading" className="border-t border-line">
      <div className="container-page py-20 sm:py-28">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <h2 id="featured-heading" className="display-title text-display-sm text-ink">
            {t('featuredTitle')}
          </h2>
          <ButtonLink href="/work" variant="secondary" size="sm">
            {t('allWork')}
          </ButtonLink>
        </div>

        <ul className="mt-12 space-y-6">
          {featured.map((project, index) => (
            <Reveal
              as="li"
              key={project.slug}
              delay={Math.min(index, 4) * 0.06}
              className="min-w-0"
            >
              <ProjectCard project={project} locale={locale} featured priority={index === 0} />
            </Reveal>
          ))}
        </ul>
      </div>
    </section>
  );
}
