import { useState } from "react";
import { Pin, PinOff, RotateCcw, Save } from "lucide-react";
import { AppLayout } from "@/components/layout/AppLayout";
import { Panel } from "@/components/ui/Panel";
import { Slider } from "@/components/ui/Slider";
import { cn } from "@/lib/cn";
import { SIM_PRESETS, SIM_SECTIONS } from "@/mocks/data";

export function EditorPage() {
  const [sections, setSections] = useState(() => structuredClone(SIM_SECTIONS));
  const [preset, setPreset] = useState("balanced");

  const setValue = (sectionKey: string, settingKey: string, value: number) =>
    setSections((prev) =>
      prev.map((sec) =>
        sec.key !== sectionKey
          ? sec
          : {
              ...sec,
              settings: sec.settings.map((s) => (s.key === settingKey ? { ...s, value } : s)),
            },
      ),
    );

  const togglePin = (sectionKey: string, settingKey: string) =>
    setSections((prev) =>
      prev.map((sec) =>
        sec.key !== sectionKey
          ? sec
          : {
              ...sec,
              settings: sec.settings.map((s) =>
                s.key === settingKey ? { ...s, pinned: !s.pinned } : s,
              ),
            },
      ),
    );

  const reset = () => setSections(structuredClone(SIM_SECTIONS));
  const pinnedCount = sections.flatMap((s) => s.settings).filter((s) => s.pinned).length;

  return (
    <AppLayout title="Editor — Configurações de Simulação" badge="EDITOR">
      <div className="mx-auto max-w-7xl">
        {/* Presets */}
        <div className="mb-6 flex flex-wrap items-center gap-2">
          <span className="mr-2 text-xs font-semibold uppercase tracking-widest text-faint">
            Preset
          </span>
          {SIM_PRESETS.map((p) => (
            <button
              key={p.key}
              type="button"
              onClick={() => setPreset(p.key)}
              title={p.hint}
              className={cn(
                "rounded-xl border px-4 py-2 text-sm font-medium transition-colors",
                preset === p.key
                  ? "border-[var(--color-primary)] bg-[var(--color-primary)]/15 text-foreground"
                  : "border-[var(--color-border)] text-muted hover:border-[var(--color-primary)]/50 hover:text-foreground",
              )}
            >
              {p.label}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 gap-6 xl:grid-cols-4">
          {/* Seções de configuração */}
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:col-span-3 xl:grid-cols-3">
            {sections.map((sec) => (
              <Panel key={sec.key} title={sec.title} bodyClassName="flex flex-col gap-6">
                {sec.settings.map((s) => (
                  <div key={s.key}>
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0">
                        <p className="text-sm font-medium text-foreground">{s.label}</p>
                        <p className="text-xs text-faint">{s.hint}</p>
                      </div>
                      <button
                        type="button"
                        onClick={() => togglePin(sec.key, s.key)}
                        title={s.pinned ? "Fixado" : "Randomizado — clique para fixar"}
                        className={cn(
                          "grid size-7 shrink-0 place-items-center rounded-lg border transition-colors",
                          s.pinned
                            ? "border-[var(--color-primary)]/60 bg-[var(--color-primary)]/15 text-[var(--color-primary-bright)]"
                            : "border-[var(--color-border)] text-faint hover:text-foreground",
                        )}
                      >
                        {s.pinned ? <Pin className="size-3.5" /> : <PinOff className="size-3.5" />}
                      </button>
                    </div>
                    <div className="mt-3 flex items-center gap-3">
                      <Slider
                        value={s.value}
                        min={s.min}
                        max={s.max}
                        color={s.color}
                        onChange={(v) => setValue(sec.key, s.key, v)}
                      />
                      <span className="w-16 shrink-0 text-right font-mono text-sm text-foreground">
                        {s.value}
                        <span className="text-faint">{s.unit}</span>
                      </span>
                    </div>
                  </div>
                ))}
              </Panel>
            ))}
          </div>

          {/* Resumo / ações */}
          <aside className="flex flex-col gap-4">
            <Panel title="Resumo" bodyClassName="flex flex-col gap-3 text-sm">
              <div className="flex items-center justify-between">
                <span className="text-muted">Parâmetros</span>
                <span className="font-mono">{sections.flatMap((s) => s.settings).length}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted">Fixados</span>
                <span className="font-mono text-[var(--color-primary-bright)]">{pinnedCount}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted">Randomizados</span>
                <span className="font-mono text-[var(--color-cyan)]">
                  {sections.flatMap((s) => s.settings).length - pinnedCount}
                </span>
              </div>
              <p className="mt-1 text-xs leading-relaxed text-faint">
                Parâmetros não fixados são re-sorteados automaticamente a cada ciclo da simulação.
              </p>
            </Panel>

            <div className="flex flex-col gap-2">
              <button
                type="button"
                className="flex items-center justify-center gap-2 rounded-xl bg-[var(--color-primary)] px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[var(--color-primary-bright)]"
              >
                <Save className="size-4" /> Salvar configuração
              </button>
              <button
                type="button"
                onClick={reset}
                className="flex items-center justify-center gap-2 rounded-xl border border-[var(--color-border)] px-4 py-2.5 text-sm font-medium text-muted transition-colors hover:text-foreground"
              >
                <RotateCcw className="size-4" /> Restaurar padrão
              </button>
            </div>
          </aside>
        </div>
      </div>
    </AppLayout>
  );
}
