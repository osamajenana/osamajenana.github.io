import type { ReactNode } from 'react';

import { cn } from '@/lib/utils';

type Tone = 'neutral' | 'brand' | 'ai' | 'muted';

const tones: Record<Tone, string> = {
  neutral: 'border-line bg-raised text-ink-muted',
  brand: 'border-brand/30 bg-brand-dim text-brand',
  ai: 'border-ai/30 bg-ai-dim text-ai',
  muted: 'border-transparent bg-transparent text-ink-subtle',
};

export function Tag({
  children,
  tone = 'neutral',
  mono = false,
  className,
}: {
  children: ReactNode;
  tone?: Tone;
  /** Technology names read better in the mono face. */
  mono?: boolean;
  className?: string;
}) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-pill border px-2.5 py-1 text-xs leading-none',
        tones[tone],
        mono && 'font-mono tracking-tight',
        className,
      )}
    >
      {children}
    </span>
  );
}

/** Small live/shipped/internal indicator used on project cards. */
export function StatusDot({ tone }: { tone: 'live' | 'active' | 'idle' }) {
  const color = tone === 'live' ? 'bg-ai' : tone === 'active' ? 'bg-brand' : 'bg-ink-subtle';

  return (
    <span aria-hidden className="relative flex size-2 shrink-0">
      {tone === 'live' && (
        <span
          className={cn(
            'absolute inline-flex size-full animate-ping rounded-full opacity-60',
            color,
          )}
        />
      )}
      <span className={cn('relative inline-flex size-2 rounded-full', color)} />
    </span>
  );
}
