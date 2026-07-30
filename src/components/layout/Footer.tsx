import { getTranslations } from 'next-intl/server';

import { owner, socials } from '@/content/site';
import { Link } from '@/i18n/navigation';

export async function Footer() {
  const t = await getTranslations('footer');
  const nav = await getTranslations('nav');

  const links = [
    { label: 'GitHub', href: socials.github },
    { label: 'X', href: socials.x },
    ...(socials.linkedin ? [{ label: 'LinkedIn', href: socials.linkedin }] : []),
  ];

  return (
    <footer className="border-t border-line print:hidden" role="contentinfo">
      <div className="container-page flex flex-col gap-8 py-12 sm:flex-row sm:items-start sm:justify-between">
        <div className="space-y-2">
          <p className="text-sm text-ink">
            © {new Date().getFullYear()} {owner.fullName}. {t('rights')}
          </p>
          <p className="text-xs text-ink-subtle">{t('builtWith')}</p>
        </div>

        <div className="flex flex-col gap-4 sm:items-end">
          <nav aria-label={nav('menu')} className="flex flex-wrap gap-x-5 gap-y-2">
            <Link href="/work" className="text-sm text-ink-muted hover:text-ink">
              {nav('work')}
            </Link>
            <Link href="/about" className="text-sm text-ink-muted hover:text-ink">
              {nav('about')}
            </Link>
            <Link href="/cv" className="text-sm text-ink-muted hover:text-ink">
              {nav('cv')}
            </Link>
            <Link href="/contact" className="text-sm text-ink-muted hover:text-ink">
              {nav('contact')}
            </Link>
          </nav>

          <div className="flex flex-wrap gap-x-5 gap-y-2">
            {links.map((link) => (
              <a
                key={link.label}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer me"
                className="font-mono text-xs text-ink-subtle hover:text-ink"
              >
                {link.label}
              </a>
            ))}
            <a
              href={`mailto:${owner.email}`}
              className="font-mono text-xs text-ink-subtle hover:text-ink"
            >
              {owner.email}
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
