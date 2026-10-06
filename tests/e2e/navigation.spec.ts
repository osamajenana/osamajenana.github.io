import { expect, test } from '@playwright/test';

/**
 * Behaviour that axe cannot see: keyboard access, direction switching, and the
 * stack scene's performance guarantees.
 */

test.describe('defaults', () => {
  /**
   * `/` goes to English for everyone. next-intl's locale detection is off, so
   * neither Accept-Language nor a stale NEXT_LOCALE cookie can send a visitor
   * somewhere else — a recruiter following a link has to land on the English
   * site whatever their browser is configured for.
   */
  test('the root lands on English whatever the browser asks for', async ({ browser }) => {
    const context = await browser.newContext({ locale: 'ar-SA' });
    const page = await context.newPage();

    await page.goto('/');
    await expect(page).toHaveURL(/\/en$/);
    await expect(page.locator('html')).toHaveAttribute('lang', 'en');

    await context.close();
  });

  /**
   * Dark is the site's own default, not a mirror of the OS. A visitor whose
   * system is set to light still opens on dark until they use the toggle.
   */
  test('opens dark even when the OS asks for light', async ({ browser }) => {
    const context = await browser.newContext({ colorScheme: 'light' });
    const page = await context.newPage();

    await page.goto('/en');
    await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');

    await context.close();
  });

  test('remembers the theme the visitor chose', async ({ page }) => {
    await page.goto('/en');
    await page.getByRole('button', { name: /switch theme/i }).click();
    await expect(page.locator('html')).toHaveAttribute('data-theme', 'light');

    // The bootstrap script has to read it back before first paint, so this must
    // survive a full reload rather than a client-side re-render.
    await page.reload();
    await expect(page.locator('html')).toHaveAttribute('data-theme', 'light');
  });
});

test.describe('locale and direction', () => {
  test('English renders left-to-right', async ({ page }) => {
    await page.goto('/en');
    await expect(page.locator('html')).toHaveAttribute('dir', 'ltr');
    await expect(page.locator('html')).toHaveAttribute('lang', 'en');
  });

  test('Arabic renders right-to-left with the Arabic face', async ({ page }) => {
    await page.goto('/ar');
    await expect(page.locator('html')).toHaveAttribute('dir', 'rtl');
    await expect(page.locator('html')).toHaveAttribute('lang', 'ar');

    const fontFamily = await page
      .locator('body')
      .evaluate((node) => getComputedStyle(node).fontFamily);
    expect(fontFamily).toContain('IBM Plex Sans Arabic');
  });

  test('switching locale stays on the same route', async ({ page }) => {
    await page.goto('/en/work/sila');

    // The switch is in the header at every width — no drawer to open first.
    await page.getByRole('link', { name: 'العربية' }).click();
    await expect(page).toHaveURL(/\/ar\/work\/sila$/);
    await expect(page.locator('html')).toHaveAttribute('dir', 'rtl');
  });

  test('no page scrolls horizontally', async ({ page }) => {
    for (const path of ['/en', '/ar', '/en/work', '/ar/work/sila', '/en/cv']) {
      await page.goto(path);
      await page.waitForLoadState('networkidle');

      // Reporting the culprits, not just a boolean: "the page scrolls sideways"
      // is not a debuggable failure message.
      const report = await page.evaluate(() => {
        const doc = document.documentElement;
        const limit = doc.clientWidth;
        if (doc.scrollWidth <= limit + 1) return null;

        const offenders = [...document.querySelectorAll<HTMLElement>('body *')]
          .map((node) => {
            const box = node.getBoundingClientRect();
            return { node, right: box.right, left: box.left, width: box.width };
          })
          .filter((entry) => entry.right > limit + 1 && entry.width > 0)
          .sort((a, b) => b.right - a.right)
          .slice(0, 5)
          .map((entry) => {
            const el = entry.node;
            const id = el.id ? `#${el.id}` : '';
            const cls = el.className
              ? `.${String(el.className).split(/\s+/).filter(Boolean).slice(0, 3).join('.')}`
              : '';
            return `${el.tagName.toLowerCase()}${id}${cls} → right ${Math.round(entry.right)}px`;
          });

        return { limit, scrollWidth: doc.scrollWidth, offenders };
      });

      expect(report, `${path} scrolls horizontally: ${JSON.stringify(report)}`).toBeNull();
    }
  });
});

