'use client';

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import type { ReactNode } from 'react';

import { DARK_QUERY, DEFAULT_THEME, isTheme, THEME_STORAGE_KEY } from '@/lib/theme';
import type { ResolvedTheme, Theme } from '@/lib/theme';

/**
 * Theme state.
 *
 * This replaces next-themes, which rendered its no-flash bootstrap script from
 * inside its own client component. React 19 logs an error whenever a client
 * component creates a <script> element on the client — which Fast Refresh does
 * every time anything in that subtree is edited — so `next dev` showed a red
 * console error that had nothing to do with the site. Here the script is
 * emitted once by the server layout and this component only reads and writes an
 * attribute.
 *
 * Nothing React renders depends on the theme: the toggle draws both icons and
 * CSS picks one off `[data-theme]`. That is why the state below can be seeded
 * from the browser during hydration without risking a mismatch.
 */

type ThemeContextValue = {
  theme: Theme;
  resolvedTheme: ResolvedTheme;
  setTheme: (theme: Theme) => void;
};

const ThemeContext = createContext<ThemeContextValue | null>(null);

function storedTheme(): Theme {
  if (typeof document === 'undefined') return DEFAULT_THEME;
  try {
    const stored = localStorage.getItem(THEME_STORAGE_KEY);
    if (isTheme(stored)) return stored;
  } catch {
    // Private mode, or storage disabled. The default is a valid answer.
  }
  return DEFAULT_THEME;
}

function resolve(theme: Theme): ResolvedTheme {
  if (theme !== 'system') return theme;
  if (typeof window === 'undefined') return 'dark';
  return window.matchMedia(DARK_QUERY).matches ? 'dark' : 'light';
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  // Lazy initialisers, so the first client render already holds what the
  // bootstrap script decided. Seeding with a constant instead would apply the
  // wrong theme for one frame before an effect corrected it.
  const [theme, setThemeState] = useState<Theme>(storedTheme);
  const [resolvedTheme, setResolvedTheme] = useState<ResolvedTheme>(() => resolve(storedTheme()));

  // Follow the OS, but only while the choice actually is "system".
  useEffect(() => {
    if (theme !== 'system') return;
    const query = window.matchMedia(DARK_QUERY);
    const sync = () => setResolvedTheme(query.matches ? 'dark' : 'light');
    sync();
    query.addEventListener('change', sync);
    return () => query.removeEventListener('change', sync);
  }, [theme]);

  // Another tab changed the preference.
  useEffect(() => {
    const onStorage = (event: StorageEvent) => {
      if (event.key !== THEME_STORAGE_KEY) return;
      const next = storedTheme();
      setThemeState(next);
      setResolvedTheme(resolve(next));
    };
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, []);

  useEffect(() => {
    const root = document.documentElement;
    root.setAttribute('data-theme', resolvedTheme);
    root.style.colorScheme = resolvedTheme;
  }, [resolvedTheme]);

  const setTheme = useCallback((next: Theme) => {
    setThemeState(next);
    setResolvedTheme(resolve(next));
    try {
      localStorage.setItem(THEME_STORAGE_KEY, next);
    } catch {
      // The choice still applies to this page; it just will not survive a reload.
    }
  }, []);

  const value = useMemo(
    () => ({ theme, resolvedTheme, setTheme }),
    [theme, resolvedTheme, setTheme],
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme(): ThemeContextValue {
  const value = useContext(ThemeContext);
  if (!value) throw new Error('useTheme must be used inside <ThemeProvider>.');
  return value;
}
