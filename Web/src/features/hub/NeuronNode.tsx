import { memo } from "react";
import { Handle, Position, type NodeProps } from "@xyflow/react";

export interface NeuronNodeData {
  label: string;
  color: string;
  firing: boolean;
  dead: boolean;
  size: number;
  [key: string]: unknown;
}

function NeuronNodeImpl({ data }: NodeProps) {
  const d = data as NeuronNodeData;
  const size = d.size;
  return (
    <div className="group relative grid place-items-center" style={{ width: size, height: size }}>
      <Handle type="target" position={Position.Left} className="!size-0 !border-0 !bg-transparent" />
      <Handle type="source" position={Position.Right} className="!size-0 !border-0 !bg-transparent" />

      {d.firing && (
        <span
          className="absolute inset-0 animate-ping rounded-full opacity-50"
          style={{ backgroundColor: d.color }}
        />
      )}
      <span
        className="relative rounded-full transition-transform group-hover:scale-110"
        style={{
          width: size,
          height: size,
          backgroundColor: d.color,
          opacity: d.dead ? 0.25 : 1,
          boxShadow: d.dead ? "none" : `0 0 ${size * 0.9}px ${d.color}, inset 0 0 ${size * 0.3}px rgba(255,255,255,0.6)`,
        }}
      />
      <span className="pointer-events-none absolute -bottom-5 left-1/2 -translate-x-1/2 whitespace-nowrap rounded bg-black/70 px-1.5 py-0.5 font-mono text-[10px] text-white opacity-0 transition-opacity group-hover:opacity-100">
        {d.label}
      </span>
    </div>
  );
}

export const NeuronNode = memo(NeuronNodeImpl);
