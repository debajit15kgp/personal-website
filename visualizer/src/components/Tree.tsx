import { useMemo, useEffect } from 'react';
import ReactFlow, {
  Background,
  Controls,
  Panel,
  type Edge,
  type Node,
  Position,
  useReactFlow,
} from 'reactflow';
import type { Algorithm } from '../data';
import AlgoNode from './AlgoNode';
import { useTheme, branchColor } from '../lib/theme';

const nodeTypes = { algo: AlgoNode };

// Re-export a convenience wrapper so the rest of the app can read a branch
// color without knowing about the theme. Uses the current theme at call time.
export function BRANCH_COLOR(branch: string): string {
  const t = document.documentElement.getAttribute('data-theme') === 'dark' ? 'dark' : 'light';
  return branchColor(branch, t);
}

interface Props {
  algorithms: Algorithm[];
  selectedId: string;
  onSelect: (id: string) => void;
}

export default function Tree({ algorithms, selectedId, onSelect }: Props) {
  const { setCenter } = useReactFlow();
  const { theme } = useTheme();

  const { nodes, edges } = useMemo(() => {
    const perLevel: Record<number, Algorithm[]> = {};
    for (const a of algorithms) (perLevel[a.level] ||= []).push(a);

    const X_SPACING = 280;
    const Y_SPACING = 155;

    const nodes: Node[] = algorithms.map((a) => {
      const siblings = perLevel[a.level];
      const idx = siblings.indexOf(a);
      const offset = (idx - (siblings.length - 1) / 2) * X_SPACING;
      return {
        id: a.id,
        type: 'algo',
        position: { x: offset, y: a.level * Y_SPACING },
        data: {
          algo: a,
          selected: a.id === selectedId,
          color: branchColor(a.branch, theme),
        },
        sourcePosition: Position.Bottom,
        targetPosition: Position.Top,
      };
    });

    const edgeMuted = theme === 'dark' ? '#3a3f55' : '#d1d5db';
    const edges: Edge[] = algorithms
      .filter((a) => a.parentId)
      .map((a) => ({
        id: `e-${a.parentId}-${a.id}`,
        source: a.parentId!,
        target: a.id,
        type: 'smoothstep',
        animated: a.id === selectedId,
        style: {
          stroke: a.id === selectedId ? branchColor(a.branch, theme) : edgeMuted,
          strokeWidth: a.id === selectedId ? 2.2 : 1.5,
        },
        // Prefer the hand-curated `edgeLabel`; fall back to the first few
        // words of the diff summary only if a label is missing.
        label:
          a.edgeLabel ??
          (a.diffFromParent?.summary?.split(' ').slice(0, 5).join(' ') + '…'),
        labelStyle: {
          fill: a.id === selectedId ? branchColor(a.branch, theme) : theme === 'dark' ? '#d4d6df' : '#2d2d2d',
          fontSize: 11,
          fontFamily: 'JetBrains Mono, monospace',
          fontWeight: a.id === selectedId ? 600 : 500,
        },
        labelBgStyle: {
          fill: theme === 'dark' ? '#181b24' : '#ffffff',
          fillOpacity: 0.96,
          stroke: a.id === selectedId ? branchColor(a.branch, theme) : edgeMuted,
          strokeWidth: a.id === selectedId ? 1 : 0,
        },
        labelBgPadding: [6, 3] as [number, number],
        labelBgBorderRadius: 4,
      }));

    return { nodes, edges };
  }, [algorithms, selectedId, theme]);

  useEffect(() => {
    const n = nodes.find((n) => n.id === selectedId);
    if (n) setCenter(n.position.x, n.position.y, { zoom: 1.05, duration: 600 });
  }, [selectedId, nodes, setCenter]);

  return (
    <ReactFlow
      nodes={nodes}
      edges={edges}
      nodeTypes={nodeTypes}
      onNodeClick={(_, n) => onSelect(n.id)}
      fitView
      fitViewOptions={{ padding: 0.4, minZoom: 0.6, maxZoom: 1.2 }}
      minZoom={0.3}
      maxZoom={2}
      proOptions={{ hideAttribution: true }}
    >
      <Background color={theme === 'dark' ? '#1c1f2a' : '#ebe8df'} gap={28} size={1} />
      <Controls showInteractive={false} />

      {/* Lane labels — explain what each side of the fork represents. */}
      <Panel position="top-left" className="!m-3 pointer-events-none">
        <div className="flex items-center gap-1.5 text-[10px] uppercase tracking-[0.18em] font-mono text-ink-300 bg-ink-800/90 backdrop-blur border border-ink-600 rounded px-2.5 py-1.5">
          <span
            className="inline-block w-1.5 h-1.5 rounded-full"
            style={{ background: branchColor('value', theme) }}
          />
          <span>Value lineage</span>
          <span className="text-ink-400 mx-1">·</span>
          <span className="normal-case tracking-normal text-ink-200">learn Q(s, a), pick argmax</span>
        </div>
      </Panel>
      <Panel position="top-right" className="!m-3 pointer-events-none">
        <div className="flex items-center gap-1.5 text-[10px] uppercase tracking-[0.18em] font-mono text-ink-300 bg-ink-800/90 backdrop-blur border border-ink-600 rounded px-2.5 py-1.5">
          <span className="normal-case tracking-normal text-ink-200">optimize π(a | s) directly</span>
          <span className="text-ink-400 mx-1">·</span>
          <span>Policy lineage</span>
          <span
            className="inline-block w-1.5 h-1.5 rounded-full"
            style={{ background: branchColor('policy-gradient', theme) }}
          />
        </div>
      </Panel>
    </ReactFlow>
  );
}
