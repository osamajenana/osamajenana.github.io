import type { ReactElement } from 'react';

import type { Locale } from '@/i18n/routing';

import ArPigeon from './flutter-ble-pigeon-platform-channels/ar.mdx';
import EnPigeon from './flutter-ble-pigeon-platform-channels/en.mdx';
import ArAiLayer from './provider-agnostic-ai-layer/ar.mdx';
import EnAiLayer from './provider-agnostic-ai-layer/en.mdx';
import ArFlowEngine from './stateful-whatsapp-flow-engine/ar.mdx';
import EnFlowEngine from './stateful-whatsapp-flow-engine/en.mdx';
import ArWebhooks from './verifying-meta-webhooks-raw-body/ar.mdx';
import EnWebhooks from './verifying-meta-webhooks-raw-body/en.mdx';

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
  'verifying-meta-webhooks-raw-body': {
    en: <EnWebhooks />,
    ar: <ArWebhooks />,
  },
  'flutter-ble-pigeon-platform-channels': {
    en: <EnPigeon />,
    ar: <ArPigeon />,
  },
  'provider-agnostic-ai-layer': {
    en: <EnAiLayer />,
    ar: <ArAiLayer />,
  },
};
