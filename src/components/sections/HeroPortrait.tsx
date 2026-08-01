'use client';

import { motion, useMotionValue, useReducedMotion, useSpring, useTransform } from 'motion/react';
import type { ReactNode } from 'react';

const SPRING = { stiffness: 130, damping: 18, mass: 0.6 };

/**
 * The hero photograph: an entrance, then a shallow tilt that follows the
 * pointer.
 *
 * The tilt is capped at about five degrees and spring-damped on purpose. Push
 * it further and the perspective distortion becomes visible on a face, which
 * turns a photograph of a person into a novelty card — the effect has to read
 * as the light moving, not as the picture bending.
 */
export function HeroPortrait({ children }: { children: ReactNode }) {
  const reduced = useReducedMotion();

  // Pointer position within the frame, as -0.5…0.5 on each axis.
  const pointerX = useMotionValue(0);
  const pointerY = useMotionValue(0);

  const rotateY = useSpring(useTransform(pointerX, [-0.5, 0.5], [-5, 5]), SPRING);
  const rotateX = useSpring(useTransform(pointerY, [-0.5, 0.5], [4, -4]), SPRING);

  if (reduced) return <div className="relative w-full max-w-[24rem]">{children}</div>;

  return (
    <motion.div
      className="relative w-full max-w-[24rem]"
      // Perspective belongs to the parent of the rotating element; on the
      // element itself it does nothing.
      style={{ perspective: 1100 }}
      initial={{ opacity: 0, y: 28, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 1.1, delay: 0.22, ease: [0.16, 1, 0.3, 1] }}
      onPointerMove={(event) => {
        // Coarse pointers report a position only while touching, and tilting
        // under a finger fights the scroll gesture.
        if (event.pointerType !== 'mouse') return;
        const box = event.currentTarget.getBoundingClientRect();
        pointerX.set((event.clientX - box.left) / box.width - 0.5);
        pointerY.set((event.clientY - box.top) / box.height - 0.5);
      }}
      onPointerLeave={() => {
        pointerX.set(0);
        pointerY.set(0);
      }}
    >
      <motion.div style={{ rotateX, rotateY, transformStyle: 'preserve-3d' }}>
        {children}
      </motion.div>
    </motion.div>
  );
}
