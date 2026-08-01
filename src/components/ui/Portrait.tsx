import { cn } from '@/lib/utils';

/**
 * The photograph, in the two crops `scripts/make-portrait.mjs` emits.
 *
 * Deliberately a plain <picture> rather than next/image: these files are
 * already the exact crops and widths the layout asks for, so routing them
 * through the optimiser would re-encode a fixed asset on every deploy and hand
 * back the same bytes. AVIF first, WebP second, JPEG as the floor.
 */

const VARIANTS = {
  /** 4:5, head to waist — the hero column. */
  portrait: { widths: [640, 900, 1280], intrinsic: [1900, 2375] },
  /** 1:1, head and shoulders — about page, compact hero, JSON-LD. */
  avatar: { widths: [200, 400, 800], intrinsic: [1500, 1500] },
} as const;

export type PortraitVariant = keyof typeof VARIANTS;

export function Portrait({
  variant = 'portrait',
  sizes,
  alt,
  priority = false,
  className,
}: {
  variant?: PortraitVariant;
  /** Required: without it the browser assumes 100vw and picks the largest file. */
  sizes: string;
  alt: string;
  /** Set on the hero image only — it is the LCP candidate. */
  priority?: boolean;
  className?: string;
}) {
  const { widths, intrinsic } = VARIANTS[variant];
  const srcSet = (extension: string) =>
    widths.map((width) => `/me/${variant}-${width}.${extension} ${width}w`).join(', ');

  return (
    <picture>
      <source type="image/avif" srcSet={srcSet('avif')} sizes={sizes} />
      <source type="image/webp" srcSet={srcSet('webp')} sizes={sizes} />
      {/* A plain <img>, not next/image — see the note above: these are
          pre-generated crops, not arbitrary uploads to be optimised. */}
      <img
        src={`/me/${variant}-${widths[widths.length - 1]}.jpg`}
        srcSet={srcSet('jpg')}
        sizes={sizes}
        width={intrinsic[0]}
        height={intrinsic[1]}
        alt={alt}
        loading={priority ? 'eager' : 'lazy'}
        fetchPriority={priority ? 'high' : 'auto'}
        decoding="async"
        className={cn('h-full w-full object-cover', className)}
      />
    </picture>
  );
}
