// ---------------------------------------------------------------------------
// Schema for algorithm nodes. Every equation MUST cite a source; the verifier
// script (scripts/verify.ts) will fail the build if any node is missing a
// citation or has an unreachable URL.
// ---------------------------------------------------------------------------

export type Branch =
  | 'foundation'
  | 'value'
  | 'policy-gradient'
  | 'actor-critic'
  | 'trust-region'
  | 'continuous'
  | 'model-based'
  | 'offline';

/**
 * The four big RL bifurcations. Every algorithm sits at a specific point along
 * each axis — these tags are what let beginners orient themselves.
 */
export interface Categories {
  /** Does the algorithm interact with the env, or learn from a fixed dataset? */
  dataSource: 'online' | 'offline';
  /** Is the behavior policy = the policy being improved? */
  policyMatch: 'on-policy' | 'off-policy' | 'n/a';
  /** Does it learn a transition model P(s'|s,a) and/or reward model? */
  model: 'model-free' | 'model-based';
  /** What's parameterized and learned? */
  method: 'value' | 'policy' | 'actor-critic' | 'foundation';
}

export interface Citation {
  /** Canonical human-readable label e.g. "Schulman et al., 2017". */
  source: string;
  /** Direct URL — verifier hits this. Must be publicly reachable. */
  url: string;
  /** Specific location inside the source, e.g. "Eq. 7, Section 3". */
  loc: string;
  /** Optional secondary verifier — e.g. the OpenAI Spinning Up URL. */
  verifiedVia?: string[];
  /** Optional verbatim quote for the provenance panel. */
  quote?: string;
}

export type EquationDiff = {
  kind: 'add' | 'remove' | 'replace';
  /** LaTeX fragment of the term being changed. */
  term: string;
  /** One-line explanation of *why* this term changed. */
  annotation: string;
};

export interface Algorithm {
  id: string;
  name: string;
  shortName?: string;
  year: number;
  parentId: string | null;
  /** Depth in the tree, 0 = root. Purely for layout. */
  level: number;
  branch: Branch;
  /** The four-axis positioning used on the Overview panel. */
  categories: Categories;

  /** One-liner used in the tree node. */
  tagline: string;
  /** Plain-English paragraph aimed at an undergrad. 2–3 sentences. */
  intuition: string;

  equation: {
    latex: string;
    /** Whether to render as display (centered, larger) or inline. */
    display: boolean;
    citation: Citation;
    /** Symbol-by-symbol glossary. Rendered as a side panel next to the equation. */
    terms: Array<{
      /** LaTeX for the symbol itself, e.g. `\theta` or `\hat{A}_t` */
      symbol: string;
      /** Plain-English meaning in one line. Target audience: first-time reader. */
      meaning: string;
      /** Optional longer note — numerical range, how it's computed, gotchas. */
      notes?: string;
    }>;
  };

  /** The pedagogical core — how this algorithm differs from its parent. */
  diffFromParent?: {
    summary: string;
    changes: EquationDiff[];
    rationale: string;
  };

  /**
   * Short edge label shown on the tree (2–5 words). Captures the core diff
   * in a way a first-time reader can grok without clicking through. Think
   * "+ clip instead of KL" or "− critic, + group mean".
   */
  edgeLabel?: string;

  code: {
    language: 'python';
    source: string;
    description: string;
    colabUrl?: string;
  };

  /** Primary + secondary sources. `equation.citation` is already in here. */
  sources: Citation[];
}
