import { Handle, Position, type NodeProps } from 'reactflow';
import type { Algorithm } from '../data';

interface Data {
  algo: Algorithm;
  selected: boolean;
  color: string;
}

export default function AlgoNode({ data }: NodeProps<Data>) {
  const { algo, selected, color } = data;
  // A compact 2-line category chip row: what's parameterized + policy match
  const chips = [
    algo.categories.method !== 'foundation' ? algo.categories.method : null,
    algo.categories.policyMatch !== 'n/a' ? algo.categories.policyMatch : null,
    algo.categories.model,
  ].filter(Boolean) as string[];

  return (
    <div
      className={`relative rounded-lg border transition-all cursor-pointer select-none bg-ink-800
        ${selected ? 'border-2 shadow-card' : 'border border-ink-600'}
      `}
      style={{
        borderColor: selected ? color : undefined,
        boxShadow: selected ? `0 0 0 4px ${color}20` : undefined,
        minWidth: 210,
        maxWidth: 250,
      }}
    >
      {algo.parentId && <Handle type="target" position={Position.Top} style={{ background: color, width: 7, height: 7 }} />}
      <div className="px-3 py-2.5">
        <div className="flex items-center gap-2 mb-0.5">
          <span
            className="inline-block w-1.5 h-1.5 rounded-full"
            style={{ background: color }}
          />
          <span className="text-[10px] uppercase tracking-wider text-ink-300 font-mono">
            {algo.year}
          </span>
        </div>
        <div className="font-semibold text-sm text-ink-100">
          {algo.shortName ?? algo.name}
        </div>
        <div className="text-[11px] text-ink-300 mt-1 leading-snug">
          {algo.tagline}
        </div>
        <div className="flex flex-wrap gap-1 mt-2">
          {chips.map((c) => (
            <span
              key={c}
              className="text-[9px] uppercase tracking-wider font-mono px-1.5 py-0.5 rounded bg-ink-700 text-ink-200"
            >
              {c.replace('-', ' ')}
            </span>
          ))}
        </div>
      </div>
      <Handle type="source" position={Position.Bottom} style={{ background: color, width: 7, height: 7 }} />
    </div>
  );
}
