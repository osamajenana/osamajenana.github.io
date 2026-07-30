import type { Locale } from '@/i18n/routing';
import type { ProjectImage } from '@/lib/schemas';
import { cn } from '@/lib/utils';

/**
 * A project screenshot inside a CSS browser frame.
 *
 * The frame is markup rather than part of the image, so it stays crisp at any
 * size, follows the theme, and shows the real live domain — which is the point:
 * it says "this is running in production", not "here is a picture".
 *
 * `next/image` is deliberately not used. scripts/process-shots.mjs already
 * normalises every capture to one size and emits an AVIF/WebP pair, so there is
 * nothing left to optimise at request time — and serving the files statically
 * costs the VPS no CPU and needs no optimizer cache.
 */
export function ProjectCover({
  cover,
  locale,
  domain,
  priority = false,
  className,
}: {
  cover: ProjectImage;
  locale: Locale;
  /** Rendered in the frame's address bar. Omitted for unnamed clients. */
  domain?: string;
  /** Set on the first cover above the fold so it is not lazy-loaded. */
  priority?: boolean;
  className?: string;
}) {
  return (
    <figure className={cn('overflow-hidden rounded-card border border-line bg-raised', className)}>
      <div className="flex items-center gap-2 border-b border-line px-3 py-2">
        <span aria-hidden className="flex gap-1.5">
          <span className="size-2 rounded-full bg-line-strong" />
          <span className="size-2 rounded-full bg-line-strong" />
          <span className="size-2 rounded-full bg-line-strong" />
        </span>
        {domain && (
          <span className="truncate font-mono text-[10px] text-ink-subtle" dir="ltr">
            {domain}
          </span>
        )}
      </div>

      <picture>
        <source srcSet={srcSetFor(cover.src, 'avif')} sizes={SIZES} type="image/avif" />
        <source srcSet={srcSetFor(cover.src, 'webp')} sizes={SIZES} type="image/webp" />
        <img
          src={`${cover.src}.webp`}
          srcSet={srcSetFor(cover.src, 'webp')}
          sizes={SIZES}
          alt={cover.alt[locale]}
          width={cover.width}
          height={cover.height}
          loading={priority ? 'eager' : 'lazy'}
          fetchPriority={priority ? 'high' : 'auto'}
          decoding={priority ? 'sync' : 'async'}
          // Explicit dimensions plus aspect-ratio: the box is reserved before
          // the bytes arrive, so a loading cover cannot shift the grid.
          className="block h-auto w-full"
          style={{ aspectRatio: `${cover.width} / ${cover.height}` }}
        />
      </picture>
    </figure>
  );
}

/**
 * Cards sit in a two-column grid inside a 76rem container, so they land near
 * 45vw from the `sm` breakpoint up and fill the gutter-inset width below it.
 * Getting this wrong is worse than omitting it — the browser would pick the
 * 1440w file for a 330px slot.
 */
const SIZES = '(min-width: 640px) 45vw, 92vw';

/** scripts/process-shots.mjs writes `cover-720.*` alongside the full `cover.*`. */
function srcSetFor(base: string, format: 'avif' | 'webp'): string {
  return `${base}-720.${format} 720w, ${base}.${format} 1440w`;
}

/** `https://rekan.om` → `rekan.om`. */
export function domainOf(url: string | undefined): string | undefined {
  if (!url) return undefined;
  try {
    return new URL(url).host.replace(/^www\./, '');
  } catch {
    return undefined;
  }
}
