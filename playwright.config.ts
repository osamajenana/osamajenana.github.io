import { defineConfig, devices } from '@playwright/test';

const PORT = 3210;
const BASE_URL = `http://127.0.0.1:${PORT}`;

/**
 * End-to-end suite. Runs against a production build, not the dev server —
 * static generation, the standalone output and header behaviour all differ in
 * dev, and this site is deployed as a production build.
 *
 * Two projects: a desktop viewport and a phone, because the hero scene, the
 * navigation drawer and the cover images all take different code paths on small
 * screens.
 */
export default defineConfig({
  testDir: './tests/e2e',
  fullyParallel: true,
  forbidOnly: Boolean(process.env.CI),
  retries: process.env.CI ? 1 : 0,
  reporter: process.env.CI ? [['github'], ['html', { open: 'never' }]] : [['list']],

  use: {
    baseURL: BASE_URL,
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
  },

  projects: [
    { name: 'desktop', use: { ...devices['Desktop Chrome'] } },
    { name: 'mobile', use: { ...devices['Pixel 7'] } },
  ],

  webServer: {
    command: `npm run start -- --port ${PORT}`,
    url: BASE_URL,
    reuseExistingServer: !process.env.CI,
    timeout: 180_000,
    stdout: 'ignore',
    stderr: 'pipe',
  },
});
