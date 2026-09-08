'use client';

import { useLocale, useTranslations } from 'next-intl';
import { useEffect, useState } from 'react';

import { LocaleSwitch } from '@/components/ui/LocaleSwitch';
import { Portrait } from '@/components/ui/Portrait';
import { ThemeToggle } from '@/components/ui/ThemeToggle';
import { cv, owner } from '@/content/site';
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
  const locale = useLocale();
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
        'fixed inset-x-0 top-0 z-40 transition-[background-color,border-color,backdrop-filter,box-shadow] duration-300 print:hidden',
        scrolled
          ? 'border-b border-line bg-canvas/70 shadow-sm backdrop-blur-xl backdrop-saturate-150'
          : 'border-b border-transparent',
      )}
    >
      <div className="container-page flex h-18 items-center justify-between gap-4">
        {/* The face beside the name. A portfolio's masthead is the one place a
            wordmark is worse than a person. */}
        <Link
          href="/"
          className="group flex items-center gap-2.5 transition-opacity hover:opacity-80"
        >
          <span className="size-8 shrink-0 overflow-hidden rounded-full border border-line shadow-sm">
            <Portrait variant="avatar" sizes="32px" alt="" />
          </span>
          {/* The Arabic page should say the name in Arabic — a Latin wordmark
              in an RTL masthead reads as an untranslated leftover. */}
          <span className="text-sm font-semibold tracking-tight text-ink">
            {locale === 'ar'
              ? `${owner.displayName.ar.first} ${owner.displayName.ar.last}`
              : owner.shortName}
          </span>
        </Link>

        {/*
          The nav sits in its own bordered track rather than floating loose in
          the bar — it gives the active pill something to be inset into, which is
          what makes the current page read as selected rather than merely tinted.

          It appears at `lg`, not `md`. Six pills plus the wordmark plus the
          language and theme controls measure ~795px, and a 768px viewport has
          728px of gutter-inset room — so at `md` the bar overflowed and the
          page scrolled sideways. The drawer covers that band instead. Anything
          added to `navItems` has to be re-measured against this.
        */}
        <nav
          aria-label={t('menu')}
          className="hidden items-center gap-0.5 rounded-pill border border-line bg-surface/60 p-1 shadow-sm backdrop-blur lg:flex"
        >
          {navItems.map((item) => (
            <Link
              key={item.key}
              href={item.href}
              aria-current={isActive(item.href) ? 'page' : undefined}
              className={cn(
                'rounded-pill px-3.5 py-1.5 text-sm transition-colors duration-200',
                isActive(item.href)
                  ? 'bg-raised font-medium text-ink shadow-sm'
                  : 'text-ink-muted hover:bg-raised/70 hover:text-ink',
              )}
            >
              {t(item.key)}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          {/*
            Always visible, at every width. Burying the language switch behind a
            hamburger is the wrong trade on a site whose Arabic readers may not
            realise there is an Arabic version — it has to be one tap, not two.
          */}
          <LocaleSwitch />
          <ThemeToggle />

          {/* The CV is the single most-requested thing on a portfolio; it does
              not belong two clicks deep behind a page. */}
          <a
            href={cv.file}
            download={cv.downloadName}
            className="hidden rounded-pill border border-line bg-surface px-3.5 py-1.5 text-sm text-ink shadow-sm transition-[border-color,background-color] hover:border-line-strong hover:bg-raised lg:inline-flex"
          >
            {t('cv')}
          </a>

          <button
            type="button"
            onClick={() => setOpen((value) => !value)}
            aria-expanded={open}
            aria-controls="mobile-nav"
            aria-label={open ? t('closeMenu') : t('menu')}
            className="grid size-9 place-items-center rounded-full border border-line text-ink-muted lg:hidden"
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
      {/*
        `inert` rather than aria-hidden: aria-hidden alone leaves the links
        focusable, which is itself a violation (aria-hidden-focus) and lets a
        keyboard user tab into an invisible menu. inert removes the subtree from
        both the focus order and the accessibility tree in one attribute.
      */}
      <div
        id="mobile-nav"
        inert={!open}
        className={cn(
          'overflow-hidden border-line bg-canvas/95 backdrop-blur-xl transition-[max-height,opacity] duration-300 lg:hidden',
          open ? 'max-h-[32rem] border-b opacity-100' : 'pointer-events-none max-h-0 opacity-0',
        )}
      >
        <nav className="container-page flex flex-col gap-1 py-4" aria-label={t('menu')}>
          {navItems.map((item) => (
            <Link
              key={item.key}
              href={item.href}
              onClick={() => setOpen(false)}
              aria-current={isActive(item.href) ? 'page' : undefined}
              className={cn(
                'rounded-card px-3 py-2.5 text-base transition-colors',
                isActive(item.href)
                  ? 'bg-raised font-medium text-ink'
                  : 'text-ink-muted hover:bg-raised hover:text-ink',
              )}
            >
              {t(item.key)}
            </Link>
          ))}

          <a
            href={cv.file}
            download={cv.downloadName}
            onClick={() => setOpen(false)}
            className="mt-2 rounded-card border border-line bg-surface px-3 py-2.5 text-base text-ink"
          >
            {t('cv')}
          </a>
        </nav>
      </div>
    </header>
  );
}
