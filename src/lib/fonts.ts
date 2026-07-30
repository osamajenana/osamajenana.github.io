import { GeistMono } from 'geist/font/mono';
import { GeistSans } from 'geist/font/sans';
import { IBM_Plex_Sans_Arabic, Instrument_Serif } from 'next/font/google';

/**
 * All four faces are self-hosted: `geist` ships woff2 in the package, and
 * next/font/google downloads and serves from our own origin at build time.
 * The site makes zero font requests to a third party at runtime.
 */

export const plexArabic = IBM_Plex_Sans_Arabic({
  subsets: ['arabic'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-plex-arabic',
  display: 'swap',
});

export const instrumentSerif = Instrument_Serif({
  subsets: ['latin'],
  weight: '400',
  style: ['normal', 'italic'],
  variable: '--font-instrument-serif',
  display: 'swap',
});

/** Applied to <html> so every --font-* variable in globals.css resolves. */
export const fontVariables = [
  GeistSans.variable,
  GeistMono.variable,
  plexArabic.variable,
  instrumentSerif.variable,
].join(' ');
