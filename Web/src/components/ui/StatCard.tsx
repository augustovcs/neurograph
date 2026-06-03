import type { LucideIcon } from "lucide-react";
import { TrendingDown, TrendingUp } from "lucide-react";
import { cn } from "@/lib/cn";

interface StatCardProps {
  label: string;
  value: string;
  delta?: string;
  trend?: "up" | "down";
  color: string;
  icon: LucideIcon;
}

export function StatCard({ label, value, delta, trend, color, icon: Icon }: StatCardProps) {
  const TrendIcon = trend === "down" ? TrendingDown : TrendingUp;
  return (
    <div className="panel panel-hover relative overflow-hidden p-5">
      <div
        className="pointer-events-none absolute -right-6 -top-8 size-24 rounded-full opacity-20 blur-2xl"
        style={{ backgroundColor: color }}
      />
      <div className="flex items-start justify-between">
        <span
          className="grid size-10 place-items-center rounded-xl"
          style={{ backgroundColor: `${color}1f`, color }}
        >
          <Icon className="size-5" />
        </span>
        {delta && (
          <span
            className={cn(
              "flex items-center gap-1 text-xs font-medium",
              trend === "down" ? "text-[var(--color-red)]" : "text-[var(--color-green)]",
            )}
          >
            <TrendIcon className="size-3.5" />
            {delta}
          </span>
        )}
      </div>
      <p className="mt-4 text-3xl font-semibold tracking-tight text-foreground">{value}</p>
      <p className="mt-1 text-sm text-muted">{label}</p>
    </div>
  );
}
