'use client';

import dynamic from 'next/dynamic';
import { useEffect, useRef, useState } from 'react';

import { ScenePoster } from './ScenePoster';

/**
 * Capability gate and lifecycle owner for the hero scene.
 *
 * three.js plus react-three-fiber is a large chunk, so it is loaded lazily and
 * never server-rendered. Until it arrives — and permanently, for anyone who
 * asked for reduced motion or has no WebGL — the SVG poster stands in. The
 * hero's heading is plain server-rendered text, so the LCP element never waits
 * on any of this.
 */
const InfraScene = dynamic(() => import('./InfraScene'), {
  ssr: false,
  loading: () => <ScenePoster />,
});

function supportsWebGL(): boolean {
  try {
    const canvas = document.createElement('canvas');
    return Boolean(
      window.WebGLRenderingContext && (canvas.getContext('webgl2') ?? canvas.getContext('webgl')),
    );
  } catch {
    return false;
  }
}

export function HeroScene() {
  const holder = useRef<HTMLDivElement>(null);
  const [mode, setMode] = useState<'pending' | 'poster' | 'live'>('pending');
  const [compact, setCompact] = useState(false);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
    const small = window.matchMedia('(max-width: 767px)');

    const decide = () => {
      if (reduced.matches || !supportsWebGL()) {
        setMode('poster');
        return;
      }
      setCompact(small.matches);
      setMode('live');
    };

    decide();
    reduced.addEventListener('change', decide);
    small.addEventListener('change', decide);

    return () => {
      reduced.removeEventListener('change', decide);
      small.removeEventListener('change', decide);
    };
  }, []);

  /**
   * Stop rendering once the hero scrolls away — otherwise the scene keeps
   * burning GPU on every other section of the page.
   *
   * Visibility is deliberately NOT part of this condition. Browsers already
   * suspend requestAnimationFrame in hidden tabs, so a `document.hidden` gate
   * buys nothing, and any environment that misreports visibility (automation,
   * some embedded webviews) would then never render at all.
   */
  useEffect(() => {
    if (mode !== 'live') return;
    const element = holder.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => setPaused(!(entry?.isIntersecting ?? true)),
      { threshold: 0.01 },
    );
    observer.observe(element);

    return () => observer.disconnect();
  }, [mode]);

  // A lost context leaves a blank canvas behind. Fall back to the poster so the
  // hero degrades to something rather than nothing.
  useEffect(() => {
    if (mode !== 'live') return;
    const element = holder.current;
    if (!element) return;

    const canvas = element.querySelector('canvas');
    if (!canvas) return;

    const onLost = () => setMode('poster');
    canvas.addEventListener('webglcontextlost', onLost);
    return () => canvas.removeEventListener('webglcontextlost', onLost);
  }, [mode]);

  return (
    <div
      ref={holder}
      aria-hidden
      className="absolute inset-0"
      // Surfaced for debugging and for the Playwright performance assertions:
      // the scene must be paused once the hero leaves the viewport.
      data-scene-mode={mode}
      data-scene-paused={paused ? 'true' : 'false'}
    >
      {mode === 'live' ? <InfraScene compact={compact} paused={paused} /> : <ScenePoster />}
    </div>
  );
}
