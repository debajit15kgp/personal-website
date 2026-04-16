import type { Algorithm } from '../data';
import Equation from './Equation';

const KIND_META = {
  add: { label: 'ADDED', bg: 'bg-diff-add/15', border: 'border-diff-add', text: 'text-diff-add' },
  remove: { label: 'REMOVED', bg: 'bg-diff-remove/15', border: 'border-diff-remove', text: 'text-diff-remove' },
  replace: { label: 'REPLACED', bg: 'bg-accent-amber/15', border: 'border-accent-amber', text: 'text-accent-amber' },
} as const;

interface Props {
  algorithm: Algorithm;
  parent: Algorithm;
}

export default function DiffView({ algorithm, parent }: Props) {
  const diff = algorithm.diffFromParent!;
  return (
    <section className="max-w-3xl space-y-6">
      <div>
        <h3 className="text-xs uppercase tracking-widest text-ink-300 font-mono mb-2">
          The edit that makes <span className="text-accent-teal">{algorithm.name}</span>{' '}
          different from <span className="text-ink-200">{parent.name}</span>
        </h3>
        <p className="text-ink-100 leading-relaxed">{diff.summary}</p>
      </div>

      {/* Parent vs child equations side-by-side */}
      <div className="grid md:grid-cols-2 gap-4">
        <div className="rounded-lg border border-ink-600 bg-ink-800 p-4">
          <div className="text-[10px] uppercase tracking-widest text-ink-300 font-mono mb-3">
            parent — {parent.shortName ?? parent.name}
          </div>
          <div className="overflow-x-auto"><Equation tex={parent.equation.latex} /></div>
        </div>
        <div className="rounded-lg border-2 border-accent-teal/50 bg-ink-800 p-4">
          <div className="text-[10px] uppercase tracking-widest text-accent-teal font-mono mb-3">
            child — {algorithm.shortName ?? algorithm.name}
          </div>
          <div className="overflow-x-auto"><Equation tex={algorithm.equation.latex} /></div>
        </div>
      </div>

      {/* Per-change annotations */}
      <div className="space-y-3">
        <h4 className="text-xs uppercase tracking-widest text-ink-300 font-mono">
          Term-level changes
        </h4>
        {diff.changes.map((c, i) => {
          const meta = KIND_META[c.kind];
          return (
            <div
              key={i}
              className={`rounded-lg border ${meta.border} ${meta.bg} p-4`}
            >
              <div className={`text-[10px] font-bold uppercase tracking-widest font-mono mb-2 ${meta.text}`}>
                {meta.label}
              </div>
              <div className="mb-3 overflow-x-auto">
                <Equation tex={c.term} />
              </div>
              <p className="text-sm text-ink-100">{c.annotation}</p>
            </div>
          );
        })}
      </div>

      {/* Rationale */}
      <div className="rounded-lg border border-ink-600 bg-ink-800 p-5">
        <h4 className="text-xs uppercase tracking-widest text-ink-300 font-mono mb-2">
          Why this change
        </h4>
        <p className="text-sm text-ink-100 leading-relaxed">{diff.rationale}</p>
      </div>
    </section>
  );
}
