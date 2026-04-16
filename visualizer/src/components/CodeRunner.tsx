import { useEffect, useRef, useState } from 'react';
import type { Algorithm } from '../data';
import { getPyodide } from '../lib/pyodide';

interface Props {
  algorithm: Algorithm;
}

type RunState = 'idle' | 'loading' | 'running' | 'done' | 'error';

export default function CodeRunner({ algorithm }: Props) {
  const [code, setCode] = useState(algorithm.code.source);
  const [output, setOutput] = useState<string>('');
  const [status, setStatus] = useState<RunState>('idle');
  const [progress, setProgress] = useState<string>('');
  const outRef = useRef<HTMLDivElement>(null);

  // Reset editor when algorithm switches
  useEffect(() => {
    setCode(algorithm.code.source);
    setOutput('');
    setStatus('idle');
  }, [algorithm.id]);

  async function run() {
    setStatus('loading');
    setOutput('');
    setProgress('');
    try {
      const py = await getPyodide((s) => setProgress(s));
      setStatus('running');
      let buf = '';
      py.setStdout({
        batched: (s: string) => {
          buf += s + '\n';
          setOutput(buf);
        },
      });
      py.setStderr({
        batched: (s: string) => {
          buf += s + '\n';
          setOutput(buf);
        },
      });
      await py.runPythonAsync(code);
      setStatus('done');
    } catch (e) {
      setOutput((prev) => prev + '\n' + String((e as Error).message ?? e));
      setStatus('error');
    }
  }

  return (
    <section className="max-w-3xl space-y-4">
      <div>
        <h3 className="text-xs uppercase tracking-widest text-ink-300 font-mono mb-2">
          Runnable snippet — executes in your browser via Pyodide
        </h3>
        <p className="text-sm text-ink-200 leading-relaxed">
          {algorithm.code.description}
        </p>
      </div>

      <div className="rounded-lg border border-ink-600 bg-ink-800 overflow-hidden">
        <div className="flex items-center justify-between px-4 py-2 border-b border-ink-600 bg-ink-700/50">
          <span className="text-[10px] uppercase tracking-widest font-mono text-ink-300">
            python · numpy
          </span>
          <div className="flex gap-2">
            {algorithm.code.colabUrl && (
              <a
                href={algorithm.code.colabUrl}
                target="_blank"
                rel="noreferrer"
                className="text-[11px] px-2.5 py-1 rounded border border-ink-500 text-ink-200 hover:border-accent-amber hover:text-accent-amber font-mono"
              >
                Open full training in Colab ↗
              </a>
            )}
            <button
              onClick={run}
              disabled={status === 'loading' || status === 'running'}
              className="text-[11px] px-3 py-1 rounded bg-accent-teal text-ink-900 font-semibold hover:bg-accent-teal/90 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {status === 'loading' ? 'Loading…' : status === 'running' ? 'Running…' : '▶ Run'}
            </button>
          </div>
        </div>
        <textarea
          value={code}
          onChange={(e) => setCode(e.target.value)}
          spellCheck={false}
          className="w-full bg-ink-800 text-ink-100 font-mono text-[13px] leading-relaxed p-4 focus:outline-none resize-y"
          style={{ minHeight: '200px' }}
          rows={Math.min(30, code.split('\n').length + 2)}
        />
      </div>

      {status !== 'idle' && (
        <div className="rounded-lg border border-ink-600 bg-ink-900 overflow-hidden">
          <div className="flex items-center justify-between px-4 py-2 border-b border-ink-600 bg-ink-800">
            <span className="text-[10px] uppercase tracking-widest font-mono text-ink-300">
              output
            </span>
            {progress && status === 'loading' && (
              <span className="text-[10px] font-mono text-accent-teal">{progress}</span>
            )}
            {status === 'done' && (
              <span className="text-[10px] font-mono text-diff-add">✓ completed</span>
            )}
            {status === 'error' && (
              <span className="text-[10px] font-mono text-diff-remove">✗ error</span>
            )}
          </div>
          <div
            ref={outRef}
            className="p-4 font-mono text-[12px] text-ink-100 whitespace-pre-wrap overflow-x-auto max-h-[320px]"
          >
            {output || (status === 'loading' ? 'Fetching Pyodide (~10 MB, cached on subsequent runs)…' : '')}
          </div>
        </div>
      )}
    </section>
  );
}
