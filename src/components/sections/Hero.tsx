import { getTranslations } from 'next-intl/server';

import { HeroScene } from '@/components/three/HeroScene';
import { ButtonLink } from '@/components/ui/Button';
import { StatusDot } from '@/components/ui/Tag';
import { owner } from '@/content/site';
import type { Locale } from '@/i18n/routing';

export async function Hero({ locale }: { locale: Locale }) {
  const t = await getTranslations('hero');

  return (
    <section className="relative isolate flex min-h-[92svh] items-center overflow-hidden">
      {/* Backdrop wash. Sits behind everything, including the canvas. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-20"
        style={{
          background:
            'radial-gradient(115% 75% at 50% -10%, var(--scene-2) 0%, var(--canvas) 62%, var(--canvas) 100%)',
        }}
      />

      {/*
        On large screens the scene occupies its own column to the inline-end, so
        node hovering never competes with the heading for pointer events. Below
        that it drops behind the text at reduced opacity and stops accepting
        input, because a pointer-driven 3D graph on a touch screen only steals
        scroll gestures.
      */}
      {/*
        Height is pinned to the viewport rather than the section: the section can
        grow past one screen on short windows, and a scene centred inside that
        taller box would have its lower nodes below the fold.
      */}
      <div className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[100svh] opacity-30 sm:opacity-40 lg:pointer-events-auto lg:start-[44%] lg:end-0 lg:z-0 lg:opacity-100">
        <HeroScene />
      </div>

      <div className="container-page relative z-10 py-28">
        {/* Text alternative for the decorative canvas. */}
        <p className="sr-only">{t('sceneLabel')}</p>

        <div className="lg:max-w-[46%]">
          <p className="mb-7 flex items-center gap-2.5 text-sm font-medium text-ink-muted">
            <StatusDot tone="live" />
            {t('availability')}
          </p>

          <h1 className="text-display font-semibold text-ink">
            {t('line1')}
            <br />
            <span className="text-ink-muted">{t('line2')}</span>
          </h1>

          <div className="mt-9 space-y-1.5">
            <p className="text-lg text-ink">
              {t('role')} <span className="text-ink-subtle">·</span>{' '}
              <span className="text-ink-muted">{owner.location[locale]}</span>
            </p>
            <p className="nums text-sm text-ink-subtle">{t('stack')}</p>
          </div>

          <div className="mt-11 flex flex-wrap items-center gap-3">
            <ButtonLink href="/work">{t('ctaWork')}</ButtonLink>
            <ButtonLink href="/cv" variant="secondary">
              {t('ctaCv')}
            </ButtonLink>
          </div>
        </div>
      </div>
    </section>
  );
}
