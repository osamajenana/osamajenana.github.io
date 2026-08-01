import type { ComponentPropsWithoutRef, ReactNode } from 'react';

import { cv } from '@/content/site';
import { Link } from '@/i18n/navigation';
import { cn } from '@/lib/utils';

type Variant = 'primary' | 'secondary' | 'ghost';
type Size = 'sm' | 'md' | 'lg';

/**
 * `transform` is in the transition list and every variant lifts on hover — a
 * control that answers the pointer with depth is most of what separates a
 * designed page from a styled document.
 */
const base =
  'relative inline-flex items-center justify-center gap-2 rounded-pill font-medium whitespace-nowrap transition-[background-color,border-color,color,transform,box-shadow] duration-300 ease-[var(--ease-out-quart)] hover:-translate-y-0.5 active:translate-y-0 disabled:pointer-events-none disabled:opacity-50 disabled:hover:translate-y-0';

const variants: Record<Variant, string> = {
  primary:
    'bg-brand text-on-brand shadow-soft hover:bg-brand-strong hover:shadow-lift disabled:hover:shadow-soft',
  secondary:
    'border border-line bg-surface text-ink shadow-sm hover:border-line-strong hover:bg-raised hover:shadow-soft',
  ghost: 'text-ink-muted hover:bg-raised hover:text-ink',
};

const sizes: Record<Size, string> = {
  sm: 'px-4 py-2 text-sm',
  md: 'px-6 py-3 text-sm',
  lg: 'px-7 py-3.5 text-base',
};

function classes(variant: Variant, size: Size, className?: string) {
  return cn(base, variants[variant], sizes[size], className);
}

type SharedProps = {
  variant?: Variant;
  size?: Size;
  className?: string;
  children: ReactNode;
};

/** Internal navigation — locale-aware via next-intl's Link. */
export function ButtonLink({
  href,
  variant = 'primary',
  size = 'md',
  className,
  children,
}: SharedProps & { href: string }) {
  return (
    <Link href={href} className={classes(variant, size, className)}>
      {children}
    </Link>
  );
}

/** External navigation — always gets noopener/noreferrer. */
export function ButtonAnchor({
  href,
  variant = 'secondary',
  size = 'md',
  className,
  children,
  ...rest
}: SharedProps & ComponentPropsWithoutRef<'a'>) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={classes(variant, size, className)}
      {...rest}
    >
      {children}
    </a>
  );
}

/**
 * The CV download.
 *
 * Points at the designed PDF in public/ and carries `download`, so the file is
 * saved under a sensible name instead of opening in the browser's viewer. It is
 * its own component so that no caller has to remember either of those things —
 * a "Download CV" button that previews a generated stand-in is the bug this
 * exists to prevent.
 */
export function CvDownloadButton({
  variant = 'secondary',
  size = 'md',
  className,
  children,
}: SharedProps) {
  return (
    <a href={cv.file} download={cv.downloadName} className={classes(variant, size, className)}>
      {children}
    </a>
  );
}

export function Button({
  variant = 'primary',
  size = 'md',
  className,
  children,
  ...rest
}: SharedProps & ComponentPropsWithoutRef<'button'>) {
  return (
    <button className={classes(variant, size, className)} {...rest}>
      {children}
    </button>
  );
}
