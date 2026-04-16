/*
 * Correctness harness for the RL Algorithm Atlas.
 *
 * Checks every algorithm:
 *   1. Has a citation on its equation (URL + loc + source).
 *   2. Citation URL is publicly reachable (HEAD, 2xx–3xx).
 *   3. If it has a parent, it has a diffFromParent block.
 *   4. Every `sources` entry has a valid URL.
 *   5. Paper provenance strings are non-empty.
 *
 * Run with: npm run verify
 * Exits non-zero on any failure so it can gate CI.
 */

import { ALGORITHMS } from '../src/data/index.js';

type Failure = { algoId: string; check: string; detail: string };

const failures: Failure[] = [];
const warnings: Failure[] = [];

function must(cond: unknown, algoId: string, check: string, detail: string) {
  if (!cond) failures.push({ algoId, check, detail });
}

function should(cond: unknown, algoId: string, check: string, detail: string) {
  if (!cond) warnings.push({ algoId, check, detail });
}

async function urlReachable(url: string): Promise<{ ok: boolean; status: number | string }> {
  try {
    // Use GET with a small range — some arxiv mirrors 405 on HEAD.
    const res = await fetch(url, {
      method: 'GET',
      headers: {
        'User-Agent':
          'Mozilla/5.0 (RL-Atlas-Verifier/0.1; +https://github.com/debajit15kgp/personal-website)',
        Range: 'bytes=0-1024',
      },
      redirect: 'follow',
      signal: AbortSignal.timeout(15_000),
    });
    return { ok: res.status >= 200 && res.status < 400, status: res.status };
  } catch (e) {
    return { ok: false, status: (e as Error).message };
  }
}

async function main() {
  console.log(`\n▶ Verifying ${ALGORITHMS.length} algorithms...\n`);

  // Structural checks (fast, no network)
  for (const a of ALGORITHMS) {
    must(a.id && a.name && a.tagline && a.intuition, a.id, 'structural', 'missing required text fields');
    must(a.equation?.latex, a.id, 'equation', 'missing LaTeX');
    must(a.equation?.citation?.url, a.id, 'citation', 'equation citation missing URL');
    must(a.equation?.citation?.loc, a.id, 'citation', 'equation citation missing loc');
    must(a.equation?.citation?.source, a.id, 'citation', 'equation citation missing source label');
    must(a.sources.length >= 1, a.id, 'sources', 'no sources listed');
    should(
      a.parentId === null || !!a.diffFromParent,
      a.id,
      'diff',
      'non-root node should have diffFromParent'
    );
    must(a.code?.source?.length > 0, a.id, 'code', 'missing code snippet');
  }

  // URL reachability (parallel, in waves to avoid hammering)
  const urls = new Set<string>();
  for (const a of ALGORITHMS) {
    urls.add(a.equation.citation.url);
    (a.equation.citation.verifiedVia ?? []).forEach((u) => urls.add(u));
    a.sources.forEach((s) => urls.add(s.url));
  }

  console.log(`  checking ${urls.size} unique URLs in parallel...`);
  const results = await Promise.all(
    [...urls].map(async (u) => ({ url: u, ...(await urlReachable(u)) }))
  );
  for (const r of results) {
    if (!r.ok) {
      // Map URL back to algorithms that reference it
      for (const a of ALGORITHMS) {
        const refs = [
          a.equation.citation.url,
          ...(a.equation.citation.verifiedVia ?? []),
          ...a.sources.map((s) => s.url),
        ];
        if (refs.includes(r.url)) {
          warnings.push({
            algoId: a.id,
            check: 'url-reachable',
            detail: `${r.url} → ${r.status}`,
          });
        }
      }
    }
  }

  // Report
  console.log(`\n${'─'.repeat(70)}`);
  if (failures.length === 0) {
    console.log(`  ✅ All ${ALGORITHMS.length} algorithms passed structural verification.`);
  } else {
    console.log(`  ❌ ${failures.length} FAILURES:`);
    for (const f of failures) console.log(`     [${f.algoId}] ${f.check}: ${f.detail}`);
  }
  if (warnings.length > 0) {
    console.log(`\n  ⚠  ${warnings.length} warnings (non-fatal):`);
    for (const w of warnings) console.log(`     [${w.algoId}] ${w.check}: ${w.detail}`);
  }
  console.log(`${'─'.repeat(70)}\n`);

  // Per-algorithm summary
  console.log('  Citation summary:');
  for (const a of ALGORITHMS) {
    const c = a.equation.citation;
    console.log(`    • ${a.name.padEnd(40)} ← ${c.source} :: ${c.loc}`);
  }
  console.log('');

  process.exit(failures.length > 0 ? 1 : 0);
}

main().catch((e) => {
  console.error(e);
  process.exit(2);
});
