interface ProgressBarProps {
  value: number; // 0..100
  color: string;
}

export function ProgressBar({ value, color }: ProgressBarProps) {
  return (
    <div className="h-1.5 w-full overflow-hidden rounded-full bg-[var(--color-border-soft)]">
      <div
        className="h-full rounded-full transition-[width] duration-500"
        style={{ width: `${Math.min(100, Math.max(0, value))}%`, backgroundColor: color }}
      />
    </div>
  );
}
