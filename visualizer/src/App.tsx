import { useMemo, useState } from 'react';
import { ReactFlowProvider } from 'reactflow';
import { ALGO_BY_ID, ALGORITHMS } from './data';
import Tree from './components/Tree';
import DetailPanel from './components/DetailPanel';
import Overview from './components/Overview';
import Landing from './components/Landing';
import ThemeToggle from './components/ThemeToggle';

type View = 'landing' | 'overview' | 'tree';

const VIEW_ORDER: View[] = ['landing', 'overview', 'tree'];

export default function App() {
  const [view, setView] = useState<View>('landing');
  const [selectedId, setSelectedId] = useState<string>('mdp');

  const selected = ALGO_BY_ID[selectedId];
  const parent = useMemo(
    () => (selected.parentId ? ALGO_BY_ID[selected.parentId] : null),
    [selected]
  );

  const handleSelectFromOverview = (id: string) => {
    setSelectedId(id);
    setView('tree');
  };

  // Shared mini-nav shown on landing + overview (not on tree — tree has its own chrome)
  const TopNav = () => (
    <header className="px-8 pt-5 pb-4 border-b border-ink-700 sticky top-0 bg-ink-900/95 backdrop-blur z-20">
      <div className="max-w-4xl mx-auto flex items-baseline justify-between gap-4">
        <div>
          <h1 className="text-lg font-semibold tracking-tight">
            RL Algorithm <span className="text-accent-teal">Atlas</span>
          </h1>
          <div className="flex gap-1 mt-2 text-[11px] font-mono">
            {VIEW_ORDER.map((v, i) => (
              <button
                key={v}
                onClick={() => setView(v)}
                className={`px-2 py-1 rounded transition-colors ${
                  view === v
                    ? 'bg-ink-700 text-accent-teal'
                    : 'text-ink-300 hover:text-ink-100'
                }`}
              >
                <span className="text-ink-400">{i + 1}.</span>{' '}
                {v === 'landing' ? 'Foundations' : v === 'overview' ? 'Bifurcations' : 'Tree'}
              </button>
            ))}
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() =>
              setView(
                view === 'landing' ? 'overview' : view === 'overview' ? 'tree' : 'landing'
              )
            }
            className="text-[11px] px-3 py-1.5 rounded border border-ink-500 text-ink-200 hover:border-accent-teal hover:text-accent-teal font-mono whitespace-nowrap"
          >
            {view === 'tree' ? '← Back to start' : 'Next →'}
          </button>
          <ThemeToggle />
        </div>
      </div>
    </header>
  );

  if (view === 'landing') {
    return (
      <div className="h-full w-full bg-ink-900 text-ink-100 overflow-y-auto">
        <TopNav />
        <Landing onContinue={() => setView('overview')} />
      </div>
    );
  }

  if (view === 'overview') {
    return (
      <div className="h-full w-full bg-ink-900 text-ink-100 overflow-y-auto">
        <TopNav />
        <Overview
          algorithms={ALGORITHMS}
          onSelect={handleSelectFromOverview}
          onClose={() => setView('tree')}
        />
      </div>
    );
  }

  return (
    <div className="flex h-full w-full bg-ink-900 text-ink-100">
      {/* Left: tree */}
      <div className="w-[42%] min-w-[420px] border-r border-ink-600 flex flex-col">
        <header className="px-6 py-4 border-b border-ink-600 flex items-start justify-between gap-3">
          <div>
            <h1 className="text-lg font-semibold tracking-tight">
              RL Algorithm <span className="text-accent-teal">Atlas</span>
            </h1>
            <p className="text-xs text-ink-300 mt-1">
              Each edge is a one-line equation diff.
            </p>
          </div>
          <div className="flex items-center gap-1">
            <button
              onClick={() => setView('landing')}
              className="text-[11px] px-2.5 py-1 rounded border border-ink-500 text-ink-300 hover:border-accent-teal hover:text-accent-teal font-mono whitespace-nowrap"
            >
              ↖ Start
            </button>
            <button
              onClick={() => setView('overview')}
              className="text-[11px] px-2.5 py-1 rounded border border-ink-500 text-ink-300 hover:border-accent-teal hover:text-accent-teal font-mono whitespace-nowrap"
            >
              Bifurcations
            </button>
            <ThemeToggle />
          </div>
        </header>
        {/* Fork explainer — the single most important narrative for the tree */}
        <div className="px-6 py-3 border-b border-ink-600 bg-ink-700/40">
          <div className="text-[10px] uppercase tracking-[0.2em] font-mono text-accent-teal mb-1.5">
            Why the tree forks at Bellman
          </div>
          <p className="text-xs text-ink-200 leading-relaxed">
            Bellman gives the recursive identity any solution must satisfy. From there
            you have two strategies: <strong className="text-ink-100">learn the values</strong>{' '}
            and act by argmax <em>(left)</em>, or <strong className="text-ink-100">skip values
            and learn the policy directly</strong> <em>(right)</em>. Each arrow below is a
            specific one-line edit — click a node to see the full diff.
          </p>
        </div>
        <div className="flex-1 relative">
          <ReactFlowProvider>
            <Tree
              algorithms={ALGORITHMS}
              selectedId={selectedId}
              onSelect={setSelectedId}
            />
          </ReactFlowProvider>
        </div>
        <footer className="px-6 py-3 border-t border-ink-600 text-[11px] text-ink-300 flex justify-between">
          <span>Phase 1 · {ALGORITHMS.length} algorithms</span>
          <span className="font-mono">verified against source papers</span>
        </footer>
      </div>

      {/* Right: detail */}
      <div className="flex-1 overflow-y-auto">
        <DetailPanel algorithm={selected} parent={parent} />
      </div>
    </div>
  );
}
