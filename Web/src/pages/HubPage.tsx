import { useMemo } from "react";
import {
  Background,
  BackgroundVariant,
  Controls,
  MiniMap,
  ReactFlow,
  type NodeTypes,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import { AppLayout } from "@/components/layout/AppLayout";
import { Badge } from "@/components/ui/Badge";
import { NeuronNode, type NeuronNodeData } from "@/features/hub/NeuronNode";
import { buildGraph } from "@/features/hub/graph";
import { buildNeurons, GROUPS, STATUS_META } from "@/mocks/data";
import type { NeuronStatus } from "@/lib/types";

const nodeTypes: NodeTypes = { neuron: NeuronNode };

export function HubPage() {
  const { nodes, edges } = useMemo(() => buildGraph(), []);

  const { groupCounts, statusCounts, total } = useMemo(() => {
    const neurons = buildNeurons(26);
    const groupCounts: Record<string, number> = {};
    const statusCounts: Record<NeuronStatus, number> = { idle: 0, firing: 0, evolved: 0, dead: 0 };
    for (const n of neurons) {
      groupCounts[n.group] = (groupCounts[n.group] ?? 0) + 1;
      statusCounts[n.status] += 1;
    }
    return { groupCounts, statusCounts, total: neurons.length };
  }, []);

  return (
    <AppLayout title="Hub — Mundo Neural" badge="HUB">
      <div className="flex h-[calc(100vh-9.5rem)] gap-6">
        {/* Canvas */}
        <div className="panel relative min-w-0 flex-1 overflow-hidden">
          <ReactFlow
            nodes={nodes}
            edges={edges}
            nodeTypes={nodeTypes}
            colorMode="dark"
            fitView
            fitViewOptions={{ padding: 0.2 }}
            minZoom={0.3}
            maxZoom={2}
            proOptions={{ hideAttribution: true }}
          >
            <Background variant={BackgroundVariant.Dots} gap={28} size={1} color="#20233f" />
            <Controls className="!border-[var(--color-border)] !bg-[var(--color-panel-2)]" showInteractive={false} />
            <MiniMap
              pannable
              zoomable
              maskColor="rgba(5,6,15,0.7)"
              className="!bg-[var(--color-bg-soft)]"
              nodeColor={(n) => (n.data as NeuronNodeData).color}
            />
          </ReactFlow>

          <div className="pointer-events-none absolute left-4 top-4 rounded-lg border border-[var(--color-border)] bg-[var(--color-bg)]/70 px-3 py-2 backdrop-blur">
            <p className="font-mono text-xs text-muted">
              <span className="text-[var(--color-primary-bright)]">{total}</span> neurônios ·{" "}
              <span className="text-[var(--color-cyan)]">{edges.length}</span> conexões
            </p>
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
              Arraste os neurônios, use o scroll para zoom e o minimapa para navegar. Os que pulsam
              estão <span className="text-[var(--color-amber)]">disparando</span>.
            </p>
          </div>
        </aside>
      </div>
    </AppLayout>
  );
}
