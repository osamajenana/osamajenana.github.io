'use client';

import { motion, useReducedMotion } from 'motion/react';
import type { ReactNode } from 'react';

/**
 * On-mount fade-up, for the hero only.
 *
 * `Reveal` cannot do this job: it animates on scroll into view, and the hero is
 * already in view on load, so it would either fire instantly with no stagger or
 * — worse — never fire at all and leave the content at opacity zero.
 */
export function HeroFade({
  children,
  delay = 0,
  className,
}: {
  children: ReactNode;
  /** Seconds. Stagger siblings by roughly 0.1. */
  delay?: number;
  className?: string;
}) {
  const reduced = useReducedMotion();

  if (reduced) return <div className={className}>{children}</div>;

  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, delay, ease: [0.16, 1, 0.3, 1] }}
    >
      {children}
    </motion.div>
  );
}