test.describe('keyboard access', () => {
  test('the skip link is the first stop and reaches the main content', async ({ page }) => {
    await page.goto('/en');
    await page.keyboard.press('Tab');

    const skip = page.getByRole('link', { name: /skip to content/i });
    await expect(skip).toBeFocused();

    await page.keyboard.press('Enter');
    await expect(page).toHaveURL(/#main$/);
  });

  test('every focused element shows a visible focus ring', async ({ page }) => {
    await page.goto('/en/work');

    for (let i = 0; i < 12; i++) {
      await page.keyboard.press('Tab');

      const outline = await page.evaluate(() => {
        const el = document.activeElement;
        if (!el || el === document.body) return null;
        const style = getComputedStyle(el);
        return { width: style.outlineWidth, style: style.outlineStyle };
      });

      if (outline) {
        expect(outline.style, 'focused element has no outline style').not.toBe('none');
        expect(
          parseFloat(outline.width),
          'focused element has a zero-width outline',
        ).toBeGreaterThan(0);
      }
    }
  });
});

test.describe('stack diagram', () => {
  /**
   * The section used to be a WebGL canvas. It is vector now, which is the whole
   * point: it has to be real text in the DOM, not pixels in a drawing buffer.
   */
  test('is vector, with its labels as selectable text', async ({ page }) => {
    await page.goto('/en');

    const figure = page.getByRole('group', { name: /a request arrives at nginx/i });
    await figure.scrollIntoViewIfNeeded();
    await expect(figure).toBeVisible();

    await expect(figure.locator('svg')).toHaveCount(1);
    await expect(figure.getByText('Laravel / Next.js')).toBeVisible();
    await expect(figure.getByText('Redis + Queue')).toBeVisible();

    // No WebGL anywhere on the page any more.
    await expect(page.locator('canvas')).toHaveCount(0);
  });

  test('drops the connector pulses under reduced motion', async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.goto('/en');

    const pulse = page.locator('.diagram-pulse').first();
    await expect(pulse).toBeAttached();
    // Frozen mid-path, a pulse is an unexplained coloured tick sitting on a
    // line, so reduced motion hides it rather than merely slowing it.
    await expect(pulse).toBeHidden();
  });
});

test.describe('CV', () => {
  /**
   * The download must be the designed PDF that ships in public/, not something
   * generated from the site's own data — those two can disagree, and the one a
   * client receives has to be the one that is kept up to date.
   */
  test('downloads the designed PDF', async ({ page }) => {
    await page.goto('/en/cv');

    const link = page.getByRole('link', { name: /download pdf/i });
    await expect(link).toHaveAttribute('href', '/cv/Osama-Jenana-CV.pdf');

    const [download] = await Promise.all([page.waitForEvent('download'), link.click()]);

    expect(download.suggestedFilename()).toBe('Osama-Jenana-CV.pdf');
    // No spaces: the legacy site's CV link broke on exactly that.
    expect(download.suggestedFilename()).not.toContain(' ');
  });
});

test.describe('contact form', () => {
  test('rejects an invalid address and keeps what was typed', async ({ page }) => {
    await page.goto('/en/contact');

    await page.getByLabel(/your name/i).fill('Ada Lovelace');
    await page.getByLabel(/your email/i).fill('not-an-email');
    const message = 'A message long enough to clear the minimum length requirement.';
    await page.getByLabel(/your message/i).fill(message);

    // The server rejects anything submitted implausibly fast.
    await page.waitForTimeout(3000);
    await page.getByRole('button', { name: /send message/i }).click();

    await expect(page.getByText(/does not look right/i)).toBeVisible();
    // The whole point of echoing values back: a rejected submission must not
    // discard a message somebody spent time writing.
    await expect(page.getByLabel(/your message/i)).toHaveValue(message);
  });

  test('never claims success when delivery is not configured', async ({ page }) => {
    await page.goto('/en/contact');

    await page.getByLabel(/your name/i).fill('Ada Lovelace');
    await page.getByLabel(/your email/i).fill('ada@example.com');
    await page
      .getByLabel(/your message/i)
      .fill('A message long enough to clear the minimum length requirement.');

    await page.waitForTimeout(3000);
    await page.getByRole('button', { name: /send message/i }).click();

    const sent = page.getByText(/your message reached me/i);
    const failed = page.getByText(/broke on my side/i);

    // Whichever happens, it must be the truth: a success panel only when Resend
    // is configured, and an honest error otherwise. The old site always lied.
    await expect(sent.or(failed)).toBeVisible({ timeout: 15_000 });

    if (!process.env.RESEND_API_KEY) {
      await expect(failed).toBeVisible();
      await expect(sent).toHaveCount(0);
    }
  });
});

test.describe('metadata', () => {
  test('exposes a real canonical URL and an OG image', async ({ page }) => {
    await page.goto('/en');

    const canonical = await page.locator('link[rel="canonical"]').getAttribute('href');
    expect(canonical).toBeTruthy();
    // The legacy site shipped the literal placeholder.
    expect(canonical).not.toContain('yourwebsite.com');

    const ogImage = await page.locator('meta[property="og:image"]').getAttribute('content');
    expect(ogImage).toBeTruthy();
  });

  test('links each locale to its translation', async ({ page }) => {
    await page.goto('/en/work');

    const alternates = await page
      .locator('link[rel="alternate"][hreflang]')
      .evaluateAll((nodes) => nodes.map((node) => node.getAttribute('hreflang')));

    expect(alternates).toContain('en');
    expect(alternates).toContain('ar');
  });
});
