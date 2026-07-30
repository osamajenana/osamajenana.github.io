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
];

const LOCALES = ['en', 'ar'] as const;

for (const locale of LOCALES) {
  for (const route of ROUTES) {
    const path = `/${locale}${route}`;

    test(`no accessibility violations: ${path}`, async ({ page }) => {
      await page.goto(path);
      // The hero canvas mounts lazily; wait for the page to settle so the scan
      // sees the same DOM a visitor would.
      await page.waitForLoadState('networkidle');

      const results = await new AxeBuilder({ page })
        .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
        /**
         * The WebGL canvas is decorative and marked aria-hidden; its text
         * alternative lives in the hero's visually-hidden paragraph. axe cannot
         * see inside a canvas, so scanning it produces noise rather than signal.
         */
        .exclude('canvas')
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
