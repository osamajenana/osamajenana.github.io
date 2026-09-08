import AxeBuilder from '@axe-core/playwright';
import { expect, test } from '@playwright/test';

/**
 * Automated accessibility scan of every route, in both locales.
 *
 * axe catches roughly a third of real accessibility problems, so passing this is
 * a floor rather than a guarantee — the keyboard and focus assertions in
 * navigation.spec.ts cover things axe cannot see.
 */

const ROUTES = [
  '',
  '/platform',
  '/work',
  '/work/sila',
  '/work/whatsapp-commerce',
  '/work/archive',
  '/about',
  '/services',
  '/cv',
  '/contact',
  '/blog',
  '/blog/stateful-whatsapp-flow-engine',
  '/privacy',
  '/terms',
  '/data-deletion',
];

const LOCALES = ['en', 'ar'] as const;

for (const locale of LOCALES) {
  for (const route of ROUTES) {
    const path = `/${locale}${route}`;

    test(`no accessibility violations: ${path}`, async ({ page }) => {
      /**
       * Scanned with reduced motion, which is what makes this deterministic.
       *
       * The hero and every scroll-reveal animate in from `opacity: 0`. Under a
       * loaded machine `networkidle` can fire while they are still part-way
       * through, and axe then measures the contrast of half-transparent text
       * and fails — which it did, on six routes, only when the whole suite was
       * competing for workers. WCAG applies to the settled state, and under
       * reduced motion these components render exactly that, immediately.
       */
      await page.emulateMedia({ reducedMotion: 'reduce' });
      await page.goto(path);
      await page.waitForLoadState('networkidle');

      const results = await new AxeBuilder({ page })
        .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
        .analyze();

      // Report the rule and the element, not just a count — a bare number is
      // useless when this fails in CI.
      const summary = results.violations.map((violation) => ({
        id: violation.id,
        impact: violation.impact,
        help: violation.help,
        nodes: violation.nodes.map((node) => node.target.join(' ')),
      }));

      expect(summary).toEqual([]);
    });
  }
}
