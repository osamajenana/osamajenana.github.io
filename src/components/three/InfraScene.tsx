'use client';

import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import { useLocale } from 'next-intl';
import { useTheme } from 'next-themes';
import { useMemo, useRef, useState } from 'react';
import * as THREE from 'three';

import type { Locale } from '@/i18n/routing';
import { edges, nodeById, nodes, palettes } from './scene-data';
import type { NodeId, Palette, SceneEdge, SceneNode } from './scene-data';

/**
 * A 3D graph of the production stack. Data packets travel the edges, the camera
 * drifts with the pointer, and hovering a node reveals a real figure about it.
 *
 * There is deliberately no post-processing pass. Bloom would cost a full-screen
 * render target for a glow that additive sprites give for free, and this scene
 * has to hold 60fps on a mid-range phone.
 */

/**
 * Fresnel shell. Both the normal and the view direction are computed in WORLD
 * space — mixing spaces (a view-space normal against a world-space view vector)
 * makes the dot product meaningless and the rim collapses to nothing.
 */
const RIM_VERTEX = /* glsl */ `
  varying vec3 vNormal;
  varying vec3 vView;
  void main() {
    vec4 worldPosition = modelMatrix * vec4(position, 1.0);
    vNormal = normalize(mat3(modelMatrix) * normal);
    vView = normalize(cameraPosition - worldPosition.xyz);
    gl_Position = projectionMatrix * viewMatrix * worldPosition;
  }
`;

const RIM_FRAGMENT = /* glsl */ `
  uniform vec3 uColor;
  uniform float uIntensity;
  uniform float uBase;
  varying vec3 vNormal;
  varying vec3 vView;
  void main() {
    // Bright where the surface turns away from the camera, which reads as a lit
    // edge without needing an actual light in the scene.
    float facing = clamp(dot(normalize(vNormal), normalize(vView)), 0.0, 1.0);
    float rim = pow(1.0 - facing, 2.0);
    gl_FragColor = vec4(uColor, clamp(rim * uIntensity + uBase, 0.0, 1.0));
  }
`;

const FLOW_VERTEX = /* glsl */ `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const FLOW_FRAGMENT = /* glsl */ `
  uniform vec3 uColor;
  uniform float uTime;
  uniform float uSpeed;
  uniform float uRepeat;
  uniform float uBase;
  varying vec2 vUv;
  void main() {
    // uv.x runs along the tube, so a moving fract() window is a dash that
    // travels from one node to the next.
    float t = fract(vUv.x * uRepeat - uTime * uSpeed);
    float dash = smoothstep(0.0, 0.06, t) * (1.0 - smoothstep(0.10, 0.34, t));
    gl_FragColor = vec4(uColor, dash * 0.85 + uBase);
  }
