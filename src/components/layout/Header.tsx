'use client';

import { useTranslations } from 'next-intl';
import { useEffect, useState } from 'react';

import { LocaleSwitch } from '@/components/ui/LocaleSwitch';
import { ThemeToggle } from '@/components/ui/ThemeToggle';
import { owner } from '@/content/site';
import type { NavItem } from '@/content/site';
import { Link, usePathname } from '@/i18n/navigation';
import { cn } from '@/lib/utils';

/**
 * Nav items arrive as a prop rather than being computed here: resolving the
 * blog's content gate needs the post registry, and importing that into a client
 * component would ship every post's bilingual metadata to the browser.
 */
export function Header({ navItems }: { navItems: NavItem[] }) {
  const pathname = usePathname();
  const t = useTranslations('nav');
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // The drawer is closed by the links themselves (onClick below) rather than by
  // an effect watching pathname — the tap is the actual cause, and reacting to
  // the route change instead would mean a synchronous setState in an effect.

  // Lock body scroll while the drawer is open.
  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    // Deferred to the next frame so a restored scroll position is picked up
    // without writing state synchronously during the effect.
    const frame = requestAnimationFrame(onScroll);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener('scroll', onScroll);
    };
  }, []);

  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setOpen(false);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open]);

  const isActive = (href: string) => pathname === href || pathname.startsWith(`${href}/`);

  return (
    <header
      className={cn(
        'fixed inset-x-0 top-0 z-40 transition-[background-color,border-color,backdrop-filter] duration-300 print:hidden',
        scrolled
          ? 'border-b border-line bg-canvas/80 backdrop-blur-xl'
          : 'border-b border-transparent',
      )}
    >
      <div className="container-page flex h-16 items-center justify-between gap-4">
        <Link
          href="/"
          className="text-sm font-semibold tracking-tight text-ink transition-opacity hover:opacity-70"
        >
          {owner.shortName}
        </Link>

        <nav aria-label={t('menu')} className="hidden items-center gap-1 md:flex">
          {navItems.map((item) => (
            <Link
              key={item.key}
              href={item.href}
              aria-current={isActive(item.href) ? 'page' : undefined}
              className={cn(
                'rounded-pill px-3 py-1.5 text-sm transition-colors',
                isActive(item.href)
                  ? 'bg-raised text-ink'
                  : 'text-ink-muted hover:bg-raised hover:text-ink',
              )}
            >
              {t(item.key)}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <LocaleSwitch className="hidden sm:flex" />
          <ThemeToggle />

          <button
            type="button"
            onClick={() => setOpen((value) => !value)}
            aria-expanded={open}
            aria-controls="mobile-nav"
            aria-label={open ? t('closeMenu') : t('menu')}
            className="grid size-9 place-items-center rounded-full border border-line text-ink-muted md:hidden"
          >
            <span className="relative block h-3 w-4">
              <span
                className={cn(
                  'absolute inset-x-0 h-px bg-current transition-transform duration-200',
                  open ? 'top-1/2 rotate-45' : 'top-0',
                )}
              />
              <span
                className={cn(
                  'absolute inset-x-0 bottom-0 h-px bg-current transition-transform duration-200',
                  open ? 'bottom-1/2 -translate-y-px -rotate-45' : '',
                )}
              />
            </span>
          </button>
        </div>
      </div>

      {/* Mobile drawer. Kept in the DOM but inert when closed so the open/close
          transition can animate; aria-hidden keeps it out of the a11y tree. */}
      <div
        id="mobile-nav"
        aria-hidden={!open}
        className={cn(
          'overflow-hidden border-line bg-canvas/95 backdrop-blur-xl transition-[max-height,opacity] duration-300 md:hidden',
          open ? 'max-h-96 border-b opacity-100' : 'pointer-events-none max-h-0 opacity-0',
        )}
      >
        <nav className="container-page flex flex-col gap-1 py-4" aria-label={t('menu')}>
          {navItems.map((item) => (
            <Link
              key={item.key}
              href={item.href}
              onClick={() => setOpen(false)}
              tabIndex={open ? undefined : -1}
              aria-current={isActive(item.href) ? 'page' : undefined}
              className={cn(
                'rounded-card px-3 py-2.5 text-base transition-colors',
                isActive(item.href) ? 'bg-raised text-ink' : 'text-ink-muted',
              )}
            >
              {t(item.key)}
            </Link>
          ))}
          <LocaleSwitch className="mt-2 self-start sm:hidden" />
        </nav>
      </div>
    </header>
  );
}
