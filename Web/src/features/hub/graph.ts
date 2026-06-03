import type { Edge, Node } from "@xyflow/react";
import { buildNeurons, GROUP_COLOR } from "@/mocks/data";
import type { NeuronNodeData } from "./NeuronNode";

interface Ring {
  radius: number;
  from: number;
  to: number; // exclusivo
}

const RINGS: Ring[] = [
  { radius: 0, from: 0, to: 1 },
  { radius: 190, from: 1, to: 9 },
  { radius: 350, from: 9, to: 19 },
  { radius: 500, from: 19, to: 26 },
];

function ringOf(index: number): Ring {
  return RINGS.find((r) => index >= r.from && index < r.to) ?? RINGS[RINGS.length - 1];
}

export function buildGraph(): { nodes: Node<NeuronNodeData>[]; edges: Edge[] } {
  const neurons = buildNeurons(26);

  const nodes: Node<NeuronNodeData>[] = neurons.map((n, i) => {
    const ring = ringOf(i);
    const countInRing = ring.to - ring.from;
    const angle = ((i - ring.from) / countInRing) * Math.PI * 2;
    const jitter = (i % 3) * 14;
    const size = 26 + n.generation * 6 + (n.status === "firing" ? 6 : 0);

    return {
      id: n.id,
      type: "neuron",
      position: {
        x: Math.cos(angle) * (ring.radius + jitter),
        y: Math.sin(angle) * (ring.radius + jitter),
      },
      data: {
        label: `${n.id} · ${n.label}`,
        color: GROUP_COLOR[n.group],
        firing: n.status === "firing",
        dead: n.status === "dead",
        size,
      },
      draggable: true,
    };
  });

  const edges: Edge[] = [];
  const addEdge = (source: string, target: string, animated: boolean) => {
    edges.push({
      id: `${source}-${target}`,
      source,
      target,
      animated,
      style: {
        stroke: animated ? "#a78bfa" : "#2a2d4f",
        strokeWidth: animated ? 1.6 : 1,
      },
    });
  };

  // Centro → anel 1
  for (let i = 1; i < 9; i++) addEdge("N-0000", `N-${String(i).padStart(4, "0")}`, i % 2 === 0);
  // Anel 1 → anel 2
  for (let i = 9; i < 19; i++) {
    const parent = 1 + (i % 8);
    addEdge(`N-${String(parent).padStart(4, "0")}`, `N-${String(i).padStart(4, "0")}`, i % 3 === 0);
  }
  // Anel 2 → anel 3
  for (let i = 19; i < 26; i++) {
    const parent = 9 + (i % 10);
    addEdge(`N-${String(parent).padStart(4, "0")}`, `N-${String(i).padStart(4, "0")}`, i % 2 === 0);
  }
  // Algumas conexões cruzadas
  addEdge("N-0003", "N-0014", true);
  addEdge("N-0011", "N-0022", false);
  addEdge("N-0005", "N-0017", false);

  return { nodes, edges };
}
