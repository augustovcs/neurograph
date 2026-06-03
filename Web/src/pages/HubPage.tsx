import { useMemo } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { Badge } from "@/components/ui/Badge";
import { NeuralScene } from "@/features/hub/scene/NeuralScene";
import { buildNeurons, GROUPS, STATUS_META } from "@/mocks/data";
import type { NeuronStatus } from "@/lib/types";

const NEURON_COUNT = 26;

export function HubPage() {
  const { groupCounts, statusCounts, total, connections } = useMemo(() => {
    const neurons = buildNeurons(NEURON_COUNT);
    const groupCounts: Record<string, number> = {};
    const statusCounts: Record<NeuronStatus, number> = { idle: 0, firing: 0, evolved: 0, dead: 0 };
    for (const n of neurons) {
      groupCounts[n.group] = (groupCounts[n.group] ?? 0) + 1;
      statusCounts[n.status] += 1;
    }
    // mesmo nº de arestas geradas em neuralData.ts (8 + 10 + 7 + 3 cruzadas)
    return { groupCounts, statusCounts, total: neurons.length, connections: 28 };
  }, []);

  return (
    <AppLayout title="Hub — Mundo Neural" badge="HUB">
      <div className="flex h-[calc(100vh-9.5rem)] gap-6">
        {/* Canvas 3D (Three.js / WebGL) */}
        <div
          className="panel relative min-w-0 flex-1 overflow-hidden"
          style={{
            background:
              "radial-gradient(120% 120% at 30% 20%, #23252d 0%, #181a20 45%, #101116 100%)",
          }}
        >
          <NeuralScene count={NEURON_COUNT} />

          <div className="pointer-events-none absolute left-4 top-4 rounded-lg border border-[var(--color-border)] bg-[var(--color-bg)]/55 px-3 py-2 backdrop-blur">
            <p className="font-mono text-xs text-muted">
              <span className="text-[var(--color-primary-bright)]">{total}</span> neurônios ·{" "}
              <span className="text-[var(--color-cyan)]">{connections}</span> conexões
            </p>
          </div>
          <div className="pointer-events-none absolute bottom-4 right-4 rounded-lg border border-[var(--color-border)] bg-[var(--color-bg)]/55 px-3 py-1.5 backdrop-blur">
            <p className="font-mono text-[11px] text-faint">arraste p/ orbitar · scroll p/ zoom</p>
          </div>
        </div>

        {/* Sidebar */}
        <aside className="flex w-72 shrink-0 flex-col gap-6 overflow-y-auto">
          <div className="panel p-5">
            <h2 className="text-sm font-semibold">Legenda</h2>
            <p className="mt-0.5 text-xs text-muted">Tipos de neurônio</p>
            <ul className="mt-4 flex flex-col gap-3">
              {GROUPS.map((g) => (
                <li key={g.key} className="flex items-center gap-3 text-sm">
                  <span
                    className="size-3 rounded-full"
                    style={{ backgroundColor: g.color, boxShadow: `0 0 10px ${g.color}` }}
                  />
                  <span className="flex-1 text-foreground">{g.label}</span>
                  <span className="font-mono text-xs text-muted">{groupCounts[g.key] ?? 0}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="panel p-5">
            <h2 className="text-sm font-semibold">Estado</h2>
            <ul className="mt-4 flex flex-col gap-3">
              {(Object.keys(statusCounts) as NeuronStatus[]).map((s) => (
                <li key={s} className="flex items-center justify-between">
                  <Badge label={STATUS_META[s].label} color={STATUS_META[s].color} />
                  <span className="font-mono text-sm text-foreground">{statusCounts[s]}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="panel p-5 text-sm">
            <h2 className="text-sm font-semibold">Dica</h2>
            <p className="mt-2 text-xs leading-relaxed text-muted">
              Renderizado em 3D com WebGL. Arraste para orbitar a rede e use o scroll para
              aproximar. Os que pulsam mais forte estão{" "}
              <span className="text-[var(--color-amber)]">disparando</span>; os apagados estão{" "}
              <span className="text-[var(--color-red)]">mortos</span>.
            </p>
          </div>
        </aside>
      </div>
    </AppLayout>
  );
}
