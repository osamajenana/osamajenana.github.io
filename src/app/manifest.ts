import type { MetadataRoute } from 'next';

import { owner } from '@/content/site';

/**
 * Minimal web app manifest. The site is not an installable app, but a manifest
 * gives browsers a proper name, theme colour and icon for bookmarks and
 * home-screen shortcuts.
 */
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: `${owner.fullName} — ${owner.role.en}`,
    short_name: owner.shortName,
    description: owner.specialism.en,
    start_url: '/en',
    display: 'browser',
    background_color: '#08090c',
    theme_color: '#08090c',
    icons: [
      { src: '/icon.png', sizes: '512x512', type: 'image/png' },
      { src: '/apple-icon.png', sizes: '180x180', type: 'image/png' },
    ],
  };
}
