'use client';

import { animate, useInView, useReducedMotion } from 'motion/react';
import { useEffect, useRef, useState } from 'react';

/**
 * Counts up to a number when it scrolls into view.
 *
 * With reduced motion the final value is rendered immediately — an animated
 * count is decoration, and a visitor who opted out should not have to wait for
 * a number to finish arriving before they can read it.
 */
export function Counter({
  value,
  suffix = '',
  duration = 1.1,
  className,
}: {
  value: number;
  /** Rendered after the digits, e.g. "+" or "k". */
  suffix?: string;
  duration?: number;
  className?: string;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: '0px 0px -15% 0px' });
  const reduced = useReducedMotion();

  /**
   * `null` until an animation actually runs, and the real value is rendered in
   * the meantime. That makes the number correct on the server, with JavaScript
   * disabled, and under reduced motion — a counter that renders 0 in any of
   * those cases is not a nice effect, it is wrong information.
   *
   * The animation starts from 0 only once the element is 15% into the viewport,
   * so the switch happens below the fold where nobody sees it.
   */
  const [animated, setAnimated] = useState<number | null>(null);
  const display = animated ?? value;

  useEffect(() => {
    if (!inView || reduced) return;

    const controls = animate(0, value, {
      duration,
      ease: [0.16, 1, 0.3, 1],
      onUpdate: (latest) => setAnimated(Math.round(latest)),
    });

    return () => controls.stop();
  }, [inView, reduced, value, duration]);

  return (
    <span ref={ref} className={className}>
      {/* Tabular figures so the width does not jitter while counting. */}
      <span style={{ fontVariantNumeric: 'tabular-nums' }}>{display}</span>
      {suffix}
    </span>
  );
}
