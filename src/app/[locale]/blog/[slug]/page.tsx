import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getTranslations, setRequestLocale } from 'next-intl/server';

import { Tag } from '@/components/ui/Tag';
import { SITE_URL, owner } from '@/content/site';
import { Link } from '@/i18n/navigation';
import { routing } from '@/i18n/routing';
import type { Locale } from '@/i18n/routing';
import { getPostBody, getPostBySlug, getPostSlugs } from '@/lib/posts';
import { getBySlug } from '@/lib/projects';

export function generateStaticParams() {
  return routing.locales.flatMap((locale) => getPostSlugs().map((slug) => ({ locale, slug })));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: Locale; slug: string }>;
}): Promise<Metadata> {
  const { locale, slug } = await params;
  const entry = getPostBySlug(slug);
  if (!entry) return {};

  return {
    title: entry.title[locale],
    description: entry.description[locale],
    alternates: {
      canonical: `/${locale}/blog/${slug}`,
      languages: { en: `/en/blog/${slug}`, ar: `/ar/blog/${slug}` },
    },
    openGraph: {
      type: 'article',
      title: entry.title[locale],
      description: entry.description[locale],
      publishedTime: entry.publishedAt,
      modifiedTime: entry.updatedAt ?? entry.publishedAt,
      authors: [owner.fullName],
    },
  };
}

export default async function PostPage({
  params,
}: {
  params: Promise<{ locale: Locale; slug: string }>;
}) {
  const { locale, slug } = await params;
  setRequestLocale(locale);

  const entry = getPostBySlug(slug);
  // A ready-made element from content/posts/content.tsx, not a component to
  // instantiate — see the note there for why.
  const body = getPostBody(slug, locale);
  if (!entry || !body) notFound();

  const t = await getTranslations('blog');
  const work = await getTranslations('work');
  const related = entry.relatedProject ? getBySlug(entry.relatedProject) : undefined;

  return (
    <main id="main">
      <article className="container-page pt-32 pb-24 sm:pt-40">
        <div className="mx-auto max-w-[46rem]">
          <Link
            href="/blog"
            className="mb-8 inline-flex items-center gap-1.5 text-sm text-ink-muted hover:text-ink"
          >
            <span aria-hidden className="rtl:-scale-x-100">
              ←
            </span>
            {t('title')}
          </Link>

          <header>
            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 font-mono text-xs text-ink-subtle">
              <time dateTime={entry.publishedAt} className="nums">
                {entry.publishedAt}
              </time>
              <span aria-hidden>·</span>
              <span>{t('readingTime', { minutes: entry.readingMinutes })}</span>
            </div>

            <h1 className="mt-5 text-display-sm font-semibold tracking-tight text-ink">
              {entry.title[locale]}
            </h1>
            <p className="mt-5 text-lg leading-relaxed text-ink-muted">
              {entry.description[locale]}
            </p>

            <div className="mt-7 flex flex-wrap gap-1.5 border-b border-line pb-8">
              {entry.tags.map((tag) => (
                <Tag key={tag} mono>
                  {tag}
                </Tag>
              ))}
            </div>
          </header>

          <div className="mt-10">{body}</div>

          {related && (
            <footer className="mt-14 rounded-panel border border-line bg-surface p-6">
              <p className="font-mono text-xs tracking-widest text-ink-subtle uppercase">
                {t('fromProject')}
              </p>
              <Link
                href={related.hasCaseStudy ? `/work/${related.slug}` : '/work'}
                className="mt-3 inline-block text-lg font-semibold tracking-tight text-ink hover:text-brand"
              >
                {related.name[locale]}
              </Link>
              <p className="mt-2 text-sm leading-relaxed text-ink-muted">
                {related.tagline[locale]}
              </p>
              <Link
                href={related.hasCaseStudy ? `/work/${related.slug}` : '/work'}
                className="mt-4 inline-block text-sm font-medium text-brand hover:text-brand-strong"
              >
                {related.hasCaseStudy ? work('viewCase') : work('allWork')}
              </Link>
            </footer>
          )}
        </div>
      </article>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'BlogPosting',
            headline: entry.title[locale],
            description: entry.description[locale],
            datePublished: entry.publishedAt,
            dateModified: entry.updatedAt ?? entry.publishedAt,
            inLanguage: locale,
            author: { '@type': 'Person', name: owner.fullName, url: SITE_URL },
            mainEntityOfPage: `${SITE_URL}/${locale}/blog/${slug}`,
            keywords: entry.tags.join(', '),
          }),
        }}
      />
    </main>
  );
}
