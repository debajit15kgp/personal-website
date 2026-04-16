import type { Algorithm } from '../schema';

export const ppo: Algorithm = {
  id: 'ppo',
  name: 'PPO (Proximal Policy Optimization)',
  shortName: 'PPO',
  year: 2017,
  parentId: 'trpo',
  level: 5,
  branch: 'trust-region',
  edgeLabel: 'clip instead of KL',
  categories: {
    dataSource: 'online',
    policyMatch: 'on-policy',
    model: 'model-free',
    method: 'actor-critic',
  },
  tagline:
    'Drop the hard KL constraint; clip the importance ratio to [1−ε, 1+ε] instead. Same effect, a first-order update.',
  intuition:
    'TRPO is effective but painful — you need Fisher-vector products, conjugate gradient, and a line search. Schulman et al. noticed you can get nearly the same benefit with a tiny trick: take the min between the raw importance-sampled objective and a clipped version that refuses to reward moving the ratio outside [1−ε, 1+ε]. If an update would push the policy too far in a favorable direction, the clip "erases" the incentive. Plain SGD works. This is the workhorse of modern RL (including RLHF).',
  equation: {
    latex: String.raw`L^{\text{CLIP}}(\theta) \;=\; \hat{\mathbb{E}}_t\!\left[ \min\!\Bigl( r_t(\theta)\, \hat{A}_t,\; \operatorname{clip}\!\bigl(r_t(\theta),\, 1-\varepsilon,\, 1+\varepsilon\bigr)\, \hat{A}_t \Bigr) \right], \qquad r_t(\theta) \;=\; \frac{\pi_{\theta}(a_t\mid s_t)}{\pi_{\theta_{\text{old}}}(a_t\mid s_t)}`,
    display: true,
    citation: {
      source: 'Schulman et al., 2017 — Proximal Policy Optimization Algorithms',
      url: 'https://arxiv.org/abs/1707.06347',
      loc: 'Eq. 7 (L^CLIP); Eq. 6 (probability ratio r_t); Eq. 9 (combined L^CLIP+VF+S)',
      verifiedVia: [
        'https://spinningup.openai.com/en/latest/algorithms/ppo.html',
      ],
      quote:
        'L^CLIP(θ) = Ê_t[ min( r_t(θ)Â_t, clip(r_t(θ), 1-ε, 1+ε)Â_t ) ]',
    },
    terms: [
      {
        symbol: 'L^{\\text{CLIP}}(\\theta)',
        meaning: 'The PPO-clipped surrogate objective. We maximize this via SGD — so higher is better.',
      },
      {
        symbol: '\\hat{\\mathbb{E}}_t[\\cdot]',
        meaning: 'Empirical average over a minibatch of collected timesteps. (Real expectation is replaced by sample mean.)',
      },
      {
        symbol: 'r_t(\\theta)',
        meaning: 'Probability ratio: how much more (or less) likely is action a_t under the new policy vs. the old one. Equal to 1 at the start of each update.',
      },
      {
        symbol: '\\hat{A}_t',
        meaning: 'Estimated advantage at step t. Positive → this action was better than average; negative → worse.',
      },
      {
        symbol: '\\varepsilon',
        meaning: 'Clip parameter — typical value 0.2. Controls how far the ratio can drift before the clip kicks in.',
      },
      {
        symbol: '\\operatorname{clip}(r, 1-\\varepsilon, 1+\\varepsilon)',
        meaning: 'Standard clip: returns r if it\'s inside [1-ε, 1+ε], otherwise returns the boundary. Gradient is zero outside the range.',
      },
      {
        symbol: '\\min(\\cdot, \\cdot)',
        meaning: 'Take the smaller of the two terms. Acts as a pessimistic lower bound — if moving the ratio would give too much reward, cap it.',
      },
    ],
  },
  diffFromParent: {
    summary: 'Remove the KL constraint. Replace it with a clip on the ratio inside a min(·).',
    changes: [
      {
        kind: 'remove',
        term: String.raw`\text{s.t.}\;\bar{D}_{\mathrm{KL}} \le \delta`,
        annotation:
          'Removed: TRPO\'s hard KL trust-region constraint. No more conjugate gradient, no more line search.',
      },
      {
        kind: 'add',
        term: String.raw`\min\!\bigl(r_t \hat{A}_t,\; \operatorname{clip}(r_t, 1\pm\varepsilon)\, \hat{A}_t\bigr)`,
        annotation:
          'Added: the clipped-ratio min. When Â_t > 0 and r_t > 1+ε, or Â_t < 0 and r_t < 1−ε, the objective\'s gradient is zero — the clip silently stops further drift.',
      },
    ],
    rationale:
      'The clip is a pessimistic lower bound on the unclipped surrogate. It allows the ratio to move freely in the "safe" direction but refuses to grant extra reward once r drifts too far — a soft, gradient-compatible trust region. Empirically matches TRPO at a fraction of the implementation complexity (PPO paper, Fig. 3).',
  },
  code: {
    language: 'python',
    description:
      'Visualize exactly what the clip does: sweep the importance ratio r, plot the unclipped vs clipped PPO objective for Â = +1 and Â = −1.',
    source: `import numpy as np

epsilon = 0.2
r = np.linspace(0.0, 2.0, 21)

def ppo_clip_obj(r, A, eps=epsilon):
    # Eq. 7 from Schulman et al. 2017:  min( r·A, clip(r, 1−ε, 1+ε)·A )
    # The min is a *pessimistic lower bound* and is correct for both A>0 and A<0.
    unclipped = r * A
    clipped   = np.clip(r, 1 - eps, 1 + eps) * A
    return np.minimum(unclipped, clipped)

print("--- Â = +1  (we want r to increase up to 1+ε, then gain is capped) ---")
print(f"{'r':>5} {'unclipped':>10} {'PPO L':>8}")
for ri in r:
    u = ri * 1.0
    L = ppo_clip_obj(ri, +1.0)
    print(f"{ri:5.2f} {u:10.3f} {L:8.3f}")

print("\\n--- Â = -1  (we want r to decrease down to 1-ε, then loss is capped) ---")
for ri in r[::4]:
    u = ri * -1.0
    L = ppo_clip_obj(ri, -1.0)
    print(f"{ri:5.2f} {u:10.3f} {L:8.3f}")
`,
    colabUrl: 'https://colab.research.google.com/github/huggingface/trl/blob/main/examples/notebooks/gpt2-sentiment.ipynb',
  },
  sources: [
    {
      source: 'Schulman et al., 2017 — PPO',
      url: 'https://arxiv.org/abs/1707.06347',
      loc: 'Eq. 6, 7, 9',
    },
    {
      source: 'OpenAI Spinning Up — PPO',
      url: 'https://spinningup.openai.com/en/latest/algorithms/ppo.html',
      loc: 'Canonical clipped-surrogate formulation',
    },
    {
      source: 'Engstrom et al., 2020 — Implementation Matters in Deep Policy Gradients',
      url: 'https://arxiv.org/abs/2005.12729',
      loc: 'Documents which implementation details actually drive PPO\'s performance',
    },
  ],
};
