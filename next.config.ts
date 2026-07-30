import createMDX from '@next/mdx';
import type { NextConfig } from 'next';
import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin('./src/i18n/request.ts');

/**
 * MDX is used for blog posts only — case studies are structured data, so the
 * schema can enforce that each one covers the same ground in both languages.
 *
 * Plugins are named as strings rather than imported: Turbopack has to serialise
 * this config across workers and cannot carry a function through.
 */
const withMDX = createMDX({
  options: {
    remarkPlugins: [['remark-gfm', {}]],
    rehypePlugins: [
      [
        'rehype-pretty-code',
        {
          // Both themes are emitted; CSS picks one via the data-theme attribute.
          theme: { dark: 'github-dark-dimmed', light: 'github-light' },
          keepBackground: false,
        },
      ],
    ],
  },
});

/**
 * Headers set here apply in `next dev` and `next start` alike, so behaviour is
 * identical locally and on the VPS. nginx re-asserts them in production plus
 * adds HSTS and the CSP (see deploy/nginx.conf) — belt and braces.
 */
const securityHeaders = [
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  { key: 'X-Frame-Options', value: 'DENY' },
  { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
  { key: 'X-DNS-Prefetch-Control', value: 'on' },
  {
    key: 'Permissions-Policy',
    value: 'camera=(), microphone=(), geolocation=(), browsing-topics=()',
  },
];

const nextConfig: NextConfig = {
  // Self-hosted on a VPS behind nginx + PM2.
  output: 'standalone',
  reactStrictMode: true,
  poweredByHeader: false,

  images: {
    formats: ['image/avif', 'image/webp'],
    // Project screenshots are captured at 1440w and 390w; these cover both
    // plus retina without generating dead sizes.
    deviceSizes: [390, 640, 828, 1080, 1440, 1920, 2880],
  },

  // @react-pdf/renderer must not be bundled by Turbopack — it resolves its own
  // font/stream internals at runtime inside the /api/cv route handler.
  serverExternalPackages: ['@react-pdf/renderer'],

  async headers() {
    return [
      {
        source: '/:path*',
        headers: securityHeaders,
      },
      {
        // Next already sets immutable caching for /_next/static itself; this
        // covers assets we place in public/ that are safe to pin for a year.
        source: '/fonts/:path*',
        headers: [{ key: 'Cache-Control', value: 'public, max-age=31536000, immutable' }],
      },
    ];
  },

  async redirects() {
    return [
      // The legacy static site linked the CV with a space in the filename.
      {
        source: '/osama jenana-Full Stack Developer.pdf',
        destination: '/api/cv?locale=en',
        permanent: true,
      },
    ];
  },
};

export default withNextIntl(withMDX(nextConfig));
