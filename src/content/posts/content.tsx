import type { ReactElement } from 'react';

import type { Locale } from '@/i18n/routing';

import ArFlowEngine from './stateful-whatsapp-flow-engine/ar.mdx';
import EnFlowEngine from './stateful-whatsapp-flow-engine/en.mdx';

/**
 * Post bodies as ready-made elements, keyed by slug and locale.
 *
 * Two deliberate choices:
 *
 *  - Imported eagerly rather than resolved by path. A dynamic
 *    `import(\`./\${slug}/\${locale}.mdx\`)` would turn a missing or misnamed
 *    translation into a 500 in production; listing them makes it a compile error.
 *
 *  - Elements, not component references. Handing a page a component to put in a
 *    variable and render trips React's static-components rule, because from the
 *    outside it is indistinguishable from building a component on the fly. An
 *    element is plain data, so the page just renders it.
 *
 * These are server-rendered at build time; nothing here reaches the client bundle.
 */
export const postBodies: Record<string, Record<Locale, ReactElement>> = {
  'stateful-whatsapp-flow-engine': {
    en: <EnFlowEngine />,
    ar: <ArFlowEngine />,
  },
};
