import { getTranslations } from 'next-intl/server';

import { HeroFade } from '@/components/sections/HeroFade';
import { HeroName } from '@/components/sections/HeroName';
import { HeroPortrait } from '@/components/sections/HeroPortrait';
import { ButtonLink, CvDownloadButton } from '@/components/ui/Button';
import { Portrait } from '@/components/ui/Portrait';
import { StatusDot } from '@/components/ui/Tag';
import { owner } from '@/content/site';
import type { Locale } from '@/i18n/routing';
import { getArchive, getWorkGrid } from '@/lib/projects';

/**
 * The hero.
 *
 * The name leads, at display size, because this is a person's site — the
 * previous version opened on a tagline and left "Osama Jenana" as 14px of navbar
 * text, which is the one thing a portfolio cannot get wrong.
 *
 * The photograph carries the right column. Everything behind it — the wash, the
 * grid, the glow — is decoration at negative z-index, so the heading is plain
 * text with no paint dependency on any of it.
 *
 * Entrance motion lives in three small client components. This one stays a
 * server component so the copy, the figures and the image markup are all in the
 * first HTML response; the animation only ever moves what is already there.
 */
export async function Hero({ locale }: { locale: Locale }) {
  const t = await getTranslations('hero');
  const name = owner.displayName[locale];

  const systems = getWorkGrid().length + getArchive().length;
  const years = new Date().getFullYear() - owner.since;

  return (
    <section className="relative isolate overflow-hidden">
      {/* ---- backdrop ---------------------------------------------------- */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-30"
        style={{
          background:
            'radial-gradient(120% 80% at 50% -20%, var(--scene-2) 0%, var(--canvas) 60%, var(--canvas) 100%)',
        }}
      />
      <div aria-hidden className="aurora -z-20" />
      {/*
        Engineering grid. Masked to a soft ellipse so it never reaches an edge
        and turns into a visible seam against the next section.
      */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-20 opacity-[0.35]"
        style={{
          backgroundImage:
            'linear-gradient(to right, var(--line) 1px, transparent 1px), linear-gradient(to bottom, var(--line) 1px, transparent 1px)',
          backgroundSize: '64px 64px',
          maskImage: 'radial-gradient(70% 60% at 50% 30%, #000 0%, transparent 100%)',
          WebkitMaskImage: 'radial-gradient(70% 60% at 50% 30%, #000 0%, transparent 100%)',
        }}
      />

      <div className="container-page relative grid min-h-[88svh] items-center gap-12 pt-28 pb-16 lg:grid-cols-[1.1fr_0.9fr] lg:gap-20 lg:pt-32 lg:pb-20">
        {/* ---- text ------------------------------------------------------ */}
        <div className="max-w-2xl">
          {/* Compact portrait for the narrow layout, where the tall one below
              would push the name and the buttons off the first screen. */}
          <HeroFade className="mb-7 lg:hidden">
            <div className="size-20 overflow-hidden rounded-full border border-line shadow-soft">
              <Portrait variant="avatar" sizes="80px" alt={t('portraitAlt')} priority />
            </div>
          </HeroFade>

          {/*
            The line above the name says what the entity is, not what it is
            looking for. A registered company describing itself as available
            for roles is the single fastest way to lose a platform reviewer
            comparing this page against a commercial registration certificate.
          */}
          <HeroFade className="mb-6">
            <p className="flex items-center gap-2.5 text-sm font-medium text-ink-muted">
              <StatusDot tone="live" />
              {t('entity')}
            </p>
          </HeroFade>

          {/* Latin splits per character; Arabic cannot — see HeroName. */}
          <HeroName first={name.first} last={name.last} perCharacter={locale !== 'ar'} />

          <HeroFade delay={0.55} className="mt-7">
            <div className="flex items-center gap-4">
              <span aria-hidden className="h-px w-10 bg-line-strong" />
              <p className="text-base font-medium tracking-tight text-ink sm:text-lg">
                {t('role')} <span className="text-ink-subtle">·</span>{' '}
                <span className="font-normal text-ink-muted">{owner.location[locale]}</span>
              </p>
            </div>
          </HeroFade>

          <HeroFade delay={0.65} className="mt-5">
            <p className="max-w-xl text-lg leading-relaxed text-ink-muted">{t('tagline')}</p>
          </HeroFade>

          <HeroFade delay={0.75} className="mt-8">
            <div className="flex flex-wrap items-center gap-3">
              <ButtonLink href="/work" size="lg">
                {t('ctaWork')}
              </ButtonLink>
              <CvDownloadButton size="lg">{t('ctaCv')}</CvDownloadButton>
            </div>
          </HeroFade>

          <HeroFade delay={0.85} className="mt-8">
            <p className="nums text-xs tracking-wide text-ink-subtle">{t('stack')}</p>
          </HeroFade>
        </div>

        {/* ---- photograph ------------------------------------------------- */}
        <div className="relative hidden justify-self-center lg:block lg:justify-self-end">
          <HeroPortrait>
            <div
              aria-hidden
              className="absolute -inset-8 -z-10 rounded-[4rem] blur-3xl"
              style={{
                background:
                  'radial-gradient(55% 55% at 50% 35%, var(--aurora-1), transparent 72%), radial-gradient(45% 45% at 70% 80%, var(--aurora-2), transparent 70%)',
              }}
            />

            <div className="panel panel-frame panel-deep relative aspect-[4/5] overflow-hidden">
              <Portrait
                variant="portrait"
                sizes="(min-width: 1024px) 24rem, 0px"
                alt={t('portraitAlt')}
                priority
              />
              {/* Light vignette so the frame's lower edge stays defined against
                  a bright sky rather than dissolving into the page. */}
              <div
                aria-hidden
                className="absolute inset-x-0 bottom-0 h-1/3"
                style={{ background: 'linear-gradient(to top, rgb(0 0 0 / 0.28), transparent)' }}
              />
            </div>

            {/* Evidence, floated off the frame's edge so the card reads as an
                object with something in front of it rather than a flat crop. */}
            <HeroFade delay={0.9} className="absolute -start-6 -bottom-6">
              <div className="glass rounded-panel px-5 py-4 shadow-lift">
                <dl className="flex items-center gap-5">
                  <div>
                    <dd className="nums text-2xl font-semibold text-ink">{systems}+</dd>
                    <dt className="mt-0.5 text-[11px] text-ink-muted">{t('statSystems')}</dt>
                  </div>
                  <span aria-hidden className="h-9 w-px bg-line" />
                  <div>
                    <dd className="nums text-2xl font-semibold text-ink">{years}</dd>
                    <dt className="mt-0.5 text-[11px] text-ink-muted">{t('statYears')}</dt>
                  </div>
                </dl>
              </div>
            </HeroFade>
          </HeroPortrait>
        </div>
      </div>
    </section>
  );
}
