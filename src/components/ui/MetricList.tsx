import type { Locale } from '@/i18n/routing';
import type { Metric } from '@/lib/schemas';
import { cn } from '@/lib/utils';

/**
 * A definition list of figures.
 *
 * The semantics are fiddly and were wrong in four separate places before this
 * component existed, so they live here once:
 *
 *  - `<dl>` may only directly contain `dt`, `dd`, `div`, `script` or `template`.
 *    A `<p>` for the footnote is invalid, so hints are a second `<dd>` instead.
 *  - Each group must read `dt` then `dd` in the DOM. The design wants the number
 *    above its label, so the visual order is flipped with `order-*` rather than
 *    by reordering the markup.
 */
export function MetricList({
  metrics,
  locale,
  size = 'md',
  className,
}: {
  metrics: Metric[];
  locale: Locale;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}) {
  if (metrics.length === 0) return null;

  const valueSize = size === 'lg' ? 'text-3xl sm:text-4xl' : size === 'md' ? 'text-2xl' : 'text-xl';

  return (
    <dl className={cn('grid gap-x-6 gap-y-4', className)}>
      {metrics.map((metric) => (
        <div key={metric.label.en} className="flex flex-col">
          <dt
            className={cn('order-2 mt-0.5 text-ink-subtle', size === 'lg' ? 'text-sm' : 'text-xs')}
          >
            {metric.label[locale]}
          </dt>
          <dd className={cn('nums order-1 font-semibold text-ink', valueSize)}>{metric.value}</dd>
          {metric.hint && (
            <dd className="order-3 mt-1 text-xs leading-relaxed text-ink-subtle">
              {metric.hint[locale]}
            </dd>
          )}
        </div>
      ))}
    </dl>
  );
}

/**
 * A single figure that is not part of a project's measured metrics — the About
 * page counters and similar. Same ordering rules as above.
 */
export function StatItem({
  value,
  label,
  className,
}: {
  value: React.ReactNode;
  label: string;
  className?: string;
}) {
  return (
    <div className={cn('flex flex-col', className)}>
      <dt className="order-2 mt-1 text-xs leading-snug text-ink-subtle">{label}</dt>
      <dd className="nums order-1 text-3xl font-semibold text-ink">{value}</dd>
    </div>
  );
}
