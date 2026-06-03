import type {
  BiologicalEvent,
  GroupMeta,
  Neuron,
  NeuronGroup,
  NeuronStatus,
} from "@/lib/types";

/* ── Metadados de grupos (cores do mundo neural) ─────────────────────────── */
export const GROUPS: GroupMeta[] = [
  { key: "sensory", label: "Sensorial", color: "#22d3ee" },
  { key: "motor", label: "Motor", color: "#34d399" },
  { key: "inter", label: "Interneurônio", color: "#a78bfa" },
  { key: "excitatory", label: "Excitatório", color: "#fbbf24" },
  { key: "inhibitory", label: "Inibitório", color: "#f472b6" },
  { key: "modulatory", label: "Modulador", color: "#fb923c" },
];

export const GROUP_COLOR: Record<NeuronGroup, string> = GROUPS.reduce(
  (acc, g) => ({ ...acc, [g.key]: g.color }),
  {} as Record<NeuronGroup, string>,
);

export const STATUS_META: Record<
  NeuronStatus,
  { label: string; color: string }
> = {
  idle: { label: "Ocioso", color: "#868aad" },
  firing: { label: "Disparando", color: "#fbbf24" },
  evolved: { label: "Evoluído", color: "#34d399" },
  dead: { label: "Morto", color: "#fb7185" },
};

/* ── Dashboard (Main) ────────────────────────────────────────────────────── */
export interface DashboardStat {
  key: string;
  label: string;
  value: string;
  delta: string;
  trend: "up" | "down";
  color: string;
}

export const DASHBOARD_STATS: DashboardStat[] = [
  { key: "neurons", label: "Neurônios ativos", value: "1.248", delta: "+12%", trend: "up", color: "#a78bfa" },
  { key: "signals", label: "Sinais propagados", value: "5.472", delta: "+8%", trend: "up", color: "#22d3ee" },
  { key: "connections", label: "Conexões neurais", value: "342", delta: "+5%", trend: "up", color: "#34d399" },
  { key: "events", label: "Eventos / min", value: "87", delta: "-3%", trend: "down", color: "#fb923c" },
];

export interface QuickNav {
  to: string;
  title: string;
  description: string;
  icon: "activity" | "network" | "sliders" | "bar-chart";
  color: string;
}

export const QUICK_NAV: QuickNav[] = [
  { to: "/hub", title: "Hub Neural", description: "Visualize os neurônios disparando em tempo real", icon: "network", color: "#a78bfa" },
  { to: "/editor", title: "Editor", description: "Ajuste probabilidades e tempos de eventos", icon: "sliders", color: "#22d3ee" },
  { to: "/statistics", title: "Estatísticas", description: "Quem mais durou, evoluiu ou morreu", icon: "bar-chart", color: "#34d399" },
];

/* ── Eventos recentes ──────────────────────────────────────────────────────── */
export const RECENT_EVENTS: BiologicalEvent[] = [
  { id: "e1", type: "fired", neuron: "N-0142", description: "Disparo acima do limiar", score: 0.82, at: "22:41" },
  { id: "e2", type: "evolved", neuron: "N-0098", description: "Evoluiu para geração 3", score: 0.94, at: "22:40" },
  { id: "e3", type: "connection", neuron: "N-0211", description: "Nova sinapse com N-0188", score: 0.71, at: "22:39" },
  { id: "e4", type: "died", neuron: "N-0007", description: "Potencial colapsou", score: 0.18, at: "22:38" },
  { id: "e5", type: "signal", neuron: "N-0150", description: "Sinal inibitório forte", score: 0.63, at: "22:37" },
  { id: "e6", type: "fired", neuron: "N-0044", description: "Cascata de disparos", score: 0.88, at: "22:36" },
];

export interface ActivityRow {
  id: string;
  label: string;
  group: NeuronGroup;
  status: NeuronStatus;
  load: number; // 0..100
}

export const ACTIVITY_ROWS: ActivityRow[] = [
  { id: "N-0142", label: "Córtex A1", group: "sensory", status: "firing", load: 86 },
  { id: "N-0098", label: "Hipocampo H2", group: "inter", status: "evolved", load: 72 },
  { id: "N-0211", label: "Motor M5", group: "motor", status: "idle", load: 41 },
  { id: "N-0150", label: "Tálamo T1", group: "inhibitory", status: "firing", load: 64 },
  { id: "N-0044", label: "Visual V3", group: "excitatory", status: "firing", load: 93 },
  { id: "N-0007", label: "Gânglio G0", group: "modulatory", status: "dead", load: 4 },
];

/* ── Estatísticas ──────────────────────────────────────────────────────────── */
export interface RankRow {
  id: string;
  label: string;
  value: string;
  meta: string;
}

export const TOP_DURATION: RankRow[] = [
  { id: "N-0098", label: "Hipocampo H2", value: "4h 12m", meta: "geração 3" },
  { id: "N-0142", label: "Córtex A1", value: "3h 58m", meta: "geração 2" },
  { id: "N-0044", label: "Visual V3", value: "3h 21m", meta: "geração 2" },
  { id: "N-0150", label: "Tálamo T1", value: "2h 47m", meta: "geração 1" },
];

