interface BadgeProps {
  label: string;
  color: string;
  dot?: boolean;
}

export function Badge({ label, color, dot = true }: BadgeProps) {
  return (
    <span
      className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium"
      style={{ backgroundColor: `${color}1a`, color }}
    >
      {dot && <span className="size-1.5 rounded-full" style={{ backgroundColor: color }} />}
      {label}
    </span>
  );
}
