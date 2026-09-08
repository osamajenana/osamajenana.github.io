import { getTranslations } from 'next-intl/server';

import { Portrait } from '@/components/ui/Portrait';
import { company, cv, legalItems, owner, socials } from '@/content/site';
import { Link } from '@/i18n/navigation';
import type { Locale } from '@/i18n/routing';

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
  const legalRows: { label: string; value: string; href?: string; ltr?: boolean }[] = [
    { label: t('legalName'), value: company.legalName[locale] },
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
                  <a
                    href={`https://wa.me/${owner.whatsapp.e164}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="nums text-sm text-ink-muted transition-colors hover:text-ink"
                  >
                    {owner.whatsapp.display}
                  </a>
                </li>
                <li className="text-sm text-ink-subtle">{owner.location[locale]}</li>
              </ul>
            </div>
          </div>
        </div>

        <hr className="rule-fade my-12" />

        {/* ---- registered entity ---- */}
        <div className="flex flex-col gap-8 lg:flex-row lg:items-start lg:justify-between lg:gap-16">
          <div className="max-w-xl">
            <p className="text-xs text-ink-subtle">
              © {new Date().getFullYear()} {company.legalName[locale]}. {t('rights')}
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