export const TOP_EVOLVED: RankRow[] = [
  { id: "N-0098", label: "Hipocampo H2", value: "ger. 3", meta: "5 evoluções" },
  { id: "N-0220", label: "Córtex C8", value: "ger. 3", meta: "4 evoluções" },
  { id: "N-0044", label: "Visual V3", value: "ger. 2", meta: "3 evoluções" },
];

export const DEATHS = [
  { cause: "Colapso de potencial", count: 38, color: "#fb7185" },
  { cause: "Inanição de sinal", count: 21, color: "#fb923c" },
  { cause: "Excitotoxicidade", count: 14, color: "#fbbf24" },
  { cause: "Poda sináptica", count: 9, color: "#a78bfa" },
];

export const STATS_OVERVIEW: DashboardStat[] = [
  { key: "alive", label: "Vivos", value: "1.166", delta: "+2%", trend: "up", color: "#34d399" },
  { key: "dead", label: "Mortos (24h)", value: "82", delta: "+11%", trend: "down", color: "#fb7185" },
  { key: "evolved", label: "Evoluções", value: "47", delta: "+19%", trend: "up", color: "#a78bfa" },
  { key: "avg", label: "Vida média", value: "2h 38m", delta: "+6%", trend: "up", color: "#22d3ee" },
];

/* ── Editor — configurações de simulação ───────────────────────────────────── */
export interface SimSetting {
  key: string;
  label: string;
  hint: string;
  value: number; // percentual ou ms
  min: number;
  max: number;
  unit: "%" | "ms" | "mV";
  pinned: boolean;
  color: string;
}

export interface SimSection {
  key: string;
  title: string;
  settings: SimSetting[];
}

export const SIM_SECTIONS: SimSection[] = [
  {
    key: "firing",
    title: "Disparo",
    settings: [
      { key: "fire_chance", label: "Chance de disparo", hint: "Probabilidade base por tick", value: 35, min: 0, max: 100, unit: "%", pinned: true, color: "#fbbf24" },
      { key: "threshold", label: "Limiar de membrana", hint: "mV para disparar", value: -55, min: -80, max: -40, unit: "mV", pinned: false, color: "#22d3ee" },
      { key: "refractory", label: "Período refratário", hint: "Espera após disparo", value: 320, min: 50, max: 1000, unit: "ms", pinned: false, color: "#a78bfa" },
    ],
  },
  {
    key: "evolution",
    title: "Evolução & Morte",
    settings: [
      { key: "evolve_chance", label: "Chance de evoluir", hint: "Por ciclo bem-sucedido", value: 12, min: 0, max: 100, unit: "%", pinned: false, color: "#34d399" },
      { key: "death_chance", label: "Chance de morte", hint: "Quando potencial colapsa", value: 8, min: 0, max: 100, unit: "%", pinned: true, color: "#fb7185" },
      { key: "mutation", label: "Taxa de mutação", hint: "Variação ao evoluir", value: 24, min: 0, max: 100, unit: "%", pinned: false, color: "#f472b6" },
    ],
  },
  {
    key: "network",
    title: "Rede & Sinais",
    settings: [
      { key: "connect_chance", label: "Formar conexão", hint: "Nova sinapse por tick", value: 18, min: 0, max: 100, unit: "%", pinned: false, color: "#fb923c" },
      { key: "prune_chance", label: "Poda de conexão", hint: "Remoção de sinapse fraca", value: 6, min: 0, max: 100, unit: "%", pinned: false, color: "#868aad" },
      { key: "signal_speed", label: "Velocidade do sinal", hint: "Intervalo de propagação", value: 150, min: 20, max: 600, unit: "ms", pinned: true, color: "#22d3ee" },
    ],
  },
];

export const SIM_PRESETS = [
  { key: "calm", label: "Calmo", hint: "Baixa atividade, longa vida" },
  { key: "balanced", label: "Equilibrado", hint: "Configuração padrão" },
  { key: "chaos", label: "Caótico", hint: "Disparos e mortes frequentes" },
];

/* ── Grafo neural (Hub) ─────────────────────────────────────────────────────── */
const GROUP_CYCLE: NeuronGroup[] = [
  "inter", "sensory", "excitatory", "motor", "inhibitory", "modulatory",
];
const STATUS_CYCLE: NeuronStatus[] = [
  "firing", "idle", "evolved", "idle", "firing", "dead",
];

/** Gera neurônios espalhados em anéis concêntricos (visual orgânico). */
export function buildNeurons(count = 26): Neuron[] {
  return Array.from({ length: count }, (_, i) => ({
    id: `N-${String(i).padStart(4, "0")}`,
    label: `Neurônio ${i}`,
    group: GROUP_CYCLE[i % GROUP_CYCLE.length],
    status: i === 0 ? "firing" : STATUS_CYCLE[i % STATUS_CYCLE.length],
    potential: Math.round(-70 + (i * 37) % 30),
    generation: i % 4,
    fireCount: (i * 53) % 400,
  }));
}
