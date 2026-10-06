import { getTranslations } from 'next-intl/server';

import { ButtonAnchor, ButtonLink, CvDownloadButton } from '@/components/ui/Button';
import { Reveal } from '@/components/ui/Reveal';
import { owner } from '@/content/site';

/**
 * The closing panel. Deliberately the only full-bleed tinted block on the page:
 * after six sections of the same canvas, a change of surface is what signals
 * "this is the end and here is the thing to do".
 */
export async function ContactCta() {
  const t = await getTranslations('contact');
  const hero = await getTranslations('hero');

  return (
    <section aria-labelledby="cta-heading" className="border-t border-line">
      <div className="container-page py-20 sm:py-28">
        <Reveal>
          <div className="panel panel-frame relative overflow-hidden p-10 sm:p-14 lg:p-20">
            <div aria-hidden className="aurora" />

            <div className="relative max-w-2xl">
              <h2 id="cta-heading" className="display-title text-display-sm text-ink">
                {t('title')}
              </h2>
              <p className="mt-5 text-lg leading-relaxed text-ink-muted">{t('lead')}</p>

              <div className="mt-10 flex flex-wrap items-center gap-3">
                <ButtonLink href="/contact" size="lg">
                  {t('send')}
                </ButtonLink>
                <ButtonAnchor
                  href={`https://wa.me/${owner.whatsapp.e164}`}
                  variant="secondary"
                  size="lg"
                >
                  {t('orWhatsapp')}
                </ButtonAnchor>
                <CvDownloadButton variant="ghost" size="lg">
                  {hero('ctaCv')}
                </CvDownloadButton>
              </div>

              <p className="mt-8 font-mono text-xs text-ink-subtle">
                <a href={`mailto:${owner.email}`} className="hover:text-ink">
                  {owner.email}
                </a>
                <span className="mx-2">·</span>
                <span className="nums">{owner.whatsapp.display}</span>
              </p>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
