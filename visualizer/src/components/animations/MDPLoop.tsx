import { useEffect, useState } from 'react';

/**
 * The Agent ↔ Environment loop, animated. Each tick highlights the next edge
 * of the cycle: Agent → Action → Env → State+Reward → Agent.
 */

const STEPS = [
  { from: 'agent', to: 'env', label: 'action aₜ', detail: 'Agent picks an action' },
  { from: 'env', to: 'agent', label: 'state sₜ₊₁, reward rₜ₊₁', detail: 'Environment responds' },
];

export default function MDPLoop() {
  const [step, setStep] = useState(0);

  useEffect(() => {
    const id = setInterval(() => setStep((s) => (s + 1) % STEPS.length), 1800);
    return () => clearInterval(id);
  }, []);

  const active = STEPS[step];

  return (
    <div className="relative rounded-lg border border-ink-600 bg-ink-800 p-8">
      <svg viewBox="0 0 500 220" className="w-full max-w-xl mx-auto block">
        {/* Agent box */}
        <g>
          <rect
            x="40" y="70" width="140" height="80" rx="8"
            fill="rgb(var(--ink-800))"
            stroke={active.from === 'agent' ? 'rgb(var(--accent-teal))' : 'rgb(var(--ink-500))'}
            strokeWidth={active.from === 'agent' ? 2.5 : 1.5}
            className="transition-all"
          />
          <text x="110" y="105" textAnchor="middle" fontSize="16" fill="rgb(var(--ink-100))" fontWeight="600">
            Agent
          </text>
          <text x="110" y="126" textAnchor="middle" fontSize="10" fill="rgb(var(--ink-300))" fontFamily="monospace">
            policy π(a | s)
          </text>
        </g>

        {/* Env box */}
        <g>
          <rect
            x="320" y="70" width="140" height="80" rx="8"
            fill="rgb(var(--ink-800))"
            stroke={active.from === 'env' ? 'rgb(var(--accent-amber))' : 'rgb(var(--ink-500))'}
            strokeWidth={active.from === 'env' ? 2.5 : 1.5}
            className="transition-all"
          />
          <text x="390" y="105" textAnchor="middle" fontSize="16" fill="rgb(var(--ink-100))" fontWeight="600">
            Environment
          </text>
          <text x="390" y="126" textAnchor="middle" fontSize="10" fill="rgb(var(--ink-300))" fontFamily="monospace">
            P(s' | s,a) · R(s,a)
          </text>
        </g>

        {/* Arrow: agent → env (top) */}
        <g opacity={active.from === 'agent' ? 1 : 0.35} className="transition-opacity">
          <path d="M 180 90 Q 250 50 320 90" fill="none" stroke="rgb(var(--accent-teal))" strokeWidth="2" markerEnd="url(#arrow-teal)" />
          <text x="250" y="42" textAnchor="middle" fontSize="11" fill="rgb(var(--accent-teal))" fontFamily="monospace">
            action aₜ
          </text>
        </g>

        {/* Arrow: env → agent (bottom) */}
        <g opacity={active.from === 'env' ? 1 : 0.35} className="transition-opacity">
          <path d="M 320 130 Q 250 170 180 130" fill="none" stroke="rgb(var(--accent-amber))" strokeWidth="2" markerEnd="url(#arrow-amber)" />
          <text x="250" y="195" textAnchor="middle" fontSize="11" fill="rgb(var(--accent-amber))" fontFamily="monospace">
            next state sₜ₊₁ · reward rₜ₊₁
          </text>
        </g>

        <defs>
          <marker id="arrow-teal" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto">
            <path d="M 0 0 L 10 5 L 0 10 z" fill="rgb(var(--accent-teal))" />
          </marker>
          <marker id="arrow-amber" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto">
            <path d="M 0 0 L 10 5 L 0 10 z" fill="rgb(var(--accent-amber))" />
          </marker>
        </defs>
      </svg>
      <div className="text-center mt-4 text-xs text-ink-300 font-mono">
        {active.detail}
      </div>
    </div>
  );
}
