import type { Neuron, NeuronGroup } from "@/lib/types";

const BASE = import.meta.env.VITE_API_URL ?? "http://localhost:5000/api";

// --- Neurons ---
export async function getNeurons() {
  const res = await fetch(`${BASE}/neurons`);
  if (!res.ok) throw new Error("Falha ao buscar neurônios");
  return res.json();
}

export async function getNeuronById(id: string) {
  const res = await fetch(`${BASE}/neurons/${id}`);
  if (!res.ok) throw new Error("Neurônio não encontrado");
  return res.json();
}

export async function createNeuron(label: string, x: number, y: number) {
  const res = await fetch(`${BASE}/neurons`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ label, x, y }),
  });
  if (!res.ok) throw new Error("Falha ao criar neurônio");
  return res.json();
}

// --- Connections ---
export async function getConnections() {
  const res = await fetch(`${BASE}/connections`);
  if (!res.ok) throw new Error("Falha ao buscar conexões");
  return res.json();
}

// --- Statistics ---
export async function getLongevity() {
  const res = await fetch(`${BASE}/statistics/longevity`);
  if (!res.ok) throw new Error("Falha ao buscar longevidade");
  return res.json();
}

export async function getDeaths() {
  const res = await fetch(`${BASE}/statistics/deaths`);
  if (!res.ok) throw new Error("Falha ao buscar mortes");
  return res.json();
}

export async function getBestEvents() {
  const res = await fetch(`${BASE}/statistics/best-events`);
  if (!res.ok) throw new Error("Falha ao buscar eventos");
  return res.json();
}

// --- Mapeamento Dto -> Neuron (front) ---
const GROUP_CYCLE: NeuronGroup[] = [
  "inter", "sensory", "excitatory", "motor", "inhibitory", "modulatory",
];

function normalizeStatus(raw: string): Neuron["status"] {
  const s = (raw ?? "").toLowerCase();
  if (s === "firing" || s === "active") return "firing";
  if (s === "evolved") return "evolved";
  if (s === "dead") return "dead";
  return "idle";
}

export function mapToNeuron(dto: any, index: number): Neuron {
  return {
    id: dto.id,
    label: dto.label,
    group: GROUP_CYCLE[index % GROUP_CYCLE.length],
    status: normalizeStatus(dto.status),
    potential: Math.round(dto.energy * 100),
    generation: 0,
    fireCount: 0,
  };
}
// --- Statistics types ---
export interface LongevityDto {
  neuronId: string;
  label: string;
  lifetimeSeconds: number;
  evolutionCount: number;
}

export interface DeathStatsDto {
  cause: string;
  deathCount: number;
}

export interface BestEventDto {
  eventId: string;
  neuronId: string;
  kind: string;
  cause: string | null;
  occurredAt: string;
}

export function formatDuration(seconds: number): string {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  if (h > 0) return `${h}h ${m}m`;
  return `${m}m`;
}