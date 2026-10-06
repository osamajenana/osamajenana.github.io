import { getTranslations } from 'next-intl/server';

import { Portrait } from '@/components/ui/Portrait';
import { cv, owner, ownerName, socials } from '@/content/site';
import { Link } from '@/i18n/navigation';
import { directionOf, type Locale } from '@/i18n/routing';

export async function Footer({ locale }: { locale: Locale }) {
  const t = await getTranslations('footer');
  const nav = await getTranslations('nav');
  const hero = await getTranslations('hero');
  const otherScript: Locale = locale === 'ar' ? 'en' : 'ar';

  const external = [
    { label: 'GitHub', href: socials.github },
    { label: 'X', href: socials.x },
    ...(socials.linkedin ? [{ label: 'LinkedIn', href: socials.linkedin }] : []),
  ];

  // `expertise` is here and not in the header: the bar has no room for a sixth
  // item, and this is the list a crawler reads on every route.
  const internal = ['work', 'about', 'services', 'expertise', 'blog', 'contact'] as const;

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
                {/*
                  The full name in both scripts, the page's own first. The hero
                  makes the same pairing but only on the home page; this is the
                  one that is on every route, so a link to a case study or the
                  CV still tells its reader how the name is written in Arabic.
                  `dir` on the second form isolates it, which keeps the
                  separator on the correct side of an opposite-direction run.
                */}
                <p className="text-sm font-semibold tracking-tight text-ink">
                  {ownerName.full[locale]}
                  <span className="font-normal text-ink-subtle"> · </span>
                  <span
                    lang={otherScript}
                    dir={directionOf(otherScript)}
                    className="font-arabic font-normal text-ink-muted"
                  >
                    {ownerName.full[otherScript]}
                  </span>
                </p>
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
                    Isolated to LTR: left to inherit the page's direction, an
                    RTL page lays the space-separated groups of a phone number
                    out right to left and the number reads "3278 290 59 972+".
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
                <li className="text-sm text-ink-subtle">{owner.location[locale]}</li>
              </ul>
            </div>
          </div>
        </div>

        <hr className="rule-fade my-12" />

        <p className="text-xs text-ink-subtle">
          © {new Date().getFullYear()} {owner.fullName}. {t('rights')}
        </p>
      </div>
    </footer>
  );
}
