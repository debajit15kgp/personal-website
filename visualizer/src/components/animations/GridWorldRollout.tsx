import { useEffect, useMemo, useState } from 'react';

/**
 * A 4x4 grid world. Start (0,0), goal (3,3) = +1, pit (2,1) = −1.
 * An agent (dot) follows a pre-baked shortest-path trajectory. Each tick it
 * takes one step; reward flashes on the cell it lands in.
 *
 * This is the canonical "MDP as a picture" — lets readers see state, action,
 * reward in motion before any math.
 */

type Cell = 'empty' | 'start' | 'goal' | 'pit';

const GRID: Cell[][] = [
  ['start', 'empty', 'empty', 'empty'],
  ['empty', 'empty', 'empty', 'empty'],
  ['empty', 'pit',   'empty', 'empty'],
  ['empty', 'empty', 'empty', 'goal' ],
];

// Deliberate "sensible" trajectory that goes around the pit.
const TRAJECTORY: Array<[number, number]> = [
  [0, 0], [0, 1], [0, 2], [0, 3],
  [1, 3], [2, 3], [3, 3],
];

export default function GridWorldRollout() {
  const [idx, setIdx] = useState(0);
  const [showReward, setShowReward] = useState<string | null>(null);

  useEffect(() => {
    const id = setInterval(() => {
      setIdx((i) => {
        const next = (i + 1) % (TRAJECTORY.length + 2); // +2 for a pause at end
        return next;
      });
    }, 750);
    return () => clearInterval(id);
  }, []);

  const pos = TRAJECTORY[Math.min(idx, TRAJECTORY.length - 1)];

  useEffect(() => {
    const [r, c] = pos;
    const kind = GRID[r][c];
    if (kind === 'goal') {
      setShowReward('+1');
      const t = setTimeout(() => setShowReward(null), 700);
      return () => clearTimeout(t);
    }
  }, [pos]);

  const size = 72; // cell size in px
  const total = size * 4;

  const cellColor = (cell: Cell) => {
    switch (cell) {
      case 'goal': return 'rgb(var(--diff-add) / 0.18)';
      case 'pit': return 'rgb(var(--diff-remove) / 0.15)';
      case 'start': return 'rgb(var(--ink-700))';
      default: return 'rgb(var(--ink-800))';
    }
  };

  const cellBorder = (cell: Cell) => {
    switch (cell) {
      case 'goal': return 'rgb(var(--diff-add))';
      case 'pit': return 'rgb(var(--diff-remove))';
      default: return 'rgb(var(--ink-600))';
    }
  };

  const path = useMemo(() => {
    const points = TRAJECTORY.slice(0, idx + 1).map(([r, c]) => ({
      x: c * size + size / 2,
      y: r * size + size / 2,
    }));
    return points.map((p, i) => (i === 0 ? `M ${p.x} ${p.y}` : `L ${p.x} ${p.y}`)).join(' ');
  }, [idx, size]);

  return (
    <div className="rounded-lg border border-ink-600 bg-ink-800 p-6">
      <div className="flex items-center gap-6 flex-wrap justify-center">
        <svg width={total + 2} height={total + 2} className="block">
          {/* Cells */}
          {GRID.map((row, r) =>
            row.map((cell, c) => (
              <g key={`${r}-${c}`}>
                <rect
                  x={c * size + 1}
                  y={r * size + 1}
                  width={size - 2}
                  height={size - 2}
                  rx={4}
                  fill={cellColor(cell)}
                  stroke={cellBorder(cell)}
                  strokeWidth={cell === 'empty' ? 1 : 1.5}
                />
                {cell === 'goal' && (
                  <text x={c * size + size / 2} y={r * size + size / 2 + 5} textAnchor="middle" fontSize="13" fill="rgb(var(--diff-add))" fontFamily="monospace" fontWeight="600">
                    +1
                  </text>
                )}
                {cell === 'pit' && (
                  <text x={c * size + size / 2} y={r * size + size / 2 + 5} textAnchor="middle" fontSize="13" fill="rgb(var(--diff-remove))" fontFamily="monospace" fontWeight="600">
                    −1
                  </text>
                )}
                {cell === 'start' && (
                  <text x={c * size + 6} y={r * size + 14} fontSize="9" fill="rgb(var(--ink-300))" fontFamily="monospace">
                    S
                  </text>
                )}
              </g>
            ))
          )}

          {/* Path trail */}
          <path d={path} fill="none" stroke="rgb(var(--accent-teal))" strokeWidth="2" strokeDasharray="4 3" opacity="0.6" />

          {/* Agent */}
          <circle
            cx={pos[1] * size + size / 2}
            cy={pos[0] * size + size / 2}
            r={size * 0.18}
            fill="rgb(var(--accent-teal))"
            stroke="rgb(var(--ink-900))"
            strokeWidth="2"
            style={{ transition: 'all 0.55s cubic-bezier(.4,.2,.3,1.1)' }}
          />

          {/* Reward popup */}
          {showReward && (
            <text
              x={pos[1] * size + size / 2}
              y={pos[0] * size - 4}
              textAnchor="middle"
              fontSize="18"
              fill="rgb(var(--diff-add))"
              fontWeight="bold"
              className="animate-pulse"
            >
              {showReward}
            </text>
          )}
        </svg>

        <div className="text-xs text-ink-200 max-w-xs">
          <div className="text-[10px] uppercase tracking-widest font-mono text-ink-300 mb-2">
            the loop
          </div>
          <ul className="space-y-1.5 leading-relaxed">
            <li><span className="text-accent-teal font-mono">state</span> = where the dot is</li>
            <li><span className="text-accent-teal font-mono">action</span> = up / down / left / right</li>
            <li><span className="text-accent-teal font-mono">reward</span> = +1 at <span className="text-diff-add">goal</span>, −1 at <span className="text-diff-remove">pit</span>, 0 else</li>
            <li><span className="text-accent-teal font-mono">episode</span> = until it reaches goal</li>
          </ul>
          <div className="mt-3 pt-3 border-t border-ink-700 text-[11px] text-ink-300">
            This trajectory is hand-coded. Learning an agent that <em>finds</em> such a trajectory on its own is the entire job of RL.
          </div>
        </div>
      </div>
    </div>
  );
}
