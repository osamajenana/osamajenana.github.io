import nextCoreWebVitals from 'eslint-config-next/core-web-vitals';
import nextTypeScript from 'eslint-config-next/typescript';
import jsxA11y from 'eslint-plugin-jsx-a11y';
import tseslint from 'typescript-eslint';

/**
 * eslint-config-next 16 ships native flat config, so it is spread directly —
 * FlatCompat cannot serialise it (circular plugin references).
 *
 * It already registers the `jsx-a11y` plugin but only enables 6 of its rules.
 * Accessibility is a hard requirement here, so the full recommended rule set is
 * layered on by name, reusing that same plugin registration rather than
 * redefining it.
 */
const a11yRecommendedRules = jsxA11y.flatConfigs.recommended.rules;

export default tseslint.config(
  {
    ignores: [
      '.next/**',
      'node_modules/**',
      'out/**',
      'coverage/**',
      'playwright-report/**',
      'test-results/**',
      '_assets-in/**',
      'next-env.d.ts',
    ],
  },

  ...nextCoreWebVitals,
  ...nextTypeScript,

  {
    name: 'portfolio/a11y',
    files: ['**/*.{jsx,tsx}'],
    rules: {
      ...a11yRecommendedRules,
      /*
       * WCAG requires a scrollable region to be keyboard-focusable (axe's
       * scrollable-region-focusable rule), which means a tabIndex on a container
       * that is not itself interactive. The rule has no way to know that, so
       * named regions and groups are permitted to carry one.
       */
      'jsx-a11y/no-noninteractive-tabindex': [
        'error',
        { tags: [], roles: ['tabpanel', 'region', 'group'], allowExpressionValues: true },
      ],
      // Next's <Link> renders a real anchor; the rule cannot see through it.
      'jsx-a11y/anchor-is-valid': [
        'error',
        { components: ['Link'], aspects: ['invalidHref', 'preferButton'] },
      ],
    },
  },

  {
    name: 'portfolio/typescript',
    files: ['**/*.{ts,tsx}'],
    languageOptions: {
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
    rules: {
      '@typescript-eslint/no-unused-vars': [
        'error',
        { argsIgnorePattern: '^_', varsIgnorePattern: '^_', caughtErrorsIgnorePattern: '^_' },
      ],
      // verbatimModuleSyntax is on; keep type-only imports explicit.
      '@typescript-eslint/consistent-type-imports': [
        'error',
        { prefer: 'type-imports', fixStyle: 'separate-type-imports' },
      ],
      '@typescript-eslint/no-floating-promises': 'error',
      // Locale-aware routing: next/link would escape the [locale] segment.
      'no-restricted-imports': [
        'error',
        {
          paths: [
            {
              name: 'next/link',
              message: "Import { Link } from '@/i18n/navigation' so hrefs stay locale-aware.",
            },
            {
              name: 'next/navigation',
              importNames: ['redirect', 'usePathname', 'useRouter'],
              message: "Import these from '@/i18n/navigation' instead.",
            },
          ],
        },
      ],
    },
  },

  // The i18n navigation module and the proxy are the one place allowed to reach
  // for next/* routing primitives directly.
  {
    name: 'portfolio/i18n-escape-hatch',
    files: ['src/i18n/navigation.ts', 'src/proxy.ts'],
    rules: { 'no-restricted-imports': 'off' },
  },

  // R3F's JSX elements are three.js objects, not DOM nodes — DOM a11y rules and
  // unknown-property checks do not apply.
  {
    name: 'portfolio/three',
    files: ['src/components/three/**/*.tsx'],
    rules: {
      'jsx-a11y/no-static-element-interactions': 'off',
      'jsx-a11y/click-events-have-key-events': 'off',
      'jsx-a11y/mouse-events-have-key-events': 'off',
      'react/no-unknown-property': 'off',
    },
  },
);
