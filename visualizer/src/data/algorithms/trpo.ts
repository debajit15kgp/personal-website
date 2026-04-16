import type { Algorithm } from '../schema';

export const trpo: Algorithm = {
  id: 'trpo',
  name: 'TRPO (Trust Region Policy Optimization)',
  shortName: 'TRPO',
  year: 2015,
  parentId: 'a3c',
  level: 4,
  branch: 'trust-region',
  edgeLabel: '+ ratio · + KL ≤ δ',
  categories: {
    dataSource: 'online',
    policyMatch: 'on-policy',
    model: 'model-free',
    method: 'actor-critic',
  },
  tagline:
    'Reuse old rollouts via importance sampling — but hard-constrain the KL to prevent policy collapse.',
  intuition:
    'Actor-critic is on-policy: throw away samples after one update. TRPO instead lets you do several gradient steps on the same batch by importance-weighting π_new / π_old, but bounds how far the policy can move each iteration (KL ≤ δ). The bound is solved exactly by a constrained natural-gradient step with conjugate gradient + line search. Safer steps, better sample efficiency, but ugly to implement.',
  equation: {
    latex: String.raw`\begin{aligned}
&\max_{\theta}\; \mathbb{E}_{s, a \sim \pi_{\theta_{\text{old}}}}\!\left[\frac{\pi_{\theta}(a\mid s)}{\pi_{\theta_{\text{old}}}(a\mid s)}\, \hat{A}^{\pi_{\theta_{\text{old}}}}(s, a)\right] \\[6pt]
&\text{s.t.}\; \mathbb{E}_{s \sim \rho_{\theta_{\text{old}}}}\!\left[D_{\mathrm{KL}}\!\bigl(\pi_{\theta_{\text{old}}}(\cdot\mid s)\,\|\,\pi_{\theta}(\cdot\mid s)\bigr)\right] \le \delta
\end{aligned}`,
    display: true,
    citation: {
      source: 'Schulman et al., 2015 — Trust Region Policy Optimization',
      url: 'https://arxiv.org/abs/1502.05477',
      loc: 'Eq. 12 (KL-constrained problem), Eq. 14 (sampled form)',
      verifiedVia: [
        'https://ar5iv.labs.arxiv.org/html/1502.05477',
        'https://spinningup.openai.com/en/latest/algorithms/trpo.html',
      ],
      quote:
        'maximize E[π_θ(a|s)/π_{θ_old}(a|s) · Q_{θ_old}(s,a)]  subject to  E[D_KL(π_{θ_old}‖π_θ)] ≤ δ',
    },
    terms: [
      {
        symbol: '\\theta_{\\text{old}}',
        meaning: 'Policy parameters before this update. Data was collected under π_{θ_old}; we reuse it for several updates.',
      },
      {
        symbol: '\\theta',
        meaning: 'The "candidate" updated parameters we are searching for.',
      },
      {
        symbol: '\\dfrac{\\pi_{\\theta}(a|s)}{\\pi_{\\theta_{\\text{old}}}(a|s)}',
        meaning: 'Importance ratio — corrects for the fact that we want expectations under π_θ but have samples from π_{θ_old}.',
      },
      {
        symbol: '\\hat{A}(s, a)',
        meaning: 'Estimated advantage at this (s, a) — same advantage from A2C, typically computed via Generalized Advantage Estimation (GAE).',
      },
      {
        symbol: 'D_{\\mathrm{KL}}(\\pi_{\\text{old}} \\| \\pi_{\\theta})',
        meaning: 'KL divergence — a measure of "distance" between the old and new policies. Zero when identical, grows when they disagree on action probabilities.',
      },
      {
        symbol: '\\delta',
        meaning: 'Trust-region radius (typical value 0.01). Caps how far policy can move in one update. Too small = slow; too large = collapse.',
      },
    ],
  },
  diffFromParent: {
    summary:
      'Move from on-policy stochastic gradient to an importance-sampled surrogate with a hard KL trust region.',
    changes: [
      {
        kind: 'add',
        term: String.raw`\dfrac{\pi_{\theta}(a\mid s)}{\pi_{\theta_{\text{old}}}(a\mid s)}`,
        annotation:
          'Added: importance sampling ratio. Lets us reuse samples drawn under θ_old for multiple gradient updates.',
      },
      {
        kind: 'add',
        term: String.raw`\text{s.t.}\; \bar{D}_{\mathrm{KL}}(\theta_{\text{old}}\,\|\,\theta) \le \delta`,
        annotation:
          'Added: KL trust-region constraint. Without it, the importance-sampled objective can blow up when π_new drifts far from π_old.',
      },
    ],
    rationale:
      'The policy-gradient update from A2C is only valid for tiny step sizes (local linearization). Schulman et al. prove that keeping the mean KL ≤ δ guarantees monotonic policy improvement (Theorem 1). The natural-gradient + line-search machinery is entirely in service of respecting that constraint exactly.',
  },
  code: {
    language: 'python',
    description:
      'Illustrates the TRPO surrogate and KL constraint on a 2-action toy problem. Not a full CG solver — just shows how the ratio and KL behave as θ moves.',
    source: `import numpy as np

np.random.seed(0)
# Toy: 1 state, 2 actions. advantages for actions [a0, a1]
A_hat = np.array([-1.0, +1.0])
theta_old = np.array([0.0, 0.0])   # logits

def pi(theta):
    z = theta - theta.max(); e = np.exp(z); return e / e.sum()

def kl(p, q):
    return float(np.sum(p * (np.log(p + 1e-12) - np.log(q + 1e-12))))

def surrogate(theta, theta_old, A_hat):
    p_new, p_old = pi(theta), pi(theta_old)
    ratio = p_new / p_old
    return float(np.sum(p_old * ratio * A_hat))   # E_{a~π_old}[ratio·A]

delta = 0.01  # KL trust region radius

# Sweep candidate step directions; only steps inside KL ≤ δ are admissible.
print(f"{'step':>6} {'surrogate':>10} {'KL':>8} {'admissible'}")
for step in np.linspace(0.0, 0.6, 7):
    theta = theta_old + step * np.array([-1.0, +1.0])  # nudge toward good action
    kl_val = kl(pi(theta_old), pi(theta))
    ok = kl_val <= delta
    print(f"{step:6.2f} {surrogate(theta, theta_old, A_hat):10.4f} {kl_val:8.4f} {'YES' if ok else 'no'}")
print("\\nTRPO would pick the largest admissible step that maximizes the surrogate.")
`,
  },
  sources: [
    {
      source: 'Schulman et al., 2015 — TRPO',
      url: 'https://arxiv.org/abs/1502.05477',
      loc: 'Eq. 12 & 14',
    },
    {
      source: 'OpenAI Spinning Up — TRPO',
      url: 'https://spinningup.openai.com/en/latest/algorithms/trpo.html',
      loc: 'Pseudocode and derivation',
    },
  ],
};
