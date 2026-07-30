import type { Locale } from '@/i18n/routing';
import type { Localized } from '@/lib/schemas';
import { cn } from '@/lib/utils';

/**
 * Renders an architecture diagram from data rather than hand-drawn SVG.
 *
 * Every diagram on the site goes through this one component, so they share a
 * visual language, inherit the theme through Tailwind colour classes, and stay
 * legible at any size. Hand-authoring six SVGs would have produced six
 * different-looking pictures that all need editing when the palette changes.
 *
 * Anonymized projects have no screenshot to show, so this carries their visual
 * weight — and for the systems whose value *is* the architecture, a diagram
 * says more than a screenshot of a dashboard ever could.
 */

export type DiagramTone = 'brand' | 'ai' | 'neutral' | 'edge';

export type DiagramNode = {
  id: string;
  /** Technology or component name, rendered in the mono face. */
  label: string;
  sub?: Localized;
  /** Zero-indexed grid position. */
  col: number;
  row: number;
  tone: DiagramTone;
  /** Spans two grid rows — for a component that serves several lanes. */
  tall?: boolean;
};

export type DiagramEdge = {
  from: string;
  to: string;
  label?: Localized;
  /** Dashed reads as asynchronous: queued, webhooked, eventually consistent. */
  async?: boolean;
};

export type DiagramSpec = {
  caption: Localized;
  nodes: DiagramNode[];
  edges: DiagramEdge[];
};

// Grid geometry, in viewBox units.
const COL_W = 190;
const ROW_H = 92;
const BOX_W = 150;
const BOX_H = 52;
const PAD_X = 24;
const PAD_Y = 30;
/** Extra height reserved for the backward-edge return lane. */
const LANE_H = 34;

const toneFill: Record<DiagramTone, string> = {
  brand: 'fill-brand-dim stroke-brand/45',
  ai: 'fill-ai-dim stroke-ai/45',
  neutral: 'fill-raised stroke-line-strong',
  edge: 'fill-transparent stroke-line-strong',
};

const toneText: Record<DiagramTone, string> = {
  brand: 'fill-brand',
  ai: 'fill-ai',
  neutral: 'fill-ink',
  edge: 'fill-ink-muted',
};

type Box = { x: number; y: number; w: number; h: number; cx: number; cy: number };

function boxOf(node: DiagramNode): Box {
  const x = PAD_X + node.col * COL_W;
  const y = PAD_Y + node.row * ROW_H;
  const h = node.tall ? BOX_H + ROW_H - (ROW_H - BOX_H) : BOX_H;
  return { x, y, w: BOX_W, h, cx: x + BOX_W / 2, cy: y + h / 2 };
}

function isBackward(a: Box, b: Box): boolean {
  return b.x + b.w <= a.x + 1;
}

/**
 * Connector routing.
 *
 *  - Forward, same row  → a straight line.
 *  - Forward, other row → a flat S-curve between the facing sides.
 *  - Same column        → a straight vertical.
 *  - Backward           → down into a return lane beneath every box, across,
 *                         and back up.
 *
 * The return lane matters: routing a backward edge straight through the middle
 * draws it over whatever boxes sit in between, which is what the first version
 * did to the Redis node in the WhatsApp diagram. It also reads correctly — a
 * backward edge *is* a return path.
 */
function pathBetween(a: Box, b: Box, lane: number): string {
  const sameRow = Math.abs(a.cy - b.cy) < 4;

  if (isBackward(a, b)) {
    return `M ${a.cx} ${a.y + a.h} C ${a.cx} ${lane}, ${b.cx} ${lane}, ${b.cx} ${b.y + b.h}`;
  }

  const forward = b.x >= a.x + a.w - 1;
  if (forward) {
    const x1 = a.x + a.w;
    const x2 = b.x;
    if (sameRow) return `M ${x1} ${a.cy} L ${x2} ${b.cy}`;
    const mid = x1 + (x2 - x1) / 2;
    return `M ${x1} ${a.cy} C ${mid} ${a.cy}, ${mid} ${b.cy}, ${x2} ${b.cy}`;
  }

  // Same column: straight vertical between the facing edges.
  const goingDown = b.cy > a.cy;
  const y1 = goingDown ? a.y + a.h : a.y;
  const y2 = goingDown ? b.y : b.y + b.h;
  return `M ${a.cx} ${y1} L ${b.cx} ${y2}`;
}

