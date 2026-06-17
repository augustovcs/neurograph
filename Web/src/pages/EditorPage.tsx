import { useEffect, useState } from "react";
import { Pin, PinOff, RotateCcw, Save } from "lucide-react";
import { AppLayout } from "@/components/layout/AppLayout";
import { Panel } from "@/components/ui/Panel";
import { Slider } from "@/components/ui/Slider";
import { cn } from "@/lib/cn";
import {
  getSimulationConfig,
  updateSimulationConfig,
  type ConfigParameterDto,
  type SimulationConfigDto,
} from "@/lib/api";

type ParamKey = keyof SimulationConfigDto;

interface ParamMeta {
  key: ParamKey;
  label: string;
  hint: string;
  color: string;
  step: number;
}

// Grupos espelham a entity SimulationConfig (Comportamento + Energia).
const GROUPS: { title: string; params: ParamMeta[] }[] = [
  {
    title: "Comportamento",
    params: [
      { key: "fireChancePerTick", label: "Chance de disparo", hint: "Probabilidade por tick", color: "#fbbf24", step: 0.001 },
      { key: "evolveChancePerTick", label: "Chance de evoluir", hint: "Probabilidade por tick", color: "#34d399", step: 0.001 },
      { key: "deathChancePerTick", label: "Chance de morte", hint: "Probabilidade por tick", color: "#fb7185", step: 0.001 },
    ],
  },
  {
    title: "Energia",
    params: [
      { key: "energyCostPerFire", label: "Custo ao disparar", hint: "Energia gasta por disparo", color: "#22d3ee", step: 0.1 },
      { key: "energyRegenPerTick", label: "Regeneração", hint: "Energia recuperada por tick", color: "#a78bfa", step: 0.05 },
    ],
  },
];

const ALL_PARAMS = GROUPS.flatMap((g) => g.params);

function formatValue(value: number, step: number): string {
  if (step >= 1) return value.toFixed(0);
  if (step >= 0.1) return value.toFixed(1);
  return value.toFixed(3);
}

export function EditorPage() {
  const [cfg, setCfg] = useState<SimulationConfigDto | null>(null);
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState<string | null>(null);

  useEffect(() => {
    getSimulationConfig()
      .then(setCfg)
      .catch(() => setStatus("Erro ao carregar configuração"));
  }, []);

  const patch = (key: ParamKey, partial: Partial<ConfigParameterDto>) =>
    setCfg((prev) => (prev ? { ...prev, [key]: { ...prev[key], ...partial } } : prev));

  const save = async () => {
    if (!cfg) return;
    setSaving(true);
    setStatus(null);
    try {
      setCfg(await updateSimulationConfig(cfg));
      setStatus("Configuração salva");
    } catch {
      setStatus("Erro ao salvar");
    } finally {
      setSaving(false);
    }
  };

  const reload = () => {
    setStatus(null);
    getSimulationConfig()
      .then(setCfg)
      .catch(() => setStatus("Erro ao carregar configuração"));
  };

  if (!cfg) {
    return (
      <AppLayout title="Editor — Configurações de Simulação" badge="EDITOR">
        <p className="text-sm text-muted">{status ?? "Carregando configuração…"}</p>
      </AppLayout>
    );
  }

  const pinnedCount = ALL_PARAMS.filter((p) => cfg[p.key].pinned).length;

  return (
    <AppLayout title="Editor — Configurações de Simulação" badge="EDITOR">
      <div className="mx-auto max-w-7xl">
        <div className="grid grid-cols-1 gap-6 xl:grid-cols-4">
          {/* Seções de configuração */}
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:col-span-3">
            {GROUPS.map((sec) => (
              <Panel key={sec.title} title={sec.title} bodyClassName="flex flex-col gap-6">
                {sec.params.map((p) => {
                  const param = cfg[p.key];
                  return (
                    <div key={p.key}>
                      <div className="flex items-start justify-between gap-2">
                        <div className="min-w-0">
                          <p className="text-sm font-medium text-foreground">{p.label}</p>
                          <p className="text-xs text-faint">{p.hint}</p>
                        </div>
                        <button
                          type="button"
                          onClick={() => patch(p.key, { pinned: !param.pinned })}
                          title={param.pinned ? "Fixado" : "Randomizado — clique para fixar"}
                          className={cn(
                            "grid size-7 shrink-0 place-items-center rounded-lg border transition-colors",
                            param.pinned
                              ? "border-[var(--color-primary)]/60 bg-[var(--color-primary)]/15 text-[var(--color-primary-bright)]"
                              : "border-[var(--color-border)] text-faint hover:text-foreground",
                          )}
                        >
                          {param.pinned ? <Pin className="size-3.5" /> : <PinOff className="size-3.5" />}
                        </button>
                      </div>
                      <div className="mt-3 flex items-center gap-3">
                        <Slider
                          value={param.value}
                          min={param.min}
                          max={param.max}
                          step={p.step}
                          color={p.color}
                          onChange={(v) => patch(p.key, { value: v })}
                        />
                        <span className="w-16 shrink-0 text-right font-mono text-sm text-foreground">
                          {formatValue(param.value, p.step)}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </Panel>
            ))}
          </div>

          {/* Resumo / ações */}
          <aside className="flex flex-col gap-4">
            <Panel title="Resumo" bodyClassName="flex flex-col gap-3 text-sm">
              <div className="flex items-center justify-between">
                <span className="text-muted">Parâmetros</span>
                <span className="font-mono">{ALL_PARAMS.length}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted">Fixados</span>
                <span className="font-mono text-[var(--color-primary-bright)]">{pinnedCount}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted">Randomizados</span>
                <span className="font-mono text-[var(--color-cyan)]">{ALL_PARAMS.length - pinnedCount}</span>
              </div>
              <p className="mt-1 text-xs leading-relaxed text-faint">
                Parâmetros não fixados são re-sorteados dentro de [mín, máx] a cada ciclo da simulação.
              </p>
            </Panel>

            <div className="flex flex-col gap-2">
              <button
                type="button"
                onClick={save}
                disabled={saving}
                className="flex items-center justify-center gap-2 rounded-xl bg-[var(--color-primary)] px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[var(--color-primary-bright)] disabled:opacity-60"
              >
                <Save className="size-4" /> {saving ? "Salvando…" : "Salvar configuração"}
              </button>
              <button
                type="button"
                onClick={reload}
                className="flex items-center justify-center gap-2 rounded-xl border border-[var(--color-border)] px-4 py-2.5 text-sm font-medium text-muted transition-colors hover:text-foreground"
              >
                <RotateCcw className="size-4" /> Descartar alterações
              </button>
            </div>

            {status && <p className="text-center text-xs text-muted">{status}</p>}
          </aside>
        </div>
      </div>
    </AppLayout>
  );
}
