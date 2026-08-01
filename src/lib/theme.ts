/**
 * Theme constants and the no-flash bootstrap script.
 *
 * Deliberately a separate module from the provider component. The server layout
 * needs the script string, and a file that exports both a React component and a
 * value imported outside the render tree defeats Fast Refresh — editing it
 * forces a full page reload instead of a hot update.
 */

export type Theme = 'light' | 'dark' | 'system';
export type ResolvedTheme = 'light' | 'dark';

export const THEME_STORAGE_KEY = 'theme';
export const DEFAULT_THEME: Theme = 'dark';
export const DARK_QUERY = '(prefers-color-scheme: dark)';

export function isTheme(value: unknown): value is Theme {
  return value === 'light' || value === 'dark' || value === 'system';
}

/**
 * Stamps the resolved theme on <html> before anything paints.
 *
 * Rendered by the server layout, never by a client component: a <script> a
 * client component creates would not execute anyway, and React 19 logs an error
 * when one tries.
 */
export const themeBootstrapScript = `(function(){try{var s=localStorage.getItem(${JSON.stringify(
  THEME_STORAGE_KEY,
)});var t=s==='light'||s==='dark'||s==='system'?s:${JSON.stringify(
  DEFAULT_THEME,
)};var r=t==='system'?(window.matchMedia(${JSON.stringify(
  DARK_QUERY,
)}).matches?'dark':'light'):t;var e=document.documentElement;e.setAttribute('data-theme',r);e.style.colorScheme=r;}catch(_){document.documentElement.setAttribute('data-theme',${JSON.stringify(
  DEFAULT_THEME,
)});}})();`;
