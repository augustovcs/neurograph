import { NavLink } from "react-router-dom";
import type { LucideIcon } from "lucide-react";
import { BarChart3, Brain, LayoutDashboard, Network, SlidersHorizontal } from "lucide-react";
import { cn } from "@/lib/cn";

interface NavItem {
  to: string;
  label: string;
  icon: LucideIcon;
}

const NAV: NavItem[] = [
  { to: "/", label: "Main", icon: LayoutDashboard },
  { to: "/hub", label: "Hub", icon: Network },
  { to: "/editor", label: "Editor", icon: SlidersHorizontal },
  { to: "/statistics", label: "Estatísticas", icon: BarChart3 },
];

export function Sidebar() {
  return (
    <aside className="flex w-64 shrink-0 flex-col border-r border-[var(--color-border)] bg-[var(--color-bg-soft)]/70 px-4 py-5 backdrop-blur">
      {/* Logo */}
      <div className="flex items-center gap-3 px-2">
        <span className="grid size-10 place-items-center rounded-xl bg-[var(--color-primary)]/15 text-[var(--color-primary-bright)] glow-primary">
          <Brain className="size-6" />
        </span>
        <div>
          <p className="text-sm font-semibold leading-tight text-foreground">NeuroGraph</p>
          <p className="text-xs text-faint">Mundo Neural</p>
        </div>
      </div>

      {/* Nav */}
      <nav className="mt-8 flex flex-col gap-1">
        <p className="px-3 pb-2 text-[10px] font-semibold uppercase tracking-widest text-faint">
          Navegação
        </p>
        {NAV.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            end={to === "/"}
            className={({ isActive }) =>
              cn(
                "group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors",
                isActive
                  ? "bg-[var(--color-primary)]/15 text-foreground"
                  : "text-muted hover:bg-white/5 hover:text-foreground",
              )
            }
          >
            {({ isActive }) => (
              <>
                <Icon
                  className={cn(
                    "size-[18px] transition-colors",
                    isActive ? "text-[var(--color-primary-bright)]" : "text-muted group-hover:text-foreground",
                  )}
                />
                {label}
                {isActive && (
                  <span className="ml-auto size-1.5 rounded-full bg-[var(--color-primary-bright)]" />
                )}
              </>
            )}
          </NavLink>
        ))}
      </nav>

      {/* Status */}
      <div className="mt-auto panel p-4">
        <div className="flex items-center gap-2">
          <span className="relative flex size-2">
            <span className="absolute inline-flex size-full animate-ping rounded-full bg-[var(--color-green)] opacity-60" />
            <span className="relative inline-flex size-2 rounded-full bg-[var(--color-green)]" />
          </span>
          <p className="text-xs font-medium text-foreground">Simulação ativa</p>
        </div>
        <p className="mt-2 text-xs text-muted">Tick #48.213 · 60 fps</p>
        <p className="mt-0.5 text-xs text-faint">uptime 04:12:38</p>
      </div>
    </aside>
  );
}
