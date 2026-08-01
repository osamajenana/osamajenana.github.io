import type { ReactNode } from 'react';

/**
 * Shared page masthead: eyebrow, title, lead paragraph.
 *
 * Carries the same ambient wash and grid as the hero so an inner page opens on
 * something rather than on a rule and a line of text.
 */
export function PageHeader({
  eyebrow,
  title,
  lead,
  children,
}: {
  eyebrow?: string;
  title: string;
  lead?: string;
  children?: ReactNode;
}) {
  return (
    <header className="relative isolate overflow-hidden border-b border-line">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-20"
        style={{
          background:
            'radial-gradient(110% 90% at 50% -30%, var(--scene-2) 0%, var(--canvas) 65%, var(--canvas) 100%)',
        }}
      />
      <div aria-hidden className="aurora -z-10 opacity-70" />

      <div className="container-page relative pt-32 pb-14 sm:pt-40 sm:pb-20">
        {eyebrow && <p className="eyebrow mb-4">{eyebrow}</p>}
        <h1 className="display-title max-w-3xl text-display text-ink">{title}</h1>
        {lead && <p className="mt-6 max-w-2xl text-lg leading-relaxed text-ink-muted">{lead}</p>}
        {children}
      </div>
    </header>
  );
}
