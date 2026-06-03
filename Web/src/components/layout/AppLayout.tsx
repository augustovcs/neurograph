import type { ReactNode } from "react";
import { Sidebar } from "./Sidebar";

interface AppLayoutProps {
  title: string;
  badge: string;
  children: ReactNode;
}

export function AppLayout({ title, badge, children }: AppLayoutProps) {
  return (
    <div className="flex h-full">
      <Sidebar />
      <main className="flex min-w-0 flex-1 flex-col">
        <header className="flex items-center justify-between border-b border-[var(--color-border)] px-8 py-5">
          <h1 className="text-xl font-semibold tracking-tight">{title}</h1>
          <span className="rounded-full border border-[var(--color-border)] bg-[var(--color-panel-2)] px-3 py-1 font-mono text-xs tracking-widest text-[var(--color-primary-bright)]">
            {badge}
          </span>
        </header>
        <div className="min-h-0 flex-1 overflow-y-auto p-8">{children}</div>
      </main>
    </div>
  );
}
