interface SliderProps {
  value: number;
  min: number;
  max: number;
  color: string;
  onChange: (value: number) => void;
}

export function Slider({ value, min, max, color, onChange }: SliderProps) {
  const pct = ((value - min) / (max - min)) * 100;
  return (
    <input
      type="range"
      min={min}
      max={max}
      value={value}
      onChange={(e) => onChange(Number(e.target.value))}
      className="h-1.5 w-full cursor-pointer appearance-none rounded-full outline-none
        [&::-webkit-slider-thumb]:size-3.5 [&::-webkit-slider-thumb]:appearance-none
        [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white
        [&::-webkit-slider-thumb]:shadow-[0_0_8px_rgba(255,255,255,0.6)]
        [&::-moz-range-thumb]:size-3.5 [&::-moz-range-thumb]:rounded-full
        [&::-moz-range-thumb]:border-0 [&::-moz-range-thumb]:bg-white"
      style={{
        background: `linear-gradient(90deg, ${color} ${pct}%, var(--color-border-soft) ${pct}%)`,
      }}
    />
  );
}
