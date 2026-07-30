'use client';

import { useTranslations } from 'next-intl';
import { useTheme } from 'next-themes';

import { cn } from '@/lib/utils';

/**
 * Icon visibility is driven entirely by CSS reading `[data-theme]` off <html>,
 * which next-themes stamps in a blocking inline script before first paint.
 *
 * That avoids the usual `mounted` state guard: there is no hydration mismatch
 * to dodge because the server renders both icons and the browser decides which
 * one is visible without React involvement. `useTheme` is only read inside the
 * click handler, where the resolved value is always available.
 */
export function ThemeToggle({ className }: { className?: string }) {
  const { resolvedTheme, setTheme } = useTheme();
  const t = useTranslations('theme');

  return (
    <button
      type="button"
      onClick={() => setTheme(resolvedTheme === 'dark' ? 'light' : 'dark')}
      aria-label={t('toggle')}
      className={cn(
        'grid size-9 place-items-center rounded-full border border-line text-ink-muted transition-colors hover:border-line-strong hover:text-ink',
        className,
      )}
    >
      {/* Both icons are rendered; only one is visible per theme, so the button
          never resizes and there is nothing to animate on mount. */}
      <span className="relative block size-4">
        <SunIcon className="absolute inset-0 dark:hidden" />
        <MoonIcon className="absolute inset-0 hidden dark:block" />
      </span>
    </button>
  );
}

function SunIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 16 16"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.4"
      strokeLinecap="round"
      aria-hidden
    >
      <circle cx="8" cy="8" r="3.1" />
      <path d="M8 1v1.6M8 13.4V15M1 8h1.6M13.4 8H15M3.05 3.05l1.13 1.13M11.82 11.82l1.13 1.13M12.95 3.05l-1.13 1.13M4.18 11.82l-1.13 1.13" />
    </svg>
  );
}

function MoonIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 16 16"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.4"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d="M13.5 9.6A5.9 5.9 0 0 1 6.4 2.5a5.9 5.9 0 1 0 7.1 7.1Z" />
    </svg>
  );
}
