'use client';

import { motion, useReducedMotion } from 'motion/react';

const EASE = [0.16, 1, 0.3, 1] as const;

/**
 * The name, revealed on load.
 *
 * Two things constrain how this is allowed to animate.
 *
 * Arabic must not be split per character. It is a cursive script: letters take
 * a different form depending on their position in the word and join to their
 * neighbours, and putting each one in its own element breaks every join — the
 * name renders as a row of disconnected isolated forms. Only Latin gets the
 * per-character stagger; Arabic animates as whole words.
 *
 * The second line keeps its clipped gradient and animates as ONE element.
 * `background-clip: text` paints the parent's gradient through its descendants'
 * glyphs, and those glyphs have a transparent fill — animating them
 * individually means animating something that paints nothing of its own, which
 * browsers do not agree on. Moving the whole line moves the gradient with it.
 */
export function HeroName({
  first,
  last,
  perCharacter,
}: {
  first: string;
  last: string;
  /** False for Arabic — see above. */
  perCharacter: boolean;
}) {
  const reduced = useReducedMotion();

  /*
   * The gradient line is inline-block, not block, so its box shrink-wraps the
   * word. As a full-width block the gradient ramps across the whole column and
   * the word only samples whichever end it happens to sit at — in Arabic that
   * is the far end, and the name came out a flat blue with none of the ink-to-
   * brand transition the Latin setting gets.
   */
  if (reduced) {
    return (
      <h1 className="display-title text-display-lg text-ink">
        <span className="block">{first}</span>
        <span className="ink-gradient inline-block">{last}</span>
      </h1>
    );
  }

  const units = perCharacter ? [...first] : [first];
  const lastLineDelay = 0.1 + units.length * 0.05;

  return (
    <h1 className="display-title text-display-lg text-ink">
      {/*
        The animated glyphs below are decorative duplicates: split into per
        character elements a screen reader spells the name out. This is the one
        node that carries it as a name.
      */}
      <span className="sr-only">{`${first} ${last}`}</span>

      <span aria-hidden className="block">
        {units.map((unit, index) => (
          <motion.span
            key={`${unit}-${index}`}
            className="inline-block"
            initial={{ opacity: 0, y: '0.45em' }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.85, delay: 0.1 + index * 0.05, ease: EASE }}
          >
            {unit === ' ' ? ' ' : unit}
          </motion.span>
        ))}
      </span>

      <motion.span
        aria-hidden
        className="ink-gradient inline-block"
        initial={{ opacity: 0, y: '0.32em' }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, delay: lastLineDelay, ease: EASE }}
      >
        {last}
      </motion.span>
    </h1>
  );
}
