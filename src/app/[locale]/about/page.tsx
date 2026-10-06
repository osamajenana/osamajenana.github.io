import type { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';

import { PageHeader } from '@/components/layout/PageHeader';
import { ButtonLink, CvDownloadButton } from '@/components/ui/Button';
import { StatItem } from '@/components/ui/MetricList';
import { Portrait } from '@/components/ui/Portrait';
import { Reveal } from '@/components/ui/Reveal';
import { Tag } from '@/components/ui/Tag';
import { resume } from '@/content/resume';
import { owner, pillars } from '@/content/site';
import type { Locale } from '@/i18n/routing';
import { getArchive, getWorkGrid } from '@/lib/projects';
import type { Pillar } from '@/lib/schemas';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'about' });

  return {
    title: t('title'),
    description: resume.profile[locale].slice(0, 160),
    alternates: { canonical: `/${locale}/about`, languages: { en: '/en/about', ar: '/ar/about' } },
  };
}

export default async function AboutPage({ params }: { params: Promise<{ locale: Locale }> }) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations('about');
  const cv = await getTranslations('cv');
  const hero = await getTranslations('hero');
  const totalProjects = getWorkGrid().length + getArchive().length;

  return (
    <main id="main">
      <PageHeader title={t('title')} lead={resume.headline[locale]} />

      <div className="container-page space-y-20 pb-24">
        {/* ---- profile ---- */}
        <Reveal as="section">
          <div className="grid gap-10 sm:grid-cols-[14rem_minmax(0,1fr)] sm:gap-12 lg:gap-16">
            <div className="relative w-40 sm:w-full">
              <div
                aria-hidden
                className="absolute -inset-5 -z-10 rounded-[3rem] blur-2xl"
                style={{
                  background:
                    'radial-gradient(60% 60% at 50% 40%, var(--aurora-1), transparent 72%)',
                }}
              />
              <div className="panel panel-frame panel-deep aspect-[4/5] overflow-hidden">
                <Portrait
                  variant="portrait"
                  sizes="(min-width: 640px) 14rem, 10rem"
                  alt={hero('portraitAlt')}
                />
              </div>
            </div>

            <div className="max-w-2xl">
              <p className="text-lg leading-[1.75] text-ink-muted">{resume.profile[locale]}</p>

              <dl className="mt-10 grid grid-cols-2 gap-8 border-t border-line pt-8 sm:grid-cols-4">
                <StatItem value={owner.yearsExperience} label={t('stats.years')} />
                <StatItem value={totalProjects} label={t('stats.systems')} />
                <StatItem value={resume.skills.length} label={t('stats.skillAreas')} />
                <StatItem value={2} label={t('stats.languages')} />
              </dl>
            </div>
          </div>
        </Reveal>

        {/* ---- what I do ---- */}
        <section aria-labelledby="focus-heading">
          <SectionTitle id="focus-heading">{t('focus')}</SectionTitle>
          <ul className="grid gap-5 md:grid-cols-3">
            {(Object.entries(pillars) as [Pillar, (typeof pillars)[Pillar]][]).map(
              ([key, pillar], index) => (
                <Reveal as="li" key={key} delay={index * 0.06} className="panel p-6">
                  <h3 className="font-semibold tracking-tight text-ink">{pillar.label[locale]}</h3>
                  <p className="mt-3 text-sm leading-relaxed text-ink-muted">
                    {pillar.blurb[locale]}
                  </p>
                </Reveal>
              ),
            )}
          </ul>
        </section>

        {/* ---- experience ---- */}
        <section aria-labelledby="experience-heading">
          <SectionTitle id="experience-heading">{t('experience')}</SectionTitle>
          <ol className="space-y-10 border-s border-line ps-6 sm:ps-8">
            {resume.experience.map((role, index) => (
              <Reveal as="li" key={`${role.title.en}-${role.period.en}`} delay={index * 0.05}>
                <div className="relative">
                  <span
                    aria-hidden
                    className="absolute -start-[1.9rem] top-2 size-2 rounded-full bg-brand sm:-start-[2.4rem]"
                  />
                  <p className="nums text-sm text-ink-subtle">{role.period[locale]}</p>
                  <h3 className="mt-1 text-lg font-semibold tracking-tight text-ink">
                    {role.title[locale]}
                  </h3>
                  <p className="text-ink-muted">{role.org[locale]}</p>
                  <ul className="mt-4 space-y-2.5">
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
              </Reveal>
            ))}
          </ol>
        </section>

        {/* ---- skills ---- */}
        <section aria-labelledby="skills-heading">
          <SectionTitle id="skills-heading">{t('skills')}</SectionTitle>
          <dl className="space-y-7">
            {resume.skills.map((group) => (
              <div key={group.group.en}>
                <dt className="mb-3 text-sm font-medium text-ink">{group.group[locale]}</dt>
                <dd className="flex flex-wrap gap-1.5">
                  {group.items.map((item) => (
                    <Tag key={item} mono>
                      {item}
                    </Tag>
                  ))}
                </dd>
              </div>
            ))}
          </dl>
        </section>

        {/* ---- education ---- */}
        <section aria-labelledby="education-heading">
          <SectionTitle id="education-heading">{t('education')}</SectionTitle>
          <ul className="divide-y divide-line border-y border-line">
            {resume.education.map((entry) => (
              <li
                key={`${entry.degree.en}-${entry.period.en}`}
                className="flex flex-col gap-1 py-5 sm:flex-row sm:items-baseline sm:justify-between sm:gap-8"
              >
                <div>
                  <h3 className="font-medium text-ink">
                    {entry.degree[locale]} · {entry.field[locale]}
                  </h3>
                  <p className="mt-0.5 text-sm text-ink-muted">{entry.org[locale]}</p>
                </div>
                <span className="nums shrink-0 text-sm text-ink-subtle">
                  {entry.period[locale]}
                </span>
              </li>
            ))}
          </ul>
        </section>

        <div className="flex flex-wrap gap-3">
          <ButtonLink href="/cv">{cv('title')}</ButtonLink>
          <CvDownloadButton>{cv('download')}</CvDownloadButton>
          <ButtonLink href="/contact" variant="ghost">
            {t('getInTouch')}
          </ButtonLink>
        </div>
      </div>
    </main>
  );
}

function SectionTitle({ id, children }: { id: string; children: React.ReactNode }) {
  return (
    <h2 id={id} className="eyebrow mb-8">
      {children}
    </h2>
  );
}
