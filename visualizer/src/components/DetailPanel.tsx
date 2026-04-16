import { useState, useMemo, useEffect } from 'react';
import type { Algorithm } from '../data';
import Equation from './Equation';
import HeroScene from './HeroScene';
import DiffView from './DiffView';
import CodeRunner from './CodeRunner';
import SourcesPanel from './SourcesPanel';
import Glossary from './Glossary';
import { BRANCH_COLOR } from './Tree';

type Tab = 'intuition' | 'equation' | 'diff' | 'code' | 'sources';

const TABS: { id: Tab; label: string }[] = [
  { id: 'intuition', label: 'The idea' },
  { id: 'equation', label: 'Equation' },
  { id: 'diff', label: 'How it builds on ↑' },
  { id: 'code', label: 'Run code' },
  { id: 'sources', label: 'Sources' },
];

interface Props {
  algorithm: Algorithm;
  parent: Algorithm | null;
}

export default function DetailPanel({ algorithm, parent }: Props) {
  const [tab, setTab] = useState<Tab>('intuition');

  // Reset to Intuition when algorithm changes (gives a fresh read)
  useEffect(() => setTab('intuition'), [algorithm.id]);

  const availableTabs = useMemo(
    () => TABS.filter((t) => t.id !== 'diff' || !!algorithm.diffFromParent),
    [algorithm]
  );

  const color = BRANCH_COLOR(algorithm.branch);

  return (
    <div className="h-full flex flex-col">
      {/* Hero */}
      <div className="relative border-b border-ink-600 bg-gradient-to-br from-ink-800 to-ink-900 px-8 py-6 overflow-hidden">
        <div className="absolute top-0 right-0 w-[260px] h-[180px] pointer-events-none">
          <HeroScene branch={algorithm.branch} />
        </div>
        <div className="relative z-10 max-w-2xl">
          <div className="flex items-center gap-2 mb-3 flex-wrap">
            <span
              className="text-[10px] uppercase tracking-[0.2em] font-mono px-2 py-0.5 rounded border"
              style={{ color, borderColor: color + '55' }}
            >
              {algorithm.branch.replace('-', ' ')}
            </span>
            <span className="text-[10px] uppercase tracking-[0.2em] font-mono text-ink-300">
              {algorithm.year}
            </span>
            {algorithm.categories.method !== 'foundation' && (
              <>
                <span className="text-ink-400">·</span>
                <span className="text-[10px] uppercase tracking-[0.2em] font-mono text-ink-200">
                  {algorithm.categories.method.replace('-', ' ')}
                </span>
                {algorithm.categories.policyMatch !== 'n/a' && (
                  <>
                    <span className="text-ink-400">·</span>
                    <span className="text-[10px] uppercase tracking-[0.2em] font-mono text-ink-200">
                      {algorithm.categories.policyMatch.replace('-', ' ')}
                    </span>
                  </>
                )}
                <span className="text-ink-400">·</span>
                <span className="text-[10px] uppercase tracking-[0.2em] font-mono text-ink-200">
                  {algorithm.categories.model.replace('-', ' ')}
                </span>
              </>
            )}
          </div>
          <h2 className="text-3xl font-bold tracking-tight">{algorithm.name}</h2>
          <p className="mt-2 text-ink-200 text-sm leading-relaxed">{algorithm.tagline}</p>
          {parent && (
            <p className="mt-3 text-[11px] text-ink-300 font-mono">
              ← builds on{' '}
              <button
                className="text-accent-teal hover:underline"
                onClick={(e) => {
                  e.preventDefault();
                  // Navigation handled by parent via a click event on nodes; here we
                  // just scroll to the diff tab for quick reference.
                  setTab('diff');
                }}
              >
                {parent.name}
              </button>
            </p>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-ink-600 bg-ink-800/50 px-8">
        <div className="flex gap-1">
          {availableTabs.map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`px-3 py-2.5 text-xs font-medium border-b-2 transition-colors ${
                tab === t.id
                  ? 'border-accent-teal text-accent-teal'
                  : 'border-transparent text-ink-300 hover:text-ink-100'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      {/* Tab body */}
      <div className="flex-1 px-8 py-6 overflow-y-auto">
        {tab === 'intuition' && (
          <section className="max-w-3xl space-y-4">
            <h3 className="text-xs uppercase tracking-widest text-ink-300 font-mono">
              The idea, in one paragraph
            </h3>
            <p className="text-ink-100 leading-relaxed">{algorithm.intuition}</p>

            <h3 className="text-xs uppercase tracking-widest text-ink-300 font-mono pt-4">
              Core equation
            </h3>
            <div className="rounded-lg border border-ink-600 bg-ink-800 p-5 overflow-x-auto">
              <Equation tex={algorithm.equation.latex} />
            </div>
            <p className="text-[11px] text-ink-300 font-mono">
              ⤷{' '}
              <a
                href={algorithm.equation.citation.url}
                target="_blank"
                rel="noreferrer"
                className="text-accent-teal hover:underline"
              >
                {algorithm.equation.citation.source}
              </a>
              {' · '}
              {algorithm.equation.citation.loc}
            </p>

            <Glossary algorithm={algorithm} />
          </section>
        )}

        {tab === 'equation' && (
          <section className="max-w-3xl space-y-4">
            <div className="rounded-lg border border-ink-600 bg-ink-800 p-6 overflow-x-auto">
              <Equation tex={algorithm.equation.latex} />
            </div>

            <Glossary algorithm={algorithm} />

            <div className="rounded-lg border border-ink-600 bg-ink-800 p-5 space-y-3">
              <h4 className="text-xs uppercase tracking-widest text-ink-300 font-mono">
                Provenance
              </h4>
              <dl className="text-sm space-y-2">
                <div className="flex gap-3">
                  <dt className="text-ink-300 w-20 flex-shrink-0">source</dt>
                  <dd>
                    <a
                      href={algorithm.equation.citation.url}
                      target="_blank"
                      rel="noreferrer"
                      className="text-accent-teal hover:underline"
                    >
                      {algorithm.equation.citation.source}
                    </a>
                  </dd>
                </div>
                <div className="flex gap-3">
                  <dt className="text-ink-300 w-20 flex-shrink-0">location</dt>
                  <dd className="font-mono text-ink-100 text-[13px]">
                    {algorithm.equation.citation.loc}
                  </dd>
                </div>
                {algorithm.equation.citation.quote && (
                  <div className="flex gap-3">
                    <dt className="text-ink-300 w-20 flex-shrink-0">verbatim</dt>
                    <dd className="font-mono text-ink-200 text-[13px] border-l-2 border-accent-teal pl-3 italic">
                      “{algorithm.equation.citation.quote}”
                    </dd>
                  </div>
                )}
                {algorithm.equation.citation.verifiedVia && (
                  <div className="flex gap-3">
                    <dt className="text-ink-300 w-20 flex-shrink-0">verified via</dt>
                    <dd className="space-y-1">
                      {algorithm.equation.citation.verifiedVia.map((u) => (
                        <a
                          key={u}
                          href={u}
                          target="_blank"
                          rel="noreferrer"
                          className="block text-accent-teal hover:underline text-[13px] font-mono break-all"
                        >
                          {u}
                        </a>
                      ))}
                    </dd>
                  </div>
                )}
              </dl>
            </div>
          </section>
        )}

        {tab === 'diff' && algorithm.diffFromParent && parent && (
          <DiffView algorithm={algorithm} parent={parent} />
        )}

        {tab === 'code' && <CodeRunner algorithm={algorithm} />}

        {tab === 'sources' && <SourcesPanel algorithm={algorithm} />}
      </div>
    </div>
  );
}
