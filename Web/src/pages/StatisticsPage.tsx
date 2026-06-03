import type { LucideIcon } from "lucide-react";
import { Activity, Clock, HeartPulse, Skull, Sparkles, Trophy } from "lucide-react";
import { AppLayout } from "@/components/layout/AppLayout";
import { Panel } from "@/components/ui/Panel";
import { StatCard } from "@/components/ui/StatCard";
import { ProgressBar } from "@/components/ui/ProgressBar";
import type { RankRow } from "@/mocks/data";
import { DEATHS, STATS_OVERVIEW, TOP_DURATION, TOP_EVOLVED } from "@/mocks/data";

const OVERVIEW_ICONS: Record<string, LucideIcon> = {
  alive: HeartPulse,
  dead: Skull,
  evolved: Sparkles,
  avg: Clock,
};

function RankList({ rows, accent }: { rows: RankRow[]; accent: string }) {
  return (
    <ol className="flex flex-col gap-2">
      {rows.map((r, i) => (
        <li key={r.id} className="flex items-center gap-3 rounded-xl px-2 py-2 hover:bg-white/5">
          <span
            className="grid size-7 shrink-0 place-items-center rounded-lg font-mono text-xs font-semibold"
            style={{ backgroundColor: `${accent}1a`, color: accent }}
          >
            {i + 1}
          </span>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-medium text-foreground">{r.label}</p>
            <p className="font-mono text-xs text-faint">
              {r.id} · {r.meta}
            </p>
          </div>
          <span className="font-mono text-sm" style={{ color: accent }}>
            {r.value}
          </span>
        </li>
      ))}
    </ol>
  );
}

export function StatisticsPage() {
  const maxDeath = Math.max(...DEATHS.map((d) => d.count));

  return (
    <AppLayout title="Estatísticas" badge="STATS">
      <div className="mx-auto flex max-w-7xl flex-col gap-8">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {STATS_OVERVIEW.map((s) => (
            <StatCard
              key={s.key}
              label={s.label}
              value={s.value}
              delta={s.delta}
              trend={s.trend}
              color={s.color}
              icon={OVERVIEW_ICONS[s.key] ?? Activity}
            />
          ))}
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <Panel
            title="Maior duração"
            subtitle="Neurônios que mais sobreviveram"
            action={<Trophy className="size-4 text-[var(--color-amber)]" />}
          >
            <RankList rows={TOP_DURATION} accent="#22d3ee" />
          </Panel>

          <Panel
            title="Mais evoluídos"
            subtitle="Maior nº de evoluções"
            action={<Sparkles className="size-4 text-[var(--color-green)]" />}
          >
            <RankList rows={TOP_EVOLVED} accent="#34d399" />
          </Panel>

          <Panel
            title="Causas de morte"
            subtitle="Como os neurônios morreram"
            action={<Skull className="size-4 text-[var(--color-red)]" />}
            bodyClassName="flex flex-col gap-4"
          >
            {DEATHS.map((d) => (
              <div key={d.cause}>
                <div className="mb-1.5 flex items-center justify-between text-sm">
                  <span className="text-foreground">{d.cause}</span>
                  <span className="font-mono text-muted">{d.count}</span>
                </div>
                <ProgressBar value={(d.count / maxDeath) * 100} color={d.color} />
              </div>
            ))}
          </Panel>
        </div>

        <Panel title="Eventos melhor realizados" subtitle="Maior qualidade de resultado (morte ou evolução)">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {TOP_EVOLVED.concat(TOP_DURATION.slice(0, 1)).map((r, i) => (
              <div key={`${r.id}-${i}`} className="panel panel-hover p-4">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs text-faint">{r.id}</span>
                  <span className="font-mono text-sm text-[var(--color-primary-bright)]">
                    {(0.98 - i * 0.04).toFixed(2)}
                  </span>
                </div>
                <p className="mt-2 text-sm font-medium text-foreground">{r.label}</p>
                <p className="text-xs text-muted">{r.meta}</p>
              </div>
            ))}
          </div>
        </Panel>
      </div>
    </AppLayout>
  );
}
