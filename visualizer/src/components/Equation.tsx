import { useEffect, useRef } from 'react';
import katex from 'katex';

interface Props {
  tex: string;
  displayMode?: boolean;
  className?: string;
}

export default function Equation({ tex, displayMode = true, className = '' }: Props) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!ref.current) return;
    try {
      katex.render(tex, ref.current, {
        displayMode,
        throwOnError: false,
        output: 'html',
        trust: false,
        strict: 'warn',
        macros: {
          '\\RR': '\\mathbb{R}',
          '\\E': '\\mathbb{E}',
          '\\KL': 'D_{\\mathrm{KL}}',
        },
      });
    } catch (err) {
      ref.current.textContent = tex;
    }
  }, [tex, displayMode]);

  return <div ref={ref} className={className} />;
}
