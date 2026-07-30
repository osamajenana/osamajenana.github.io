'use client';

import { useLocale, useTranslations } from 'next-intl';

import { Link, usePathname } from '@/i18n/navigation';
import { routing } from '@/i18n/routing';
import { cn } from '@/lib/utils';

/**
 * Switches locale while staying on the current route. `usePathname` from
 * next-intl returns the path without the locale prefix, so the same pathname
 * can be re-rendered under the other locale — no redirect to the homepage.
 */
export function LocaleSwitch({ className }: { className?: string }) {
  const pathname = usePathname();
  const active = useLocale();
  const t = useTranslations('locale');

  return (
    <div
      className={cn('flex items-center gap-0.5 rounded-pill border border-line p-0.5', className)}
      role="group"
      aria-label={t('switch')}
    >
      {routing.locales.map((locale) => {
        const isActive = locale === active;
        return (
          <Link
            key={locale}
            // pathname already has dynamic segments resolved and the locale
            // prefix stripped, so it can be re-rendered under the other locale.
            href={pathname}
            locale={locale}
            hrefLang={locale}
            aria-current={isActive ? 'true' : undefined}
            className={cn(
              'rounded-pill px-2.5 py-1 text-xs font-medium transition-colors',
              isActive ? 'bg-raised text-ink' : 'text-ink-subtle hover:text-ink',
            )}
          >
            {t(locale)}
          </Link>
        );
      })}
    </div>
  );
}