export function ArchDiagram({
  spec,
  locale,
  className,
  hideCaption = false,
}: {
  spec: DiagramSpec;
  locale: Locale;
  className?: string;
  /** On a card the caption duplicates the summary; the SVG keeps its own title. */
  hideCaption?: boolean;
}) {
  const boxes = new Map(spec.nodes.map((node) => [node.id, boxOf(node)]));

  const cols = Math.max(...spec.nodes.map((n) => n.col)) + 1;
  const rows = Math.max(...spec.nodes.map((n) => n.row + (n.tall ? 1 : 0))) + 1;
  const width = PAD_X * 2 + (cols - 1) * COL_W + BOX_W;
  const gridHeight = PAD_Y * 2 + (rows - 1) * ROW_H + BOX_H;

  // Only reserve space for the return lane when something actually uses it.
  const needsLane = spec.edges.some((edge) => {
    const a = boxes.get(edge.from);
    const b = boxes.get(edge.to);
    return a && b && isBackward(a, b);
  });

  const height = needsLane ? gridHeight + LANE_H : gridHeight;
  const lane = gridHeight + LANE_H - 10;

  const titleId = `diag-${spec.nodes[0]?.id ?? 'x'}`;

  return (
    <figure
      className={cn('max-w-full min-w-0 overflow-x-auto', className)}
      /*
       * A diagram wider than the viewport scrolls horizontally, which makes this
       * a scrollable region — so it has to be reachable and scrollable by
       * keyboard, and it needs a name for the focus announcement. Without the
       * tabIndex, axe flags it and a keyboard user simply cannot see the right
       * half of the picture.
       */
      tabIndex={0}
      role="group"
      aria-label={spec.caption[locale]}
    >
      <svg
        viewBox={`0 0 ${width} ${height}`}
        role="img"
        aria-labelledby={titleId}
        // Never smaller than this or the labels stop being readable; the parent
        // scrolls horizontally instead of squashing the diagram.
        style={{ minWidth: `${Math.min(width, 680)}px` }}
        className="h-auto w-full"
      >
        <title id={titleId}>{spec.caption[locale]}</title>

        <defs>
          <marker
            id="arch-arrow"
            viewBox="0 0 8 8"
            refX="7"
            refY="4"
            markerWidth="6"
            markerHeight="6"
            orient="auto-start-reverse"
          >
            <path d="M 0 1 L 7 4 L 0 7 z" className="fill-ink-subtle" />
          </marker>
        </defs>

        {/* Edges first so boxes always sit on top of the lines. */}
        <g>
          {spec.edges.map((edge) => {
            const a = boxes.get(edge.from);
            const b = boxes.get(edge.to);
            if (!a || !b) return null;

            const d = pathBetween(a, b, lane);
            const backward = isBackward(a, b);
            const labelX = (a.cx + b.cx) / 2;
            // A backward edge's label belongs on the return lane, not over the
            // boxes its midpoint happens to fall on.
            const labelY = backward ? lane - 6 : (a.cy + b.cy) / 2 - 7;

            return (
              <g key={`${edge.from}-${edge.to}`}>
                <path
                  d={d}
                  fill="none"
                  strokeWidth="1.2"
                  strokeDasharray={edge.async ? '4 3' : undefined}
                  markerEnd="url(#arch-arrow)"
                  className="stroke-line-strong"
                />
                {edge.label && (
                  <text
                    x={labelX}
                    y={labelY}
                    textAnchor="middle"
                    className="fill-ink-subtle text-[9px]"
                    // Diagram labels are technical and read left-to-right even
                    // inside an RTL page.
                    direction="ltr"
                  >
                    {edge.label[locale]}
                  </text>
                )}
              </g>
            );
          })}
        </g>

        <g>
          {spec.nodes.map((node) => {
            const box = boxes.get(node.id);
            if (!box) return null;

            return (
              <g key={node.id}>
                <rect
                  x={box.x}
                  y={box.y}
                  width={box.w}
                  height={box.h}
                  rx="8"
                  strokeWidth="1.2"
                  className={toneFill[node.tone]}
                />
                <text
                  x={box.cx}
                  y={node.sub ? box.cy - 3 : box.cy + 4}
                  textAnchor="middle"
                  direction="ltr"
                  className={cn('font-mono text-[11px] font-medium', toneText[node.tone])}
                >
                  {node.label}
                </text>
                {node.sub && (
                  <text
                    x={box.cx}
                    y={box.cy + 12}
                    textAnchor="middle"
                    className="fill-ink-subtle text-[8.5px]"
                  >
                    {node.sub[locale]}
                  </text>
                )}
              </g>
            );
          })}
        </g>
      </svg>

      {!hideCaption && (
        <figcaption className="mt-4 text-sm leading-relaxed text-ink-subtle">
          {spec.caption[locale]}
        </figcaption>
      )}
    </figure>
  );
}
