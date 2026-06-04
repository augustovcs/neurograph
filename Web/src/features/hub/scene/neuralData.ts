import * as THREE from "three";
import { buildNeurons } from "@/mocks/data";
import type { NeuronGroup, NeuronStatus } from "@/lib/types";

/**
 * Paleta DESSATURADA para o mundo 3D — mantém a identidade de cada grupo,
 * mas sem o neon forte. Cores calmas que assentam bem sobre o fundo grafite.
 */
export const SOFT_GROUP_COLOR: Record<NeuronGroup, string> = {
  sensory: "#6fa8b5", // ciano dessaturado
  motor: "#74b59a", // verde sálvia
  inter: "#9a8fc4", // lilás suave
  excitatory: "#c9ad6b", // âmbar empoeirado
  inhibitory: "#c08aa6", // rosa antigo
  modulatory: "#c79270", // terracota suave
};

export interface NeuronNode3D {
  id: string;
  label: string;
  group: NeuronGroup;
  status: NeuronStatus;
  color: THREE.Color;
  position: THREE.Vector3;
  radius: number;
  /** semente p/ dessincronizar animações de pulso */
  seed: number;
}

export interface NeuralEdge3D {
  id: string;
  a: number; // índice do nó de origem
  b: number; // índice do nó de destino
  active: boolean; // sinapse "viva" (pulso viaja por ela)
}

export interface NeuralGraph3D {
  nodes: NeuronNode3D[];
  edges: NeuralEdge3D[];
}

export function buildGraph3D(count = 26): NeuralGraph3D {
  const neurons = buildNeurons(count);
  const idToIndex = new Map<string, number>();

  // Nuvem SOLTA em 3D: alguns "núcleos" espalhados no espaço, com neurônios
  // distribuídos em volta de cada um. Nenhum neurônio fica preso no centro.
  const rng = mulberry32(0x9e3779b1);
  const CLUSTERS = 3;
  const centers = Array.from(
    { length: CLUSTERS },
    () => new THREE.Vector3((rng() - 0.5) * 10, (rng() - 0.5) * 6.5, (rng() - 0.5) * 10),
  );

  const nodes: NeuronNode3D[] = neurons.map((n, i) => {
    const center = centers[i % CLUSTERS];
    const dir = new THREE.Vector3(rng() - 0.5, rng() - 0.5, rng() - 0.5).normalize();
    const dist = 1.3 + Math.cbrt(rng()) * 3.4; // volume preenchido, sem dead-center
    const position = center.clone().add(dir.multiplyScalar(dist));

    idToIndex.set(n.id, i);

    return {
      id: n.id,
      label: n.label,
      group: n.group,
      status: n.status,
      color: new THREE.Color(SOFT_GROUP_COLOR[n.group]),
      position,
      radius: 0.18 + n.generation * 0.05 + (n.status === "firing" ? 0.04 : 0),
      seed: (i * 53) % 100,
    };
  });

  // Recentraliza a NUVEM (o conjunto) na origem — sem fixar nenhum neurônio lá.
  const centroid = nodes
    .reduce((acc, n) => acc.add(n.position), new THREE.Vector3())
    .multiplyScalar(1 / nodes.length);
  for (const n of nodes) n.position.sub(centroid);

  const edges: NeuralEdge3D[] = [];
  const seen = new Set<string>();
  const addEdge = (sourceId: string, targetId: string, active: boolean) => {
    const a = idToIndex.get(sourceId);
    const b = idToIndex.get(targetId);
    if (a === undefined || b === undefined) return;
    const id = `${sourceId}-${targetId}`;
    if (seen.has(id)) return; // evita arestas duplicadas (key repetida)
    seen.add(id);
    edges.push({ id, a, b, active });
  };
  const nid = (i: number) => `N-${String(i).padStart(4, "0")}`;

  // Centro → casca 1
  for (let i = 1; i < 9; i++) addEdge(nid(0), nid(i), i % 2 === 0);
  // Casca 1 → casca 2
  for (let i = 9; i < 19; i++) addEdge(nid(1 + (i % 8)), nid(i), i % 3 === 0);
  // Casca 2 → casca 3
  for (let i = 19; i < 26; i++) addEdge(nid(9 + (i % 10)), nid(i), i % 2 === 0);
  // Conexões cruzadas
  addEdge(nid(3), nid(14), true);
  addEdge(nid(11), nid(22), false);
  addEdge(nid(5), nid(17), false);

  return { nodes, edges };
}

