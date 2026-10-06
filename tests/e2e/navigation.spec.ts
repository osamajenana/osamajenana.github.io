import { expect, test } from '@playwright/test';
import type { APIRequestContext, Page } from '@playwright/test';

/**
 * Behaviour that axe cannot see: keyboard access, direction switching, and the
 * stack scene's performance guarantees.
 */

type JsonLd = Record<string, unknown>;

/**
 * Every schema.org node on a page, with `@graph` documents flattened — a page
 * carries the layout's graph and usually one of its own.
 */
async function structuredData(page: Page): Promise<JsonLd[]> {
  const documents = await page
    .locator('script[type="application/ld+json"]')
    .evaluateAll((nodes) => nodes.map((node) => JSON.parse(node.textContent ?? '{}')));

  return documents.flatMap((document: JsonLd) =>
    Array.isArray(document['@graph']) ? (document['@graph'] as JsonLd[]) : [document],
  );
}

/**
 * Every page path the sitemap lists, relative to the server under test. The
 * sitemap is written with the production origin, so only the path is kept.
 */
async function sitemapPaths(request: APIRequestContext): Promise<string[]> {
  const xml = await (await request.get('/sitemap.xml')).text();

  return [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((match) => new URL(match[1] ?? '').pathname);
}

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
    // Five full page loads, each waiting for the network to settle. Alone this
    // takes ten seconds; with the whole suite competing for workers it has been
    // measured at 22–30s, which is the default limit, and it failed on it once.
    test.slow();

    for (const path of ['/en', '/ar', '/en/work', '/ar/work/sila', '/en/cv']) {
      await expectNoSidewaysScroll(page, path);
    }
  });

  /** The long lists and pill rows added with the expertise pages. */
  test('the expertise and services pages do not scroll horizontally', async ({ page }) => {
    test.slow();

    for (const path of ['/en/expertise', '/ar/expertise/laravel', '/ar/services']) {
      await expectNoSidewaysScroll(page, path);
    }
  });
});

