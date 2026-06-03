import { Link } from "react-router-dom";
import type { LucideIcon } from "lucide-react";
import {
  Activity,
  ArrowUpRight,
  BarChart3,
  Network,
  Radio,
  Share2,
  Skull,
  SlidersHorizontal,
  Sparkles,
  Zap,
} from "lucide-react";
import { AppLayout } from "@/components/layout/AppLayout";
import { Panel } from "@/components/ui/Panel";
import { StatCard } from "@/components/ui/StatCard";
import { Badge } from "@/components/ui/Badge";
import { ProgressBar } from "@/components/ui/ProgressBar";
import type { BiologicalEventType } from "@/lib/types";
import {
  ACTIVITY_ROWS,
  DASHBOARD_STATS,
  GROUP_COLOR,
  GROUPS,
  QUICK_NAV,
  RECENT_EVENTS,
  STATUS_META,
} from "@/mocks/data";

const STAT_ICONS: Record<string, LucideIcon> = {
  neurons: Activity,
  signals: Zap,
  connections: Share2,
  events: Sparkles,
};

const NAV_ICONS: Record<string, LucideIcon> = {
  activity: Activity,
  network: Network,
  sliders: SlidersHorizontal,
  "bar-chart": BarChart3,
};

const EVENT_META: Record<BiologicalEventType, { icon: LucideIcon; color: string }> = {
  fired: { icon: Zap, color: "#fbbf24" },
  evolved: { icon: Sparkles, color: "#34d399" },
  connection: { icon: Share2, color: "#22d3ee" },
  died: { icon: Skull, color: "#fb7185" },
  signal: { icon: Radio, color: "#f472b6" },
};

export function MainPage() {
  return (
    <AppLayout title="Bem-vindo ao NeuroGraph" badge="MAIN">
      <div className="mx-auto flex max-w-7xl flex-col gap-8">
        {/* Stats */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {DASHBOARD_STATS.map((s) => (
            <StatCard
              key={s.key}
              label={s.label}
              value={s.value}
              delta={s.delta}
              trend={s.trend}
              color={s.color}
              icon={STAT_ICONS[s.key] ?? Activity}
            />
          ))}
        </div>

        {/* Navegação rápida */}
        <section>
          <h2 className="mb-3 text-xs font-semibold uppercase tracking-widest text-faint">
            Navegação rápida
          </h2>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            {QUICK_NAV.map((q) => {
              const Icon = NAV_ICONS[q.icon] ?? Activity;
              return (
                <Link
                  key={q.to}
                  to={q.to}
                  className="panel panel-hover group flex items-start gap-4 p-5"
                >
                  <span
                    className="grid size-11 shrink-0 place-items-center rounded-xl"
                    style={{ backgroundColor: `${q.color}1f`, color: q.color }}
                  >
                    <Icon className="size-5" />
                  </span>
                  <div className="min-w-0">
                    <p className="flex items-center gap-1 font-medium text-foreground">
                      {q.title}
                      <ArrowUpRight className="size-4 text-faint transition group-hover:text-[var(--color-primary-bright)]" />
                    </p>
                    <p className="mt-1 text-sm text-muted">{q.description}</p>
                  </div>
                </Link>
              );
            })}
          </div>
        </section>

        {/* Atividade + Eventos */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-5">
          <Panel
            title="Atividade dos neurônios"
            subtitle="Carga de disparo em tempo real"
            className="lg:col-span-3"
            action={<Badge label="ao vivo" color="#34d399" />}
            bodyClassName="flex flex-col gap-4"
          >
            {ACTIVITY_ROWS.map((row) => {
              const status = STATUS_META[row.status];
              return (
                <div key={row.id} className="flex items-center gap-4">
                  <span
                    className="size-2.5 shrink-0 rounded-full"
                    style={{ backgroundColor: GROUP_COLOR[row.group] }}
                  />
                  <div className="w-32 shrink-0">
                    <p className="truncate text-sm font-medium text-foreground">{row.label}</p>
                    <p className="font-mono text-xs text-faint">{row.id}</p>
                  </div>
                  <div className="flex-1">
                    <ProgressBar value={row.load} color={GROUP_COLOR[row.group]} />
                  </div>
                  <span className="w-10 text-right font-mono text-xs text-muted">{row.load}%</span>
                  <div className="w-24 text-right">
                    <Badge label={status.label} color={status.color} />
                  </div>
                </div>
              );
            })}
          </Panel>

          <Panel
            title="Eventos recentes"
            subtitle="Gerados por comportamento randômico"
            className="lg:col-span-2"
            bodyClassName="flex flex-col gap-1"
          >
            {RECENT_EVENTS.map((ev) => {
              const meta = EVENT_META[ev.type];
              const Icon = meta.icon;
              return (
                <div
                  key={ev.id}
                  className="flex items-center gap-3 rounded-xl px-2 py-2.5 transition-colors hover:bg-white/5"
                >
                  <span
                    className="grid size-9 shrink-0 place-items-center rounded-lg"
                    style={{ backgroundColor: `${meta.color}1a`, color: meta.color }}
                  >
                    <Icon className="size-4" />
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm text-foreground">{ev.description}</p>
                    <p className="font-mono text-xs text-faint">{ev.neuron}</p>
                  </div>
                  <span className="font-mono text-xs text-muted">{ev.at}</span>
                </div>
              );
            })}
          </Panel>
        </div>

        {/* Legenda de grupos */}
        <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-xs text-muted">
          {GROUPS.map((g) => (
            <span key={g.key} className="flex items-center gap-2">
              <span className="size-2.5 rounded-full" style={{ backgroundColor: g.color }} />
              {g.label}
            </span>
          ))}
        </div>
      </div>
    </AppLayout>
  );
}
