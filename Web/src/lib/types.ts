/** Tipos compartilhados do domínio NeuroGraph (somente front, por enquanto). */

export type NeuronStatus = "idle" | "firing" | "evolved" | "dead";

export type NeuronGroup =
  | "sensory"
  | "motor"
  | "inter"
  | "excitatory"
  | "inhibitory"
  | "modulatory";

export type BiologicalEventType =
  | "fired"
  | "connection"
  | "evolved"
  | "died"
  | "signal";

export interface Neuron {
  id: string;
  label: string;
  group: NeuronGroup;
  status: NeuronStatus;
  potential: number; // mV simbólico
  generation: number;
  fireCount: number;
}

export interface BiologicalEvent {
  id: string;
  type: BiologicalEventType;
  neuron: string;
  description: string;
  score: number; // 0..1 qualidade
  at: string; // hora curta
}

export interface GroupMeta {
  key: NeuronGroup;
  label: string;
  color: string;
}
