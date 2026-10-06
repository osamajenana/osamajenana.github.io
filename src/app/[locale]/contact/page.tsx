import type { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';

import { ContactForm } from '@/components/contact/ContactForm';
import { PageHeader } from '@/components/layout/PageHeader';
import { owner, socials } from '@/content/site';
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
    ...(socials.linkedin
      ? [
          {
            label: 'LinkedIn',
            // The address as a reader would type it: no scheme, no trailing slash.
            value: socials.linkedin.replace(/^https?:\/\/(www\.)?/, '').replace(/\/$/, ''),
            href: socials.linkedin,
            external: true,
          },
        ]
      : []),
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
                {/*
                  All three values are Latin-script identifiers, so they are
                  isolated to LTR rather than left to inherit the page's
                  direction — otherwise the Arabic page lays the phone number's
                  groups out right to left and shows a different number.
                */}
                <a
                  href={item.href}
                  {...(item.external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                  dir="ltr"
                  className="mt-1 inline-block text-sm text-ink hover:text-brand"
                >
                  {item.value}
                </a>
              </li>
            ))}
          </ul>

          <p className="rounded-card border border-line bg-raised p-4 text-sm leading-relaxed text-ink-muted">
            {owner.location[locale]}
          </p>
        </aside>
      </div>
    </main>
  );
}
