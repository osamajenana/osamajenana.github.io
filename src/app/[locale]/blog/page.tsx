import type { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';

import { PageHeader } from '@/components/layout/PageHeader';
import { Reveal } from '@/components/ui/Reveal';
import { Tag } from '@/components/ui/Tag';
import { Link } from '@/i18n/navigation';
import type { Locale } from '@/i18n/routing';
import { getPosts } from '@/lib/posts';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'blog' });

  return {
    title: t('title'),
    description: t('lead'),
    alternates: {
      canonical: `/${locale}/blog`,
      languages: { en: '/en/blog', ar: '/ar/blog' },
      types: { 'application/rss+xml': '/rss.xml' },
    },
  };
}

export default async function BlogIndexPage({ params }: { params: Promise<{ locale: Locale }> }) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations('blog');
  const entries = getPosts();

  return (
    <main id="main">
      <PageHeader title={t('title')} lead={t('lead')} />

      <div className="container-page pb-24">
        {entries.length === 0 ? (
          <p className="text-ink-muted">{t('empty')}</p>
        ) : (
          <ul className="divide-y divide-line border-y border-line">
            {entries.map((entry, index) => (
              <Reveal as="li" key={entry.slug} delay={Math.min(index, 5) * 0.05}>
                <Link
                  href={`/blog/${entry.slug}`}
                  className="group flex flex-col gap-3 py-8 transition-opacity hover:opacity-80"
                >
                  <div className="flex flex-wrap items-center gap-x-4 gap-y-1 font-mono text-xs text-ink-subtle">
                    <time dateTime={entry.publishedAt} className="nums">
                      {entry.publishedAt}
                    </time>
                    <span aria-hidden>·</span>
                    <span>{t('readingTime', { minutes: entry.readingMinutes })}</span>
                  </div>

                  <h2 className="max-w-3xl text-xl font-semibold tracking-tight text-ink sm:text-2xl">
                    {entry.title[locale]}
                  </h2>

                  <p className="max-w-2xl leading-relaxed text-ink-muted">
                    {entry.description[locale]}
                  </p>

                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {entry.tags.map((tag) => (
                      <Tag key={tag} mono tone="muted">
                        {tag}
                      </Tag>
                    ))}
                  </div>
                </Link>
              </Reveal>
            ))}
          </ul>
        )}

        <p className="mt-10 text-sm text-ink-subtle">
          <a
            href="/rss.xml"
            className="underline decoration-line-strong underline-offset-2 hover:text-ink"
          >
            {t('rss')}
          </a>
        </p>
      </div>
    </main>
  );
}
