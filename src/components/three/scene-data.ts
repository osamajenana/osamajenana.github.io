import type { Localized } from '@/lib/schemas';

/**
 * The hero scene is a 3D graph of the stack these projects actually run on.
 * Every label and every figure is real — the numbers come from the project
 * registry, so the scene is evidence rather than decoration.
 *
 * `essential` marks the five nodes kept on small screens; the other two are
 * dropped there to hold the frame budget.
 */

export type NodeId = 'client' | 'nginx' | 'app' | 'redis' | 'mysql' | 'reverb' | 'ai';

export type SceneNode = {
  id: NodeId;
  label: string;
  detail: Localized;
  /** [x, y, z] in world units. Camera sits at z ≈ 8 looking at the origin. */
  position: [number, number, number];
  radius: number;
  accent: 'brand' | 'ai' | 'neutral';
  essential: boolean;
};

export const nodes: SceneNode[] = [
  {
    id: 'client',
    label: 'Client',
    detail: {
      en: 'WhatsApp · web · mobile apps',
      ar: 'واتساب · ويب · تطبيقات موبايل',
    },
    position: [-3.5, 1.5, 0.4],
    radius: 0.3,
    accent: 'neutral',
    essential: true,
  },
  {
    id: 'nginx',
    label: 'nginx',
    detail: {
      en: 'TLS termination and reverse proxy — including for this site',
      ar: 'إنهاء TLS و reverse proxy — لهذا الموقع أيضاً',
    },
    position: [-1.7, 0.5, -0.5],
    radius: 0.32,
    accent: 'brand',
    essential: true,
  },
  {
    id: 'app',
    label: 'Laravel / Next.js',
    detail: {
      en: 'Application layer — 40+ shipped systems',
      ar: 'طبقة التطبيق — أكثر من 40 نظاماً مشحوناً',
    },
    position: [0.2, 1.1, 0.5],
    radius: 0.46,
    accent: 'brand',
    essential: true,
  },
  {
    id: 'redis',
    label: 'Redis + Queue',
    detail: {
      en: 'Async jobs and cache — keeps slow work off the request',
      ar: 'مهام غير متزامنة وكاش — يُبقي العمل البطيء خارج الطلب',
    },
    position: [2.2, 1.7, -0.4],
    radius: 0.33,
    accent: 'brand',
    essential: false,
  },
  {
    id: 'mysql',
    label: 'MySQL',
    detail: {
      en: '78 models and 138 migrations in one system alone',
      ar: '78 موديلاً و138 migration في نظام واحد فقط',
    },
    position: [0.5, -1.5, -0.2],
    radius: 0.38,
    accent: 'neutral',
    essential: true,
  },
  {
    id: 'reverb',
    label: 'Reverb (WS)',
    detail: {
      en: 'WebSockets pushing live order boards back to operators',
      ar: 'WebSockets تدفع لوحات الطلبات الحية للمشغّلين',
    },
    position: [-1.9, -1.3, 0.5],
    radius: 0.3,
    accent: 'brand',
    essential: false,
  },
  {
    id: 'ai',
    label: 'AI layer',
    detail: {
      en: 'Provider-agnostic — the model swaps without touching business logic',
      ar: 'مستقلة عن المزوّد — يُبدَّل الموديل دون المساس بمنطق الأعمال',
    },
    position: [3.5, 0.2, 0.3],
    radius: 0.36,
    accent: 'ai',
    essential: true,
  },
];

export type SceneEdge = {
  from: NodeId;
  to: NodeId;
  /** Pulls the midpoint off the straight line so edges arc instead of crossing. */
  bow: [number, number, number];
  accent: 'brand' | 'ai' | 'neutral';
  /** Relative packet speed. Slower on the paths that are genuinely slower. */
  speed: number;
};

export const edges: SceneEdge[] = [
  { from: 'client', to: 'nginx', bow: [0, 0.35, 0.3], accent: 'neutral', speed: 1 },
  { from: 'nginx', to: 'app', bow: [0, 0.4, 0.2], accent: 'brand', speed: 1.1 },
  { from: 'app', to: 'redis', bow: [0.2, 0.35, -0.3], accent: 'brand', speed: 0.85 },
  { from: 'app', to: 'mysql', bow: [-0.4, -0.1, 0.25], accent: 'neutral', speed: 1.25 },
  { from: 'redis', to: 'ai', bow: [0.5, -0.4, 0.2], accent: 'ai', speed: 0.6 },
  { from: 'ai', to: 'app', bow: [0.3, -0.9, -0.4], accent: 'ai', speed: 0.7 },
  { from: 'app', to: 'reverb', bow: [-0.55, -0.2, 0.3], accent: 'brand', speed: 1.15 },
  { from: 'reverb', to: 'client', bow: [-0.7, 0.5, 0.2], accent: 'brand', speed: 1.3 },
];

export const nodeById = new Map(nodes.map((node) => [node.id, node]));

/**
 * Palette per theme, mirroring the semantic tokens in globals.css. WebGL cannot
 * read CSS custom properties, so these values are duplicated here on purpose —
 * they must be kept in step with `--brand` and `--ai` by hand.
 */
export type Palette = {
  brand: string;
  ai: string;
  neutral: string;
};

export const palettes: Record<'dark' | 'light', Palette> = {
  dark: {
    brand: '#5b8cff',
    ai: '#35e0a1',
    neutral: '#7c8598',
  },
  light: {
    brand: '#2e5fe8',
    ai: '#0a8f66',
    neutral: '#8a93a3',
  },
};