`;

function colorOf(palette: Palette, accent: 'brand' | 'ai' | 'neutral') {
  return accent === 'ai' ? palette.ai : accent === 'brand' ? palette.brand : palette.neutral;
}

/**
 * Soft radial falloff drawn once into a canvas and reused by every halo.
 *
 * A `spriteMaterial` with no map renders a hard square quad, which reads as a
 * grey box behind each node rather than a glow — this is the texture that makes
 * it a glow. Generated in code so there is no image to download.
 */
function useGlowTexture() {
  return useMemo(() => {
    const size = 128;
    const canvas = document.createElement('canvas');
    canvas.width = size;
    canvas.height = size;

    const ctx = canvas.getContext('2d');
    if (!ctx) return null;

    const gradient = ctx.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2);
    gradient.addColorStop(0, 'rgba(255,255,255,1)');
    gradient.addColorStop(0.35, 'rgba(255,255,255,0.35)');
    gradient.addColorStop(1, 'rgba(255,255,255,0)');

    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, size, size);

    const texture = new THREE.CanvasTexture(canvas);
    texture.colorSpace = THREE.SRGBColorSpace;
    return texture;
  }, []);
}

/** Quadratic bezier through a bowed midpoint, shared by the tube and its packet. */
function curveFor(edge: SceneEdge) {
  const from = nodeById.get(edge.from);
  const to = nodeById.get(edge.to);
  if (!from || !to) throw new Error(`scene edge references unknown node: ${edge.from}→${edge.to}`);

  const start = new THREE.Vector3(...from.position);
  const end = new THREE.Vector3(...to.position);
  const mid = start
    .clone()
    .add(end)
    .multiplyScalar(0.5)
    .add(new THREE.Vector3(...edge.bow));

  return new THREE.QuadraticBezierCurve3(start, mid, end);
}

function Edge({ edge, palette }: { edge: SceneEdge; palette: Palette }) {
  const curve = useMemo(() => curveFor(edge), [edge]);
  const geometry = useMemo(() => new THREE.TubeGeometry(curve, 48, 0.012, 6, false), [curve]);
  const packet = useRef<THREE.Mesh>(null);
  const material = useRef<THREE.ShaderMaterial>(null);

  const color = colorOf(palette, edge.accent);

  const uniforms = useMemo(
    () => ({
      uColor: { value: new THREE.Color(color) },
      uTime: { value: 0 },
      uSpeed: { value: edge.speed * 0.22 },
      uRepeat: { value: 3 },
      uBase: { value: 0.34 },
    }),
    [color, edge.speed],
  );

  useFrame(({ clock }) => {
    const time = clock.elapsedTime;

    const uTime = material.current?.uniforms.uTime;
    if (uTime) uTime.value = time;

    if (packet.current) {
      // Each edge carries one packet; offsetting by speed keeps them out of sync.
      const t = (time * edge.speed * 0.19) % 1;
      packet.current.position.copy(curve.getPointAt(t));
      const pulse = 0.55 + Math.sin(t * Math.PI) * 0.45;
      packet.current.scale.setScalar(pulse);
    }
  });

  return (
    <group>
      <mesh geometry={geometry}>
        <shaderMaterial
          ref={material}
          vertexShader={FLOW_VERTEX}
          fragmentShader={FLOW_FRAGMENT}
          uniforms={uniforms}
          transparent
          depthWrite={false}
        />
      </mesh>

      <mesh ref={packet}>
        <sphereGeometry args={[0.045, 12, 12]} />
        <meshBasicMaterial color={color} transparent opacity={0.95} />
      </mesh>
    </group>
  );
}

function Node({
  node,
  palette,
  locale,
  hovered,
  onHover,
  glow,
  additive,
}: {
  node: SceneNode;
  palette: Palette;
  locale: Locale;
  hovered: boolean;
  onHover: (id: NodeId | null) => void;
  glow: THREE.Texture | null;
  /** Additive glow reads as light on a dark page and as nothing on a light one. */
  additive: boolean;
}) {
  const group = useRef<THREE.Group>(null);
  const color = colorOf(palette, node.accent);

  const uniforms = useMemo(
    () => ({
      uColor: { value: new THREE.Color(color) },
      uIntensity: { value: 1.6 },
      uBase: { value: 0.14 },
    }),
    [color],
  );

  useFrame(({ clock }) => {
    if (!group.current) return;
    // Slow independent bob so the graph feels alive without drifting apart.
    const seed = node.position[0] + node.position[1];
    group.current.position.y = node.position[1] + Math.sin(clock.elapsedTime * 0.5 + seed) * 0.045;
    group.current.rotation.y += 0.0015;

    const target = hovered ? 1.12 : 1;
    group.current.scale.lerp(new THREE.Vector3(target, target, target), 0.12);
  });

  return (
    <group ref={group} position={node.position}>
      {/* Solid core, so a node reads as an object rather than a haze. This also
          carries the pointer hit area. */}
      <mesh
        onPointerOver={(event) => {
          event.stopPropagation();
          onHover(node.id);
        }}
        onPointerOut={() => onHover(null)}
      >
        <icosahedronGeometry args={[node.radius * 0.62, 2]} />
        <meshBasicMaterial color={color} transparent opacity={0.92} />
      </mesh>

      {/* Fresnel shell around the core. */}
      <mesh>
        <icosahedronGeometry args={[node.radius, 1]} />
        <shaderMaterial
          vertexShader={RIM_VERTEX}
          fragmentShader={RIM_FRAGMENT}
          uniforms={uniforms}
          transparent
          depthWrite={false}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* Halo — the cheap stand-in for a bloom pass. Needs the radial texture,
          otherwise the sprite is a solid square. */}
      {glow && (
        <sprite scale={node.radius * 5}>
          <spriteMaterial
            map={glow}
            color={color}
            transparent
            opacity={hovered ? 0.45 : 0.26}
            blending={additive ? THREE.AdditiveBlending : THREE.NormalBlending}
            depthWrite={false}
          />
        </sprite>
      )}

      <Html center distanceFactor={9} position={[0, -node.radius - 0.3, 0]} zIndexRange={[10, 0]}>
        <div className="pointer-events-none -translate-y-1/2 text-center select-none">
          <p
            className="font-mono text-[11px] whitespace-nowrap"
            style={{ color: hovered ? color : 'var(--ink-subtle)' }}
          >
            {node.label}
          </p>
          {hovered && (
            <p className="mt-1 max-w-[13rem] text-[11px] leading-snug text-ink-muted">
              {node.detail[locale]}
            </p>
          )}
        </div>
      </Html>
    </group>
  );
}

/**
 * Sole owner of the camera. Two jobs, deliberately in one place because they
 * both write `position`:
 *
 *  1. Framing — pull back far enough that the whole graph fits the container's
 *     aspect ratio. A fixed distance drops the outermost nodes off the edge of a
 *     narrow column, which is exactly what the first pass did.
 *  2. Parallax — lean with the pointer. Not a full orbit: that is disorienting
 *     in a hero and swallows scroll gestures on touch.
 */
function CameraRig({ spread }: { spread: { x: number; y: number } }) {
  const { camera, pointer, size } = useThree();
  const target = useMemo(() => new THREE.Vector3(), []);

  useFrame(() => {
    if (!(camera instanceof THREE.PerspectiveCamera) || size.height === 0) return;

    const aspect = size.width / size.height;
    const tanHalfFov = Math.tan((camera.fov * Math.PI) / 360);

    // Distance that fits each axis; take the larger and add a margin so nodes
    // and their labels never touch the edge.
    const restZ = Math.max(spread.y / tanHalfFov, spread.x / (tanHalfFov * aspect)) * 1.12;

    target.set(pointer.x * 0.9, pointer.y * 0.5, restZ);
    camera.position.lerp(target, 0.035);
    camera.lookAt(0, 0, 0);
  });

  return null;
}

export default function InfraScene({
  compact = false,
  paused = false,
}: {
  compact?: boolean;
  /** Stops the render loop entirely when the hero is off screen or hidden. */
  paused?: boolean;
}) {
  const locale = useLocale() as Locale;
  const { resolvedTheme } = useTheme();
  const [hovered, setHovered] = useState<NodeId | null>(null);
  const glow = useGlowTexture();

  // This component is client-only (ssr: false), so the resolved theme is already
  // available on first render and switching it re-renders the palette.
  const palette = resolvedTheme === 'light' ? palettes.light : palettes.dark;

  const visibleNodes = compact ? nodes.filter((node) => node.essential) : nodes;
  const visibleIds = new Set(visibleNodes.map((node) => node.id));
  const visibleEdges = edges.filter((edge) => visibleIds.has(edge.from) && visibleIds.has(edge.to));

  // Half-extent of the visible graph, padded for node radius and label text.
  const spread = useMemo(() => {
    const xs = visibleNodes.map((node) => Math.abs(node.position[0]) + node.radius + 0.5);
    const ys = visibleNodes.map((node) => Math.abs(node.position[1]) + node.radius + 0.6);
    return { x: Math.max(...xs), y: Math.max(...ys) };
  }, [visibleNodes]);

  return (
    <Canvas
      camera={{ position: [0, 0, 9], fov: 42 }}
      dpr={compact ? [1, 1.5] : [1, 1.75]}
      frameloop={paused ? 'never' : 'always'}
      gl={{ antialias: !compact, alpha: true, powerPreference: 'high-performance' }}
      // The scene is decorative; its content is described in the hero's text
      // alternative, so it is hidden from assistive technology.
      aria-hidden
    >
      <CameraRig spread={spread} />

      {visibleEdges.map((edge) => (
        <Edge key={`${edge.from}-${edge.to}`} edge={edge} palette={palette} />
      ))}

      {visibleNodes.map((node) => (
        <Node
          key={node.id}
          node={node}
          palette={palette}
          locale={locale}
          hovered={hovered === node.id}
          onHover={setHovered}
          glow={glow}
          additive={resolvedTheme !== 'light'}
        />
      ))}
    </Canvas>
  );
}
