import type { ReactNode } from 'react';

/** Shared page masthead: eyebrow, title, lead paragraph. */
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
    <header className="container-page pt-32 pb-12 sm:pt-40 sm:pb-16">
      {eyebrow && (
        <p className="mb-4 font-mono text-xs tracking-widest text-ink-subtle uppercase">
          {eyebrow}
        </p>
      )}
      <h1 className="max-w-3xl text-display-sm font-semibold tracking-tight text-ink">{title}</h1>
      {lead && <p className="mt-5 max-w-2xl text-lg leading-relaxed text-ink-muted">{lead}</p>}
      {children}
    </header>
  );
}
