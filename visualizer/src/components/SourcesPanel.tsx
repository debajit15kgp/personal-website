import type { Algorithm } from '../data';

export default function SourcesPanel({ algorithm }: { algorithm: Algorithm }) {
  return (
    <section className="max-w-3xl space-y-4">
      <h3 className="text-xs uppercase tracking-widest text-ink-300 font-mono">
        Where every claim on this page comes from
      </h3>
      <p className="text-sm text-ink-200 leading-relaxed">
        The atlas enforces a correctness harness: every equation has a{' '}
        <span className="text-accent-teal">primary citation</span> to its original
        paper and, where possible, a <span className="text-accent-amber">secondary
        reference</span> (textbook or Spinning Up) that confirms the exact form.
        Click through to verify.
      </p>
      <ul className="space-y-3">
        {algorithm.sources.map((s, i) => (
          <li
            key={i}
            className="rounded-lg border border-ink-600 bg-ink-800 p-4"
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1 min-w-0">
                <a
                  href={s.url}
                  target="_blank"
                  rel="noreferrer"
                  className="text-accent-teal hover:underline font-medium text-sm"
                >
                  {s.source}
                </a>
                <p className="text-xs text-ink-200 mt-1 font-mono">{s.loc}</p>
                {s.quote && (
                  <blockquote className="mt-2 text-xs text-ink-200 italic border-l-2 border-accent-teal pl-3 font-mono">
                    “{s.quote}”
                  </blockquote>
                )}
              </div>
              <span className="text-[10px] uppercase tracking-widest font-mono text-ink-300 flex-shrink-0 pt-1">
                [{i + 1}]
              </span>
            </div>
            <a
              href={s.url}
              target="_blank"
              rel="noreferrer"
              className="text-[10px] text-ink-300 font-mono block mt-2 break-all hover:text-accent-teal"
            >
              {s.url}
            </a>
          </li>
        ))}
      </ul>
    </section>
  );
}
