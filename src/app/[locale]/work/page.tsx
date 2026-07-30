import type { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';

import { PageHeader } from '@/components/layout/PageHeader';
import { Reveal } from '@/components/ui/Reveal';
import { ProjectCard } from '@/components/work/ProjectCard';
import { Link } from '@/i18n/navigation';
import type { Locale } from '@/i18n/routing';
import { getArchive, getWorkGrid } from '@/lib/projects';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'work' });

  return {
    title: t('title'),
    description: t('lead'),
    alternates: { canonical: `/${locale}/work`, languages: { en: '/en/work', ar: '/ar/work' } },
  };
}

export default async function WorkPage({ params }: { params: Promise<{ locale: Locale }> }) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations('work');
  const grid = getWorkGrid();
  const archiveCount = getArchive().length;

  return (
    <main id="main">
      <PageHeader
        eyebrow={t('eyebrow', { count: grid.length })}
        title={t('title')}
        lead={t('lead')}
      />

      <section className="container-page pb-24">
        <ul className="grid gap-5 sm:grid-cols-2">
          {grid.map((project, index) => (
            <Reveal
              as="li"
              key={project.slug}
              delay={Math.min(index, 5) * 0.05}
              className={project.featuredOrder !== undefined ? 'sm:col-span-2' : undefined}
            >
              <ProjectCard
                project={project}
                locale={locale}
                featured={project.featuredOrder !== undefined}
                priority={index === 0}
              />
            </Reveal>
          ))}
        </ul>

        <div className="mt-14 rounded-panel border border-dashed border-line p-8 text-center">
          <p className="text-sm text-ink-muted">{t('archiveLead')}</p>
          <Link
            href="/work/archive"
            className="mt-4 inline-flex items-center gap-2 text-sm font-medium text-brand hover:text-brand-strong"
          >
            {t('archive')}
            <span className="nums text-ink-subtle">({archiveCount})</span>
          </Link>
        </div>
      </section>
    </main>
  );
}
