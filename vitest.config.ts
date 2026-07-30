import { fileURLToPath } from 'node:url';
import { defineConfig } from 'vitest/config';

/**
 * Unit tests cover the content layer and the i18n catalogues — the two places
 * where a mistake ships silently.
 *
 * There is no jsdom environment and no component rendering here: component
 * behaviour is covered by the Playwright suite against a real browser, which is
 * a more honest test of a site whose hard parts are WebGL, RTL layout and
 * server actions.
 */
export default defineConfig({
  test: {
    environment: 'node',
    include: ['tests/unit/**/*.test.ts'],
    reporters: ['default'],
  },
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
});
