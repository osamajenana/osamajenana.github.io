import type { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';

import { PageHeader } from '@/components/layout/PageHeader';
import { Tag } from '@/components/ui/Tag';
import type { Locale } from '@/i18n/routing';
import { formatPeriod, getArchive } from '@/lib/projects';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'work' });

  return {
    title: t('archive'),
    description: t('archiveLead'),
    alternates: {
      canonical: `/${locale}/work/archive`,
      languages: { en: '/en/work/archive', ar: '/ar/work/archive' },
    },
  };
}

export default async function ArchivePage({ params }: { params: Promise<{ locale: Locale }> }) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations('work');
  const common = await getTranslations('common');
  const archive = getArchive();

  return (
    <main id="main">
      <PageHeader title={t('archive')} lead={t('archiveLead')} />

      <section className="container-page pb-24">
        <ul className="divide-y divide-line border-y border-line">
          {archive.map((project) => (
            <li
              key={project.slug}
              className="flex flex-col gap-3 py-6 sm:flex-row sm:items-baseline sm:gap-8"
            >
              <span className="nums w-28 shrink-0 text-sm text-ink-subtle">
                {formatPeriod(project, common('present'))}
              </span>

              <div className="min-w-0 flex-1 space-y-2">
                <h2 className="font-medium text-ink">{project.name[locale]}</h2>
                <p className="text-sm text-ink-muted">{project.tagline[locale]}</p>
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {project.stack.map((tech) => (
                    <Tag key={tech} mono tone="muted">
                      {tech}
                    </Tag>
                  ))}
                </div>
              </div>
            </li>
          ))}
        </ul>
      </section>
    </main>
  );
}
