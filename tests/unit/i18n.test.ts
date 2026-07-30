import { describe, expect, it } from 'vitest';

import ar from '@/i18n/messages/ar.json';
import en from '@/i18n/messages/en.json';

/**
 * The catalogues are the easiest thing on this site to break silently: add a key
 * in English, forget the Arabic, and next-intl renders the key name on a live
 * page. These tests make that a failing build instead.
 */

type Nested = { [key: string]: string | Nested };

function flatten(value: Nested, prefix = ''): Map<string, string> {
  const out = new Map<string, string>();
  for (const [key, entry] of Object.entries(value)) {
    const path = prefix ? `${prefix}.${key}` : key;
    if (typeof entry === 'string') out.set(path, entry);
    else for (const [k, v] of flatten(entry, path)) out.set(k, v);
  }
  return out;
}

/** ICU placeholders such as `{count}`. */
function placeholdersOf(message: string): string[] {
  return [...message.matchAll(/\{(\w+)[^}]*\}/g)].map((match) => match[1] ?? '').sort();
}

const enFlat = flatten(en as Nested);
const arFlat = flatten(ar as Nested);

describe('message catalogues', () => {
  it('have identical key sets', () => {
    const missingInArabic = [...enFlat.keys()].filter((key) => !arFlat.has(key));
    const missingInEnglish = [...arFlat.keys()].filter((key) => !enFlat.has(key));

    expect({ missingInArabic, missingInEnglish }).toEqual({
      missingInArabic: [],
      missingInEnglish: [],
    });
  });

  it('contain no empty or whitespace-only messages', () => {
    const blank = [...enFlat, ...arFlat]
      .filter(([, message]) => message.trim().length === 0)
      .map(([key]) => key);

    expect(blank).toEqual([]);
  });

  it('use the same ICU placeholders in both locales', () => {
    const mismatched: string[] = [];

    for (const [key, message] of enFlat) {
      const arabic = arFlat.get(key);
      if (arabic === undefined) continue;

      const a = placeholdersOf(message);
      const b = placeholdersOf(arabic);
      if (a.join(',') !== b.join(',')) {
        mismatched.push(`${key}: en[${a.join(',')}] vs ar[${b.join(',')}]`);
      }
    }

    expect(mismatched).toEqual([]);
  });

  it('do not leave untranslated English in the Arabic catalogue', () => {
    /**
     * Technology names, brand names and the language switch labels are legitimately
     * identical in both files. Anything else being byte-identical is almost
     * certainly a copy-paste that never got translated.
     */
    const allowed = new Set([
      'locale.en',
      'locale.ar',
      'hero.stack',
      'theme.toggle',
      'caseStudy.chose',
    ]);

    const identical = [...enFlat]
      .filter(([key, message]) => !allowed.has(key) && arFlat.get(key) === message)
      .map(([key]) => key);

    expect(identical).toEqual([]);
  });
});
