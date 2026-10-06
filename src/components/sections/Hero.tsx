import { getTranslations } from 'next-intl/server';

import { HeroFade } from '@/components/sections/HeroFade';
import { HeroName } from '@/components/sections/HeroName';
import { HeroPortrait } from '@/components/sections/HeroPortrait';
import { BookingButton } from '@/components/ui/BookingButton';
import { ButtonLink, CvDownloadButton } from '@/components/ui/Button';
import { Portrait } from '@/components/ui/Portrait';
import { StatusDot } from '@/components/ui/Tag';
import { owner, ownerName } from '@/content/site';
import { directionOf, type Locale } from '@/i18n/routing';

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
  const otherScript: Locale = locale === 'ar' ? 'en' : 'ar';

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

          <HeroFade className="mb-6">
            <p className="flex items-center gap-2.5 text-sm font-medium text-ink-muted">
              <StatusDot tone="live" />
              {t('availability')}
            </p>
          </HeroFade>

          {/* Latin splits per character; Arabic cannot — see HeroName. */}
          <HeroName first={name.first} last={name.last} perCharacter={locale !== 'ar'} />

          {/*
            The name once more, in the other script, as real text directly under
            the heading. Neither form can be recovered from the other (see
            `owner.arabicName`), so a reader who is handed only this page, human
            or crawler, is told rather than left to transliterate. The label is
            for whoever is not looking at the layout: a screen reader, or a text
            extractor.
          */}
          <HeroFade delay={0.5} className="mt-4">
            <p className="text-xl text-ink-muted">
              {/* One text node, so the served markup reads as one phrase. */}
              <span className="sr-only">{`${t('otherScriptLabel')} `}</span>
              <span lang={otherScript} dir={directionOf(otherScript)} className="font-arabic">
                {ownerName.short[otherScript]}
              </span>
            </p>
          </HeroFade>

          <HeroFade delay={0.55} className="mt-6">
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
              {/*
                The narrower padding below `sm` is what lets the first two share
                a row on a phone: at full padding they miss by two pixels and
                the group stacks three deep.
              */}
              <ButtonLink href="/work" size="lg" className="max-sm:px-5">
                {t('ctaWork')}
              </ButtonLink>
              <BookingButton size="lg" className="max-sm:px-5" />
              <CvDownloadButton size="lg" className="max-sm:px-5">
                {t('ctaCv')}
              </CvDownloadButton>
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
                    {/* The total shipped, not the count this site documents —
                        see `owner.systemsShipped` for why they differ. */}
                    <dd className="nums text-2xl font-semibold text-ink">
                      {owner.systemsShipped}+
                    </dd>
                    <dt className="mt-0.5 text-[11px] text-ink-muted">{t('statSystems')}</dt>
                  </div>
                  <span aria-hidden className="h-9 w-px bg-line" />
                  <div>
                    <dd className="nums text-2xl font-semibold text-ink">
                      {owner.yearsExperience}
                    </dd>
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
