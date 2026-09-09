import { getTranslations } from 'next-intl/server';
import type { ReactNode } from 'react';

import { Portrait } from '@/components/ui/Portrait';
import { company, cv, legalItems, owner, socials } from '@/content/site';
import { Link } from '@/i18n/navigation';
import { directionOf, type Locale } from '@/i18n/routing';

/**
 * A run of text in a script other than the page's, isolated from it.
 *
 * An Arabic string dropped into an LTR paragraph — or a Latin one into an RTL
 * paragraph — inherits the surrounding direction and drags the punctuation
 * around it to the wrong side. `dir` on an inline element makes the run a bidi
 * isolate, so it lays out on its own terms and the brackets and full stops
 * beside it stay where the reader expects. `lang` is what a screen reader
 * switches voices on.
 */
function Script({ locale, children }: { locale: Locale; children: ReactNode }) {
  return (
    <span lang={locale} dir={directionOf(locale)}>
      {children}
    </span>
  );
}

/**
 * The registered name in both scripts, the page's own first.
 *
 * Meta's Business Verification looks for the name exactly as it is written on
 * the commercial registration certificate, and that document is in Arabic —
 * but English is this site's default locale, so a reviewer following the
 * submitted URL lands somewhere the Arabic name never appeared. Publishing
 * only the translation is indistinguishable, to that reviewer, from not
 * publishing the name at all.
 *
 * Both forms are therefore rendered as real text in both locales, server-side,
 * with nothing assembled on the client and nothing hidden: a crawler that does
 * not run JavaScript finds them in the markup, and a human finds them in the
 * footer.
 */
function LegalName({ locale }: { locale: Locale }) {
  const other: Locale = locale === 'ar' ? 'en' : 'ar';

  return (
    <>
      <Script locale={locale}>{company.legalName[locale]}</Script> (
      <Script locale={other}>{company.legalName[other]}</Script>)
    </>
  );
}

