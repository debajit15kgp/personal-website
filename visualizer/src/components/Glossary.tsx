import type { Algorithm } from '../data';
import Equation from './Equation';

export default function Glossary({ algorithm }: { algorithm: Algorithm }) {
  const terms = algorithm.equation.terms;
  if (!terms || terms.length === 0) return null;

  return (
    <div className="rounded-lg border border-ink-600 bg-ink-800 p-5">
      <h4 className="text-xs uppercase tracking-widest text-ink-300 font-mono mb-4">
        What every symbol means
      </h4>
      <dl className="space-y-3">
        {terms.map((t, i) => (
          <div
            key={i}
            className="grid grid-cols-[minmax(70px,auto)_1fr] gap-4 items-start pb-3 border-b border-ink-700 last:border-b-0 last:pb-0"
          >
            <dt className="flex items-start pt-0.5">
              <span className="inline-block px-2 py-1 rounded bg-ink-900 border border-ink-600">
                <Equation tex={t.symbol} displayMode={false} />
              </span>
            </dt>
            <dd className="text-sm text-ink-100 leading-relaxed">
              {t.meaning}
              {t.notes && <span className="block text-xs text-ink-300 mt-1">{t.notes}</span>}
            </dd>
          </div>
        ))}
      </dl>
    </div>
  );
}
