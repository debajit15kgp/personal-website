import { useEffect, useState, useCallback } from 'react';

/**
 * Value iteration on the same 4x4 grid world. Cells tint blue with their V(s);
 * each tick runs one Bellman backup. Values "bloom" outward from the goal.
 *
 * This animates WHY the Bellman equation is the engine of everything else.
 */

const ROWS = 4;
const COLS = 4;
const GAMMA = 0.9;

// Map: (r,c) → reward on entering. Goal +1, pit −1, else 0 (until goal/pit they're terminal).
const REWARDS: number[][] = [
  [0, 0, 0, 0],
  [0, 0, 0, 0],
  [0, -1, 0, 0],
  [0, 0, 0, 1],
];
const TERMINAL: boolean[][] = [
  [false, false, false, false],
  [false, false, false, false],
  [false, true,  false, false],
  [false, false, false, true ],
];

const ACTIONS: Array<[number, number]> = [[-1, 0], [1, 0], [0, -1], [0, 1]];

function bellmanBackup(V: number[][]): number[][] {
  const newV = V.map((row) => row.slice());
  for (let r = 0; r < ROWS; r++) {
    for (let c = 0; c < COLS; c++) {
      if (TERMINAL[r][c]) { newV[r][c] = REWARDS[r][c]; continue; }
      let best = -Infinity;
      for (const [dr, dc] of ACTIONS) {
        const nr = Math.max(0, Math.min(ROWS - 1, r + dr));
        const nc = Math.max(0, Math.min(COLS - 1, c + dc));
        const reward = REWARDS[nr][nc];
        const q = reward + GAMMA * V[nr][nc];
        if (q > best) best = q;
      }
      newV[r][c] = best;
    }
  }
  return newV;
}

const INITIAL_V: number[][] = Array.from({ length: ROWS }, () => Array(COLS).fill(0));

export default function BellmanPropagation() {
  const [V, setV] = useState<number[][]>(INITIAL_V);
  const [iter, setIter] = useState(0);

  const reset = useCallback(() => {
    setV(INITIAL_V);
    setIter(0);
  }, []);

  useEffect(() => {
    const id = setInterval(() => {
      setIter((k) => {
        if (k >= 12) { reset(); return 0; }
        setV((curr) => bellmanBackup(curr));
        return k + 1;
      });
    }, 850);
    return () => clearInterval(id);
  }, [reset]);

  const size = 72;
  const total = size * COLS;

  // Tint by value: blend the primary accent at increasing opacity
  const tintColor = (v: number) => {
    const x = Math.max(0, Math.min(1, v));
    const alpha = 0.08 + 0.45 * x;
    return `rgb(var(--accent-teal) / ${alpha.toFixed(2)})`;
  };

  return (
    <div className="rounded-lg border border-ink-600 bg-ink-800 p-6">
      <div className="flex items-center gap-6 flex-wrap justify-center">
        <div>
          <svg width={total + 2} height={total + 2} className="block">
            {V.map((row, r) =>
              row.map((v, c) => {
                const isGoal = TERMINAL[r][c] && REWARDS[r][c] > 0;
                const isPit = TERMINAL[r][c] && REWARDS[r][c] < 0;
                return (
                  <g key={`${r}-${c}`}>
                    <rect
                      x={c * size + 1}
                      y={r * size + 1}
                      width={size - 2}
                      height={size - 2}
                      rx={4}
                      fill={
                        isPit
                          ? 'rgb(var(--diff-remove) / 0.18)'
                          : isGoal
                          ? 'rgb(var(--diff-add) / 0.22)'
                          : tintColor(v)
                      }
                      stroke={
                        isGoal
                          ? 'rgb(var(--diff-add))'
                          : isPit
                          ? 'rgb(var(--diff-remove))'
                          : 'rgb(var(--ink-600))'
                      }
                      strokeWidth={isGoal || isPit ? 1.5 : 1}
                      style={{ transition: 'fill 0.6s ease' }}
                    />
                    <text
                      x={c * size + size / 2}
                      y={r * size + size / 2 + 5}
                      textAnchor="middle"
                      fontSize="14"
                      fill={isPit ? 'rgb(var(--diff-remove))' : isGoal ? 'rgb(var(--diff-add))' : 'rgb(var(--ink-100))'}
                      fontFamily="monospace"
                      fontWeight={isGoal || isPit ? 'bold' : 'normal'}
                    >
                      {isPit ? '−1' : isGoal ? '+1' : v.toFixed(2)}
                    </text>
                  </g>
                );
              })
            )}
          </svg>
          <div className="text-center mt-2 text-[11px] text-ink-300 font-mono">
            iteration {iter} / 12 · auto-loops
          </div>
        </div>

        <div className="text-xs text-ink-200 max-w-xs space-y-2">
          <div className="text-[10px] uppercase tracking-widest font-mono text-ink-300">
            value iteration
          </div>
          <p className="leading-relaxed">
            Each tick applies the Bellman optimality update:
          </p>
          <div className="rounded bg-ink-900 px-3 py-2 font-mono text-[11px] text-ink-100 leading-relaxed">
            V(s) ← max<sub>a</sub> [ r + γ · V(s′) ]
          </div>
          <p className="leading-relaxed pt-1">
            Value at the <span className="text-diff-add">goal</span> leaks outward one cell per iteration — closer cells inherit a discounted fraction. After ~10 iterations the whole grid is solved.
          </p>
          <p className="text-[11px] text-ink-300 leading-relaxed pt-1 border-t border-ink-700">
            Every algorithm in the atlas is a different way of computing, approximating, or shortcutting this fixed-point.
          </p>
        </div>
      </div>
    </div>
  );
}
