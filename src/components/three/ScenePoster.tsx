import { edges, nodeById, nodes } from './scene-data';

/**
 * The still that stands in for the 3D scene.
 *
 * It is inline SVG rather than an image on purpose: nothing to download, so the
 * first paint has no network dependency at all, and it inherits the theme's
 * `currentColor` instead of needing a light and a dark file.
 *
 * Shown for: `prefers-reduced-motion`, no WebGL, and the moment before the
 * canvas chunk arrives.
 */
export function ScenePoster() {
  // World units → SVG viewBox. The scene spans roughly x ∈ [-4, 4], y ∈ [-2, 2].
  const toX = (x: number) => 200 + x * 44;
  const toY = (y: number) => 100 - y * 44;

  return (
    <svg
      viewBox="0 0 400 200"
      className="h-full w-full"
      preserveAspectRatio="xMidYMid meet"
      aria-hidden
      focusable="false"
    >
      <g stroke="currentColor" className="text-line" strokeWidth="0.6" fill="none">
        {edges.map((edge) => {
          const from = nodeById.get(edge.from);
          const to = nodeById.get(edge.to);
          if (!from || !to) return null;

          const mx = (from.position[0] + to.position[0]) / 2 + edge.bow[0];
          const my = (from.position[1] + to.position[1]) / 2 + edge.bow[1];

          return (
            <path
              key={`${edge.from}-${edge.to}`}
              d={`M ${toX(from.position[0])} ${toY(from.position[1])} Q ${toX(mx)} ${toY(my)} ${toX(to.position[0])} ${toY(to.position[1])}`}
            />
          );
        })}
      </g>

      {nodes.map((node) => (
        <g key={node.id}>
          <circle
            cx={toX(node.position[0])}
            cy={toY(node.position[1])}
            r={node.radius * 26}
            className={
              node.accent === 'ai'
                ? 'fill-ai/12'
                : node.accent === 'brand'
                  ? 'fill-brand/12'
                  : 'fill-ink-subtle/12'
            }
          />
          <circle
            cx={toX(node.position[0])}
            cy={toY(node.position[1])}
            r={node.radius * 13}
            fill="none"
            strokeWidth="1"
            className={
              node.accent === 'ai'
                ? 'stroke-ai/70'
                : node.accent === 'brand'
                  ? 'stroke-brand/70'
                  : 'stroke-ink-subtle/70'
            }
          />
          <text
            x={toX(node.position[0])}
            y={toY(node.position[1]) + node.radius * 13 + 9}
            textAnchor="middle"
            className="fill-ink-subtle font-mono text-[5.5px]"
          >
            {node.label}
          </text>
        </g>
      ))}
    </svg>
  );
}
