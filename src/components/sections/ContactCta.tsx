import { getTranslations } from 'next-intl/server';

import { ButtonAnchor, ButtonLink } from '@/components/ui/Button';
import { owner } from '@/content/site';

export async function ContactCta() {
  const t = await getTranslations('contact');
  const hero = await getTranslations('hero');

  return (
    <section aria-labelledby="cta-heading" className="border-t border-line">
      <div className="container-page py-20 sm:py-28">
        <h2
          id="cta-heading"
          className="max-w-2xl text-display-sm font-semibold tracking-tight text-ink"
        >
          {t('title')}
        </h2>
        <p className="mt-5 max-w-xl text-lg leading-relaxed text-ink-muted">{t('lead')}</p>

        <div className="mt-10 flex flex-wrap items-center gap-3">
          <ButtonLink href="/contact">{t('send')}</ButtonLink>
          <ButtonAnchor href={`https://wa.me/${owner.whatsapp.e164}`} variant="secondary">
            {t('orWhatsapp')}
          </ButtonAnchor>
          <ButtonLink href="/cv" variant="ghost">
            {hero('ctaCv')}
          </ButtonLink>
        </div>
      </div>
    </section>
  );
}
