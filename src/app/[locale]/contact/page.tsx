import type { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';

import { ContactForm } from '@/components/contact/ContactForm';
import { PageHeader } from '@/components/layout/PageHeader';
import { company, owner, socials } from '@/content/site';
import type { Locale } from '@/i18n/routing';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'contact' });

  return {
    title: t('title'),
    description: t('lead'),
    alternates: {
      canonical: `/${locale}/contact`,
      languages: { en: '/en/contact', ar: '/ar/contact' },
    },
  };
}

export default async function ContactPage({ params }: { params: Promise<{ locale: Locale }> }) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations('contact');

  const direct = [
    { label: t('orEmail'), value: owner.email, href: `mailto:${owner.email}` },
    {
      label: t('orWhatsapp'),
      value: owner.whatsapp.display,
      href: `https://wa.me/${owner.whatsapp.e164}`,
      external: true,
    },
    { label: 'GitHub', value: 'github.com/osamajenana', href: socials.github, external: true },
  ];

  return (
    <main id="main">
      <PageHeader title={t('title')} lead={t('lead')} />

      <div className="container-page grid gap-14 pb-24 lg:grid-cols-[minmax(0,1fr)_20rem] lg:gap-20">
        <ContactForm />

        <aside className="space-y-8">
          <ul className="space-y-5">
            {direct.map((item) => (
              <li key={item.label}>
                <p className="font-mono text-xs tracking-widest text-ink-subtle uppercase">
                  {item.label}
                </p>
                <a
                  href={item.href}
                  {...(item.external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                  className="mt-1 inline-block text-sm text-ink hover:text-brand"
                >
                  {item.value}
                </a>
              </li>
            ))}
          </ul>

          {/*
            The registered office, in full and verbatim from the commercial
            registration certificate — not a "remote, worldwide" line. This is
            the address a platform reviewer, a client's legal team and a
            courier all need, and all three need the same one.
          */}
          <address className="rounded-card border border-line bg-raised p-4 text-sm leading-relaxed text-ink-muted not-italic">
            <p className="font-mono text-xs tracking-widest text-ink-subtle uppercase">
              {t('office')}
            </p>
            <p className="mt-2 font-medium text-ink">{company.legalName[locale]}</p>
            <p className="mt-1">{company.address[locale]}</p>
            <p className="mt-3">
              <a
                href={`tel:${company.phone.e164}`}
                dir="ltr"
                className="nums inline-block transition-colors hover:text-ink"
              >
                {company.phone.display}
              </a>
            </p>
          </address>

          <p className="text-sm leading-relaxed text-ink-subtle">{t('officeNote')}</p>
        </aside>
      </div>
    </main>
  );
}
