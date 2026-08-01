import type { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';

import { PrintButton } from '@/components/cv/PrintButton';
import { CvDownloadButton } from '@/components/ui/Button';
import { resume, RESUME_UPDATED } from '@/content/resume';
import { owner } from '@/content/site';
import type { Locale } from '@/i18n/routing';
import { formatPeriod, getBySlug } from '@/lib/projects';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'cv' });

  return {
    title: `${t('title')} — ${owner.fullName}`,
    description: resume.profile[locale].slice(0, 160),
    alternates: { canonical: `/${locale}/cv`, languages: { en: '/en/cv', ar: '/ar/cv' } },
  };
}

export default async function CvPage({ params }: { params: Promise<{ locale: Locale }> }) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations('cv');
  const common = await getTranslations('common');

  const selected = resume.selectedProjects
    .map((slug) => getBySlug(slug))
    .filter((project): project is NonNullable<typeof project> => Boolean(project));

  return (
    <main id="main" className="print:pt-0">
      {/* ---- screen-only toolbar ---- */}
      <div className="container-page pt-32 pb-8 sm:pt-40 print:hidden">
        <h1 className="text-display-sm font-semibold tracking-tight text-ink">{t('title')}</h1>
        <p className="mt-4 max-w-2xl text-lg text-ink-muted">{t('lead')}</p>

        <div className="mt-8 flex flex-wrap items-center gap-3">
          {/* The designed PDF in public/ — the document that actually goes out. */}
          <CvDownloadButton variant="primary">{t('download')}</CvDownloadButton>
          <PrintButton />
          <span className="nums text-xs text-ink-subtle">
            {t('updated')}: {RESUME_UPDATED}
          </span>
        </div>

        {locale === 'ar' && (
          <p className="mt-4 max-w-xl rounded-card border border-line bg-raised p-4 text-sm leading-relaxed text-ink-muted">
            {t('printHint')}
          </p>
        )}
      </div>

      {/* ---- the document ---- */}
      <article className="container-page cv-sheet pb-24 print:pb-0">
        <header className="border-b border-line pb-6">
          <h2 className="text-3xl font-semibold tracking-tight text-ink">{resume.name[locale]}</h2>
          <p className="mt-1.5 text-ink-muted">{resume.headline[locale]}</p>

          <ul className="mt-4 flex flex-wrap gap-x-5 gap-y-1.5 text-sm text-ink-muted">
            <li>
              <a href={`mailto:${resume.email}`} className="hover:text-ink">
                {resume.email}
              </a>
            </li>
            <li className="nums">{resume.whatsapp}</li>
            <li>
              <a href={resume.website} className="hover:text-ink">
                {resume.website.replace('https://', '')}
              </a>
            </li>
            <li>{resume.location[locale]}</li>
          </ul>
        </header>

        <Section title={t('profile')}>
          <p className="leading-relaxed text-ink-muted">{resume.profile[locale]}</p>
        </Section>

        <Section title={t('experience')}>
          <div className="space-y-7">
            {resume.experience.map((role) => (
              <div key={`${role.title.en}-${role.period.en}`} className="break-inside-avoid">
                <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
                  <h4 className="font-medium text-ink">
                    {role.title[locale]}
                    <span className="text-ink-subtle"> · </span>
                    <span className="text-ink-muted">{role.org[locale]}</span>
                  </h4>
                  <span className="nums text-sm text-ink-subtle">{role.period[locale]}</span>
                </div>
                <ul className="mt-3 space-y-2">
                  {role.bullets.map((bullet) => (
                    <li key={bullet.en} className="flex gap-3">
                      <span
                        aria-hidden
                        className="mt-2 size-1 shrink-0 rounded-full bg-ink-subtle"
                      />
                      <span className="text-sm leading-relaxed text-ink-muted">
                        {bullet[locale]}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </Section>

        <Section title={t('projects')}>
          <div className="space-y-5">
            {selected.map((project) => (
              <div key={project.slug} className="break-inside-avoid">
                <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
                  <h4 className="font-medium text-ink">{project.name[locale]}</h4>
                  <span className="nums text-sm text-ink-subtle">
                    {formatPeriod(project, common('present'))}
                  </span>
                </div>
                <p className="mt-1.5 text-sm leading-relaxed text-ink-muted">
                  {project.tagline[locale]}
                </p>
                <p className="mt-1.5 font-mono text-xs text-ink-subtle">
                  {project.stack.slice(0, 6).join(' · ')}
                </p>
              </div>
            ))}
          </div>
          <p className="mt-6 text-sm text-ink-subtle">{t('moreOnSite')}</p>
        </Section>

        <Section title={t('skills')}>
          <dl className="grid gap-x-10 gap-y-4 sm:grid-cols-2">
            {resume.skills.map((group) => (
              <div key={group.group.en} className="break-inside-avoid">
                <dt className="text-sm font-medium text-ink">{group.group[locale]}</dt>
                <dd className="mt-1 text-sm leading-relaxed text-ink-muted">
                  {group.items.join(' · ')}
                </dd>
              </div>
            ))}
          </dl>
        </Section>

        <Section title={t('education')}>
          <div className="space-y-4">
            {resume.education.map((entry) => (
              <div
                key={`${entry.degree.en}-${entry.period.en}`}
                className="flex break-inside-avoid flex-wrap items-baseline justify-between gap-x-4 gap-y-1"
              >
                <h4 className="font-medium text-ink">
                  {entry.degree[locale]}
                  <span className="text-ink-subtle"> · </span>
                  <span className="text-ink-muted">{entry.field[locale]}</span>
                  <span className="text-ink-subtle"> · </span>
                  <span className="text-ink-muted">{entry.org[locale]}</span>
                </h4>
                <span className="nums text-sm text-ink-subtle">{entry.period[locale]}</span>
              </div>
            ))}
          </div>
        </Section>
      </article>
    </main>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mt-9 print:mt-6">
      <h3 className="mb-4 font-mono text-xs tracking-widest text-ink-subtle uppercase">{title}</h3>
      {children}
    </section>
  );
}