async function expectNoSidewaysScroll(page: Page, path: string) {
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

test.describe('the name, in both scripts', () => {
  const LATIN = { short: 'Osama Jenana', full: 'Osama Raed Jenana' };
  const ARABIC = { short: 'أسامة جنينة', full: 'أسامة رائد جنينة' };

  /**
   * `/` redirects to `/en`, so the English page is the only thing an assistant
   * or a crawler reads when it is handed the site — and the Arabic spelling
   * cannot be worked out from the Latin one. It has to be in the response.
   *
   * Asserted against the served HTML rather than the rendered DOM, because the
   * readers this is for never run the scripts.
   */
  test('the English home page carries the Arabic spelling in its markup', async ({ request }) => {
    const html = await (await request.get('/en')).text();

    const title = html.match(/<title>([^<]*)<\/title>/)?.[1] ?? '';
    expect(title).toContain(LATIN.short);
    expect(title).toContain(ARABIC.short);

    // Under the heading: labelled for a reader that cannot see the layout, and
    // carrying its own language and direction rather than the page's.
    expect(html).toMatch(
      new RegExp(`Name in Arabic: </span><span lang="ar" dir="rtl"[^>]*>${ARABIC.short}</span>`),
    );
  });

  test('the Arabic home page carries the Latin spelling in its markup', async ({ request }) => {
    const html = await (await request.get('/ar')).text();

    const title = html.match(/<title>([^<]*)<\/title>/)?.[1] ?? '';
    expect(title).toContain(ARABIC.short);
    expect(title).toContain(LATIN.short);

    expect(html).toMatch(new RegExp(`<span lang="en" dir="ltr"[^>]*>${LATIN.short}</span>`));
  });

  /** The hero is only on the home page; the footer is what every other route has. */
  test('every route names the owner in both scripts in its footer', async ({ page }) => {
    for (const path of ['/en/work/sila', '/en/cv', '/ar/services']) {
      await page.goto(path);
      const footer = page.getByRole('contentinfo');

      await expect(footer).toContainText(LATIN.full);
      await expect(footer).toContainText(ARABIC.full);
    }
  });

  test('is visible beside the heading, not hidden text', async ({ page }) => {
    await page.goto('/en');
    await expect(page.getByRole('main').getByText(ARABIC.short, { exact: true })).toBeVisible();
  });

  test('the identity graph lists the Arabic spellings as alternate names', async ({ page }) => {
    await page.goto('/en/about');

    const person = (await structuredData(page)).find((node) => node['@type'] === 'Person');

    expect(person?.name).toBe(LATIN.full);
    expect(person?.alternateName).toEqual(
      expect.arrayContaining([LATIN.short, ARABIC.full, ARABIC.short]),
    );
  });

  test('/llms.txt states both spellings as plain UTF-8 text', async ({ request }) => {
    const response = await request.get('/llms.txt');

    expect(response.status()).toBe(200);
    // Without the charset the Arabic arrives as mojibake.
    expect(response.headers()['content-type']).toBe('text/plain; charset=utf-8');

    const body = await response.text();
    expect(body).toContain(`# ${LATIN.short} (${ARABIC.short})`);
    expect(body).toContain(ARABIC.full);
    expect(body).toContain(LATIN.full);
  });
});

test.describe('bidirectional text', () => {
  /**
   * A phone number is Latin digits in space-separated groups. Left to inherit
   * an RTL paragraph's direction, the groups are laid out right to left and
   * "+972 59 290 3278" is painted as "3278 290 59 972+" — a different number
   * to anyone who reads it off the screen.
   *
   * Measured rather than asserted on a `dir` attribute: what matters is the
   * order the groups are painted in, however that order is arrived at.
   */
  test('a phone number keeps its digit groups in order on an Arabic page', async ({ page }) => {
    for (const path of ['/ar', '/ar/contact', '/ar/cv']) {
      await page.goto(path);

      const report = await page.evaluate(() => {
        const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
        const misordered: string[] = [];
        let found = 0;

        for (let node = walker.nextNode(); node; node = walker.nextNode()) {
          const parent = node.parentElement;
          if (!parent || parent.closest('script, style')) continue;

          const text = node.textContent ?? '';
          const match = /\+\d[\d ]{6,}\d/.exec(text);
          if (!match) continue;

          let offset = match.index;
          const groups = match[0].split(' ').map((part) => {
            const range = document.createRange();
            range.setStart(node, offset);
            range.setEnd(node, offset + part.length);
            offset += part.length + 1;
            return { part, left: range.getBoundingClientRect().left };
          });

          found += 1;
          const painted = [...groups].sort((a, b) => a.left - b.left).map((group) => group.part);
          if (painted.join(' ') !== match[0]) {
            misordered.push(`${match[0]} is painted as ${painted.join(' ')}`);
          }
        }

        return { found, misordered };
      });

      // Guards the test itself: a page with no number on it would pass vacuously.
      expect(report.found, `${path} shows no phone number to check`).toBeGreaterThan(0);
      expect(report.misordered, `${path} paints a phone number out of order`).toEqual([]);
    }
  });
});

test.describe('booking', () => {
  /**
   * Where the button leads is configuration (content/site.ts): a Cal.com page
   * once a username is set, a pre-written WhatsApp chat until then. Either way
   * it has to be a real, absolute destination — a booking button that goes
   * nowhere is the one outcome this must not have.
   */
  test('the hero offers a consultation that leads somewhere real', async ({ page }) => {
    await page.goto('/en');

    const link = page.getByRole('main').getByRole('link', { name: 'Book a consultation' });
    await expect(link).toBeVisible();
    await expect(link).toHaveAttribute('href', /^https:\/\/(cal\.com|wa\.me)\/.+/);
    // It leaves the site, so it must not hand the new tab a reference back.
    await expect(link).toHaveAttribute('target', '_blank');
    await expect(link).toHaveAttribute('rel', /noopener/);
  });

  test('a WhatsApp booking opens with the request written in the page language', async ({
    page,
  }) => {
    for (const [path, label, opening] of [
      ['/en', 'Book a consultation', 'Hi Osama'],
      ['/ar', 'احجز استشارة', 'مرحباً أسامة'],
    ] as const) {
      await page.goto(path);

      const href = await page
        .getByRole('main')
        .getByRole('link', { name: label })
        .getAttribute('href');
      const url = new URL(href ?? '');

      // Only the fallback carries a message; a calendar link needs none.
      test.skip(url.hostname !== 'wa.me', 'a scheduling page is configured');

      expect(url.pathname).toMatch(/^\/\d{8,15}$/);
      expect(url.searchParams.get('text')).toContain(opening);
    }
  });

  /**
   * The header carries it on every page, but only where there is room beside
   * the navigation. Below that width the drawer does.
   */
  test('is one tap away from any page', async ({ page, isMobile }) => {
    await page.goto('/ar/work');

    if (isMobile) {
      await page.getByRole('button', { name: 'القائمة' }).click();
      await expect(
        page.locator('#mobile-nav').getByRole('link', { name: 'احجز استشارة' }),
      ).toBeVisible();
    } else {
      await expect(
        page.getByRole('banner').getByRole('link', { name: 'احجز استشارة' }),
      ).toBeVisible();
    }
  });
});

test.describe('expertise', () => {
  test('the index leads to a topic, and the topic lists the systems behind it', async ({
    page,
  }) => {
    await page.goto('/en/expertise');

    const main = page.getByRole('main');
    expect(await main.getByRole('link').count()).toBeGreaterThanOrEqual(10);

    await main.getByRole('link', { name: /Laravel development/ }).click();
    await expect(page).toHaveURL(/\/en\/expertise\/laravel$/);

    await expect(page.getByRole('heading', { level: 1 })).toHaveText('Laravel development');
    // The job title, which is the phrase the page is searched for by.
    await expect(page).toHaveTitle('Laravel developer — Osama Jenana');

    // Evidence, not assertion: the projects themselves, by name.
    const systems = page.getByRole('main').getByRole('heading', { level: 3 });
    expect(await systems.count()).toBeGreaterThanOrEqual(2);
    await expect(
      page.getByRole('main').getByRole('link', { name: 'WhatsApp-Native Commerce Platform' }),
    ).toHaveAttribute('href', '/en/work/whatsapp-commerce');
  });

  /**
   * A page nothing links to is a page a crawler finds late or not at all. Each
   * topic has to be reachable from the pages that are already found.
   */
  test('is linked from the services page, a case study and the footer', async ({ page }) => {
    await page.goto('/en/services');
    await expect(
      page.getByRole('navigation', { name: 'Browse by technology' }).getByRole('link', {
        name: 'Payment gateway integration',
      }),
    ).toHaveAttribute('href', '/en/expertise/payment-gateways');

    await page.goto('/ar/work/sila');
    await expect(
      page.getByRole('navigation', { name: 'خبرات ذات صلة' }).getByRole('link', {
        name: 'تطبيقات Flutter للموبايل',
      }),
    ).toHaveAttribute('href', '/ar/expertise/flutter');

    await expect(
      page.getByRole('contentinfo').getByRole('link', { name: 'الخبرات', exact: true }),
    ).toHaveAttribute('href', '/ar/expertise');
  });

  test('an unknown topic is not found', async ({ request }) => {
    expect((await request.get('/en/expertise/cobol')).status()).toBe(404);
  });
});

test.describe('search and crawl', () => {
  /**
   * The sitemap is what a search engine is handed, so every address in it has
   * to answer. It is generated from the registries, which is exactly how a
   * route can come to be listed before its page exists.
   */
  test('every address in the sitemap answers', async ({ request }) => {
    const paths = await sitemapPaths(request);
    expect(paths.length).toBeGreaterThan(40);

    const statuses = await Promise.all(
      paths.map(async (path) => ({ path, status: (await request.get(path)).status() })),
    );

    expect(statuses.filter((entry) => entry.status !== 200)).toEqual([]);
  });

  /**
   * A title is the line a result is shown by. Two pages sharing one compete
   * with each other, and the layout's template appends the name — so a page
   * that also writes the name into its own title says it twice.
   */
  test('every page has its own title, and none says the name twice', async ({ request }) => {
    const titles = await Promise.all(
      (await sitemapPaths(request)).map(async (path) => {
        const html = await (await request.get(path)).text();
        return { path, title: (html.match(/<title>([^<]*)<\/title>/)?.[1] ?? '').trim() };
      }),
    );

    expect(titles.filter((entry) => entry.title === '')).toEqual([]);

    const firstSeen = new Map<string, string>();
    const repeated: string[] = [];
    for (const { path, title } of titles) {
      const earlier = firstSeen.get(title);
      if (earlier) repeated.push(`${path} has the same title as ${earlier}`);
      else firstSeen.set(title, path);
    }
    expect(repeated).toEqual([]);

    // Once per script is the home page's deliberate pairing; twice in one is not.
    const doubled = titles.filter(
      ({ title }) =>
        (title.match(/Jenana/g) ?? []).length > 1 || (title.match(/جنينة/g) ?? []).length > 1,
    );
    expect(doubled).toEqual([]);
  });

  /**
   * A root path that is not a page — a favicon probe, a scanner — is simply
   * not found. These used to be rendered as a locale that does not exist and
   * fail with a server error, which a crawler counts against the whole site.
   */
  test('an unknown root path is a 404, not a server error', async ({ request }) => {
    for (const path of ['/favicon.ico', '/ads.txt', '/wp-login.php']) {
      expect((await request.get(path)).status(), path).toBe(404);
    }
  });

  test('robots.txt keeps crawlers out of the PDF and nothing else', async ({ request }) => {
    const robots = await (await request.get('/robots.txt')).text();

    expect(robots).toMatch(/^Allow: \/$/m);
    expect(robots).toMatch(/^Disallow: \/cv\/$/m);
    expect(robots).toMatch(/^Sitemap: .+\/sitemap\.xml$/m);
    // Only the designed PDF is kept out. The CV page is /en/cv, which a rule
    // on /cv/ does not match, and it has to stay crawlable.
    expect(robots).not.toMatch(/^Disallow: \/(en|ar)\b/m);
  });

  /**
   * The site publishes no place — the owner works wherever the client is.
   * The unit suite scans the content this is built from; this scans what is
   * actually served, on every route in the sitemap and in the files written
   * for assistants, because a template can add what the content never said.
   */
  test('no served page names a place', async ({ request }) => {
    const PLACES = [/palestin/i, /gaza/i, /فلسطين/, /غز[ةه]/];
    const paths = [...(await sitemapPaths(request)), '/llms.txt', '/llms-full.txt', '/rss.xml'];

    const found = await Promise.all(
      paths.map(async (path) => {
        const body = await (await request.get(path)).text();
        // Hashed asset names are noise, and a four-letter match inside one
        // would be a coincidence rather than a statement.
        const text = body.replace(/\/_next\/[^"'\s\\)]+/g, '');
        const place = PLACES.find((pattern) => pattern.test(text));

        return place ? `${path} matches ${place}` : null;
      }),
    );

    expect(found.filter(Boolean)).toEqual([]);
  });

  test('/llms-full.txt carries the whole site as one UTF-8 document', async ({ request }) => {
    const response = await request.get('/llms-full.txt');

    expect(response.status()).toBe(200);
    expect(response.headers()['content-type']).toBe('text/plain; charset=utf-8');

    const body = await response.text();
    for (const heading of ['## Services', '## Expertise', '## Projects', '## Skills']) {
      expect(body).toContain(heading);
    }
    expect(body).toContain('### WhatsApp-Native Commerce Platform');
    expect(body).toContain('أسامة جنينة');
  });
});

test.describe('structured data', () => {
  test('describes the home page as the profile of one person', async ({ page }) => {
    await page.goto('/en');
    const nodes = await structuredData(page);

    const person = nodes.find((node) => node['@type'] === 'Person');
    const profile = nodes.find((node) => node['@type'] === 'ProfilePage');

    expect(nodes.some((node) => node['@type'] === 'WebSite')).toBe(true);
    expect(profile?.mainEntity).toEqual({ '@id': person?.['@id'] });
    // The long list of what he works with lives here, where a list belongs.
    expect((person?.knowsAbout as string[]).length).toBeGreaterThan(20);
    expect(person).not.toHaveProperty('address');
  });

  /**
   * `sameAs` is how a crawler ties the site to the person's other profiles,
   * and it is only believed where the page links them too.
   */
  test('names the same profiles the footer links', async ({ page }) => {
    await page.goto('/en');

    const person = (await structuredData(page)).find((node) => node['@type'] === 'Person');
    const linkedin = page.getByRole('contentinfo').getByRole('link', { name: 'LinkedIn' });

    await expect(linkedin).toHaveAttribute('href', /^https:\/\/www\.linkedin\.com\/in\/.+/);
    expect(person?.sameAs).toContain(await linkedin.getAttribute('href'));
  });

  /**
   * Structured data that says more than the page shows is what search engines
   * discount. Every question and answer in the markup has to be on the page,
   * word for word.
   */
  test('publishes the services page questions exactly as they are shown', async ({ page }) => {
    await page.goto('/ar/services');
    const nodes = await structuredData(page);

    expect(nodes.filter((node) => node['@type'] === 'Service')).toHaveLength(3);

    const faq = nodes.find((node) => node['@type'] === 'FAQPage');
    const questions = faq?.mainEntity as { name: string; acceptedAnswer: { text: string } }[];
    expect(questions.length).toBeGreaterThanOrEqual(5);

    const main = page.getByRole('main');
    for (const question of questions) {
      await expect(main.getByText(question.name, { exact: true })).toBeVisible();
      await expect(main.getByText(question.acceptedAnswer.text, { exact: true })).toBeVisible();
    }
  });

  test('gives each kind of page its own node and a breadcrumb trail', async ({ page }) => {
    for (const [path, type] of [
      ['/en/work/sila', 'TechArticle'],
      ['/en/blog/stateful-whatsapp-flow-engine', 'BlogPosting'],
      ['/en/expertise/whatsapp-cloud-api', 'CollectionPage'],
    ] as const) {
      await page.goto(path);
      const nodes = await structuredData(page);

      expect(
        nodes.some((node) => node['@type'] === type),
        `${path} has no ${type}`,
      ).toBe(true);

      const trail = nodes.find((node) => node['@type'] === 'BreadcrumbList');
      const crumbs = trail?.itemListElement as { item: string }[];
      // The trail ends on the page it is printed on.
      expect(crumbs.at(-1)?.item.endsWith(path), `${path} breadcrumb`).toBe(true);
    }
  });
});
