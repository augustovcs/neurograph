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
  group: NeuronGroup;
  status: NeuronStatus;
  color: THREE.Color;
  position: THREE.Vector3;
  radius: number;
}

/**
 * Gera só as POSIÇÕES dos neurônios — espalhados numa nuvem cujo tamanho cresce
 * com a quantidade (densidade ~constante), para que muitos neurônios não virem
 * um bolo central. Sem arestas, dendritos ou efeitos: geração rápida.
 */
export function buildNeuronNodes(count = 26): NeuronNode3D[] {
  const neurons = buildNeurons(count);
  const rng = mulberry32(0x9e3779b1);

  const clusters = Math.max(3, Math.round(count / 36));
  const perCluster = count / clusters;
  const globalSpread = 5.5 * Math.cbrt(count / 26); // raio da nuvem ∝ ∛count
  const localRadius = 2.4 * Math.cbrt(perCluster / 8); // raio de cada núcleo ∝ ∛membros

  const centers = Array.from(
    { length: clusters },
    () =>
      new THREE.Vector3(
        (rng() - 0.5) * 2 * globalSpread,
        (rng() - 0.5) * 1.3 * globalSpread, // levemente achatado no eixo Y
        (rng() - 0.5) * 2 * globalSpread,
      ),
  );

  const nodes: NeuronNode3D[] = neurons.map((n, i) => {
    const center = centers[i % clusters];
    const dir = new THREE.Vector3(rng() - 0.5, rng() - 0.5, rng() - 0.5).normalize();
    // ∛ → distribuição uniforme no volume da esfera (sem acúmulo no miolo)
    const dist = localRadius * (0.18 + 0.82 * Math.cbrt(rng()));
    const position = center.clone().add(dir.multiplyScalar(dist));

    return {
      id: n.id,
      group: n.group,
      status: n.status,
      color: new THREE.Color(SOFT_GROUP_COLOR[n.group]),
      position,
      radius: 0.18 + n.generation * 0.05,
    };
  });

  // Recentraliza a NUVEM (o conjunto) na origem — sem fixar nenhum neurônio lá.
  const centroid = nodes
    .reduce((acc, n) => acc.add(n.position), new THREE.Vector3())
    .multiplyScalar(1 / Math.max(1, nodes.length));
  for (const n of nodes) n.position.sub(centroid);

  return nodes;
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