export async function Footer({ locale }: { locale: Locale }) {
  const t = await getTranslations('footer');
  const nav = await getTranslations('nav');
  const hero = await getTranslations('hero');

  const external = [
    { label: 'GitHub', href: socials.github },
    { label: 'X', href: socials.x },
    ...(socials.linkedin ? [{ label: 'LinkedIn', href: socials.linkedin }] : []),
  ];

  const internal = ['platform', 'work', 'about', 'services', 'blog', 'contact'] as const;

  /**
   * The registered-entity block.
   *
   * Meta's Business Verification compares this against the commercial
   * registration certificate line by line, so it is a definition list of the
   * exact values on that document rather than a sentence about the company.
   * Numbers are isolated to LTR: a phone number or a registration number set
   * inside RTL prose otherwise takes its surrounding direction and renders
   * with the wrong digit order.
   */
  const legalRows: { label: string; value: ReactNode; href?: string; ltr?: boolean }[] = [
    { label: t('legalName'), value: <LegalName locale={locale} /> },
    { label: t('address'), value: company.address[locale] },
    { label: t('companyNumber'), value: company.companyNumber, ltr: true },
    { label: t('registrationNumber'), value: company.registrationNumber, ltr: true },
    {
      label: t('phone'),
      value: company.phone.display,
      href: `tel:${company.phone.e164}`,
      ltr: true,
    },
    { label: t('email'), value: company.email, href: `mailto:${company.email}`, ltr: true },
  ];

  return (
    <footer className="border-t border-line bg-raised print:hidden" role="contentinfo">
      <div className="container-page py-16 sm:py-20">
        <div className="flex flex-col gap-12 lg:flex-row lg:justify-between lg:gap-16">
          {/* ---- identity ---- */}
          <div className="max-w-sm">
            <div className="flex items-center gap-3">
              <span className="size-11 shrink-0 overflow-hidden rounded-full border border-line shadow-sm">
                <Portrait variant="avatar" sizes="44px" alt="" />
              </span>
              <div>
                <p className="text-sm font-semibold tracking-tight text-ink">{owner.fullName}</p>
                <p className="text-xs text-ink-muted">{owner.role[locale]}</p>
              </div>
            </div>

            <p className="mt-5 text-sm leading-relaxed text-ink-muted">{t('builtWith')}</p>

            <a
              href={cv.file}
              download={cv.downloadName}
              className="mt-6 inline-flex items-center gap-2 rounded-pill border border-line bg-surface px-4 py-2 text-sm text-ink shadow-sm transition-[border-color,background-color] hover:border-line-strong hover:bg-raised"
            >
              {hero('ctaCv')}
            </a>
          </div>

          {/* ---- links ---- */}
          <div className="grid grid-cols-2 gap-10 sm:grid-cols-3 lg:gap-16">
            <nav aria-label={nav('menu')}>
              <p className="eyebrow">{nav('menu')}</p>
              <ul className="mt-4 space-y-2.5">
                {internal.map((key) => (
                  <li key={key}>
                    <Link
                      href={`/${key}`}
                      className="text-sm text-ink-muted transition-colors hover:text-ink"
                    >
                      {nav(key)}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>

            <div>
              <p className="eyebrow">{nav('cv')}</p>
              <ul className="mt-4 space-y-2.5">
                <li>
                  <Link
                    href="/cv"
                    className="text-sm text-ink-muted transition-colors hover:text-ink"
                  >
                    {nav('cv')}
                  </Link>
                </li>
                {external.map((link) => (
                  <li key={link.label}>
                    <a
                      href={link.href}
                      target="_blank"
                      rel="noopener noreferrer me"
                      className="text-sm text-ink-muted transition-colors hover:text-ink"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            <div className="col-span-2 sm:col-span-1">
              <p className="eyebrow">{nav('contact')}</p>
              <ul className="mt-4 space-y-2.5">
                <li>
                  <a
                    href={`mailto:${owner.email}`}
                    className="text-sm break-all text-ink-muted transition-colors hover:text-ink"
                  >
                    {owner.email}
                  </a>
                </li>
                <li>
                  {/*
                    Isolated to LTR for the same reason the legal block below
                    is: an RTL page lays the space-separated groups of a phone
                    number out right to left, so the same number would read
                    "3278 290 59 970+" here and "+970 59 290 3278" eight lines
                    down — which is the discrepancy this column exists to stop.
                  */}
                  <a
                    href={`https://wa.me/${owner.whatsapp.e164}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    dir="ltr"
                    className="nums text-sm text-ink-muted transition-colors hover:text-ink"
                  >
                    {owner.whatsapp.display}
                  </a>
                </li>
                {/*
                  The full registered address, not the short locality — this
                  column and the legal block below it are read as one, and two
                  different addresses for one company reads as a discrepancy.
                */}
                <li className="text-sm text-ink-subtle">{company.address[locale]}</li>
              </ul>
            </div>
          </div>
        </div>

        <hr className="rule-fade my-12" />

        {/* ---- registered entity ---- */}
        <div className="flex flex-col gap-8 lg:flex-row lg:items-start lg:justify-between lg:gap-16">
          <div className="max-w-xl">
            {/*
              Both scripts, English first in either locale. The copyright line
              is the one string a reviewer reads without looking for it, so it
              carries the same pair as the legal-name row above rather than
              whichever half matches the current language.
            */}
            <p className="text-xs text-ink-subtle">
              © {new Date().getFullYear()} <Script locale="en">{company.legalName.en}</Script> —{' '}
              <Script locale="ar">{company.legalName.ar}</Script>. {t('rights')}
            </p>

            <dl className="mt-5 grid gap-x-5 gap-y-1.5 text-xs leading-relaxed text-ink-subtle sm:grid-cols-[9.5rem_minmax(0,1fr)]">
              {legalRows.map((row) => (
                <div key={row.label} className="contents">
                  <dt className="text-ink-muted">{row.label}</dt>
                  <dd className={row.ltr ? 'nums' : undefined} dir={row.ltr ? 'ltr' : undefined}>
                    {row.href ? (
                      <a href={row.href} className="break-all transition-colors hover:text-ink">
                        {row.value}
                      </a>
                    ) : (
                      row.value
                    )}
                  </dd>
                </div>
              ))}
            </dl>
          </div>

          <nav aria-label={t('legal')} className="shrink-0">
            <p className="eyebrow mb-4">{t('legal')}</p>
            <ul className="space-y-2.5">
              {legalItems.map((item) => (
                <li key={item.key}>
                  <Link
                    href={item.href}
                    className="text-xs text-ink-subtle transition-colors hover:text-ink"
                  >
                    {t(item.key)}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </div>
    </footer>
  );
}