/* ── RNG determinístico (mulberry32) ─────────────────────────────────────── */
function mulberry32(seed: number) {
  let a = seed >>> 0;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/**
 * Gera árvores DENDRÍTICAS ramificadas para cada neurônio (filamentos que saem
 * do soma e se bifurcam, afinando nas pontas). Retorna arrays prontos para um
 * único LineSegments com cor por vértice — barato de renderizar.
 */
export function buildDendrites(nodes: NeuronNode3D[]): {
  positions: Float32Array;
  colors: Float32Array;
} {
  const positions: number[] = [];
  const colors: number[] = [];

  for (const node of nodes) {
    if (node.status === "dead") continue;
    const rng = mulberry32(node.seed + 9973);
    const c = node.color;
    // Direção geral "para fora" do centro da rede, para os dendritos abrirem no espaço.
    const outward = node.position.clone().normalize();
    const roots = 5 + Math.floor(rng() * 4); // 5–8 troncos

    const grow = (
      start: THREE.Vector3,
      dir: THREE.Vector3,
      length: number,
      depth: number,
      width: number,
    ) => {
      const steps = 3 + Math.floor(rng() * 2);
      let cur = start.clone();
      let d = dir.clone().normalize();
      for (let s = 0; s < steps; s++) {
        // perturbação perpendicular → curva orgânica
        const perp = new THREE.Vector3(rng() - 0.5, rng() - 0.5, rng() - 0.5);
        d.add(perp.multiplyScalar(0.5)).normalize();
        const seg = (length / steps) * (1 - s * 0.12);
        const next = cur.clone().add(d.clone().multiplyScalar(seg));
        // brilho desbota em direção à ponta
        const fade = 0.85 - (s / steps) * 0.55 - (3 - depth) * 0.1;
        positions.push(cur.x, cur.y, cur.z, next.x, next.y, next.z);
        for (let k = 0; k < 2; k++) colors.push(c.r * fade, c.g * fade, c.b * fade);
        cur = next;
      }
      // bifurcações
      if (depth > 0) {
        const branches = rng() < 0.7 ? 2 : 1;
        for (let b = 0; b < branches; b++) {
          const bend = new THREE.Vector3(rng() - 0.5, rng() - 0.5, rng() - 0.5).multiplyScalar(0.9);
          grow(cur, d.clone().add(bend), length * 0.62, depth - 1, width * 0.6);
        }
      }
    };

    for (let r = 0; r < roots; r++) {
      // direções espalhadas, com viés para fora
      const dir = new THREE.Vector3(rng() - 0.5, rng() - 0.5, rng() - 0.5)
        .normalize()
        .add(outward.clone().multiplyScalar(0.4))
        .normalize();
      const start = node.position.clone().add(dir.clone().multiplyScalar(node.radius * 0.9));
      grow(start, dir, 0.9 + rng() * 0.7, 2, 1);
    }
  }

  return { positions: new Float32Array(positions), colors: new Float32Array(colors) };
}

/** Curva suave (axônio) entre dois neurônios, abaulada para fora do centro. */
export function axonCurve(a: THREE.Vector3, b: THREE.Vector3): THREE.CatmullRomCurve3 {
  const mid = a.clone().add(b).multiplyScalar(0.5);
  const bulge = mid.clone().normalize().multiplyScalar(0.6 + mid.length() * 0.12);
  mid.add(bulge);
  return new THREE.CatmullRomCurve3([a.clone(), mid, b.clone()]);
}
