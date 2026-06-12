import { useEffect, useState } from "react";
import type { LucideIcon } from "lucide-react";
import { Activity, Clock, HeartPulse, Skull, Sparkles, Trophy } from "lucide-react";
import { AppLayout } from "@/components/layout/AppLayout";
import { Panel } from "@/components/ui/Panel";
import { StatCard } from "@/components/ui/StatCard";
import { ProgressBar } from "@/components/ui/ProgressBar";
import {
  getLongevity,
  getDeaths,
  getBestEvents,
  getNeurons,
  formatDuration,
  type LongevityDto,
  type DeathStatsDto,
  type BestEventDto,
} from "@/lib/api";

const OVERVIEW_ICONS: Record<string, LucideIcon> = {
  alive: HeartPulse,
  dead: Skull,
  evolved: Sparkles,
  avg: Clock,
  total: Activity,
};

const DEATH_COLORS = ["#fb7185", "#fb923c", "#fbbf24", "#a78bfa", "#22d3ee", "#34d399"];

function shortId(id: string) {
  return `N-${id.slice(0, 4)}`;
}

function RankList({
  rows,
  accent,
}: {
  rows: { id: string; label: string; value: string; meta: string }[];
  accent: string;
}) {
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
  const [longevity, setLongevity] = useState<LongevityDto[]>([]);
  const [deaths, setDeaths] = useState<DeathStatsDto[]>([]);
  const [bestEvents, setBestEvents] = useState<BestEventDto[]>([]);
  const [aliveCount, setAliveCount] = useState(0);
  const [totalCount, setTotalCount] = useState(0);

  useEffect(() => {
    getLongevity().then(setLongevity);
    getDeaths().then(setDeaths);
    getBestEvents().then(setBestEvents);
    getNeurons().then((data: any[]) => {
      setTotalCount(data.length);
      setAliveCount(data.filter((n) => n.status !== "dead").length);
    });
  }, []);

  const totalDeaths = deaths.reduce((acc, d) => acc + d.deathCount, 0);
  const totalEvolutions = longevity.reduce((acc, l) => acc + l.evolutionCount, 0);
  const avgLifetime =
    longevity.length > 0
      ? longevity.reduce((acc, l) => acc + l.lifetimeSeconds, 0) / longevity.length
      : 0;

  const overview = [
    { key: "alive", label: "Vivos", value: String(aliveCount), color: "#34d399" },
    { key: "dead", label: "Mortos", value: String(totalDeaths), color: "#fb7185" },
    { key: "evolved", label: "Evoluções", value: String(totalEvolutions), color: "#a78bfa" },
    { key: "avg", label: "Vida média", value: formatDuration(avgLifetime), color: "#22d3ee" },
    { key: "total", label: "Total", value: String(totalCount), color: "#60a5fa" },
  ];

  const topDuration = [...longevity]
    .sort((a, b) => b.lifetimeSeconds - a.lifetimeSeconds)
    .slice(0, 4)
    .map((l) => ({
      id: shortId(l.neuronId),
      label: l.label,
      value: formatDuration(l.lifetimeSeconds),
      meta: `${l.evolutionCount} evoluções`,
    }));

  const topEvolved = [...longevity]
    .sort((a, b) => b.evolutionCount - a.evolutionCount)
    .slice(0, 4)
    .map((l) => ({
      id: shortId(l.neuronId),
      label: l.label,
      value: `${l.evolutionCount} evoluções`,
      meta: formatDuration(l.lifetimeSeconds),
    }));

  const deathRows = deaths.map((d, i) => ({
    cause: d.cause,
    count: d.deathCount,
    color: DEATH_COLORS[i % DEATH_COLORS.length],
  }));
  const maxDeath = Math.max(1, ...deathRows.map((d) => d.count));

  return (
    <AppLayout title="Estatísticas" badge="STATS">
      <div className="mx-auto flex max-w-7xl flex-col gap-8">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {overview.map((s) => (
            <StatCard
              key={s.key}
              label={s.label}
              value={s.value}
              delta=""
              trend="up"
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
            <RankList rows={topDuration} accent="#22d3ee" />
          </Panel>

          <Panel
            title="Mais evoluídos"
            subtitle="Maior nº de evoluções"
            action={<Sparkles className="size-4 text-[var(--color-green)]" />}
          >
            <RankList rows={topEvolved} accent="#34d399" />
          </Panel>

          <Panel
            title="Causas de morte"
            subtitle="Como os neurônios morreram"
            action={<Skull className="size-4 text-[var(--color-red)]" />}
            bodyClassName="flex flex-col gap-4"
          >
            {deathRows.map((d) => (
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

        <Panel title="Eventos melhor realizados" subtitle="Mortes e evoluções recentes">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {bestEvents.slice(0, 6).map((e) => (
              <div key={e.eventId} className="panel panel-hover p-4">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs text-faint">{shortId(e.neuronId)}</span>
                  <span className="font-mono text-sm text-[var(--color-primary-bright)]">
                    {new Date(e.occurredAt).toLocaleTimeString("pt-BR", {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                </div>
                <p className="mt-2 text-sm font-medium text-foreground">
                  {e.kind === "death" ? "Morte" : "Evolução"}
                </p>
                <p className="text-xs text-muted">{e.cause ?? "—"}</p>
              </div>
            ))}
          </div>
        </Panel>
      </div>
    </AppLayout>
  );
}