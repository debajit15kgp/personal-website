import type { Algorithm } from '../schema';

export const reinforceBaseline: Algorithm = {
  id: 'reinforce-baseline',
  name: 'REINFORCE with Baseline',
  shortName: '+ baseline',
  year: 2000,
  parentId: 'reinforce',
  level: 2,
  branch: 'policy-gradient',
  edgeLabel: '− baseline b(s) (variance↓)',
  categories: {
    dataSource: 'online',
    policyMatch: 'on-policy',
    model: 'model-free',
    method: 'policy',
  },
  tagline: 'Subtract a state-dependent baseline to slash gradient variance.',
  intuition:
    'Vanilla REINFORCE has brutally high variance — every positive return reinforces actions, even mediocre ones. If you subtract a baseline b(S_t) that does not depend on the action, the gradient stays unbiased (the extra term integrates to zero) but variance drops. Usually b(S_t) is a learned value estimate V(S_t), so the update becomes "how much better than expected was this action?"',
  equation: {
    latex: String.raw`\theta \;\leftarrow\; \theta \;+\; \alpha\, \gamma^{t}\, \bigl(G_t \,-\, b(S_t)\bigr)\, \nabla_{\theta}\ln \pi_{\theta}(A_t \mid S_t)`,
    display: true,
    citation: {
      source: 'Sutton & Barto, 2018',
      url: 'http://incompleteideas.net/book/the-book-2nd.html',
      loc: 'Ch. 13.4, Eq. 13.11 (REINFORCE with baseline)',
      verifiedVia: [
        'https://lilianweng.github.io/posts/2018-04-08-policy-gradient/',
      ],
      quote: 'θ ← θ + α γ^t (G_t - b(s_t)) ∇_θ ln π_θ(A_t | S_t)',
    },
    terms: [
      {
        symbol: '\\theta,\\; \\alpha,\\; \\gamma^t',
        meaning: 'Same as REINFORCE: policy parameters, learning rate, step-discount.',
      },
      {
        symbol: 'G_t',
        meaning: 'Observed return from step t to end of episode.',
      },
      {
        symbol: 'b(S_t)',
        meaning: 'Baseline — any function of the state (but NOT the action). Usually an estimate of V(S_t), either an average return or a learned value net. Its job is variance reduction.',
      },
      {
        symbol: 'G_t - b(S_t)',
        meaning: 'Empirical advantage — how much better this trajectory was than the baseline predicts. The advantage-form gradient that every later algorithm will refine.',
      },
      {
        symbol: '\\nabla_{\\theta} \\ln \\pi_{\\theta}(A_t \\mid S_t)',
        meaning: 'Score function — gradient of log-probability of the taken action.',
      },
    ],
  },
  diffFromParent: {
    summary: 'Subtract a state-only baseline b(S_t) inside the weight.',
    changes: [
      {
        kind: 'add',
        term: String.raw`\,-\, b(S_t)`,
        annotation:
          'Added: baseline subtraction. Because b does not depend on the action A_t, its contribution to the gradient is zero in expectation — it is a pure variance reducer, not a bias.',
      },
    ],
    rationale:
      'Sutton & Barto show (Eq. 13.10–11) that E[b(S_t) ∇ ln π(A|S)] = 0, so the update remains unbiased. Choosing b(S_t) ≈ V(S_t) makes (G_t − b) the empirical advantage — the direct precursor to the "advantage" used in every actor-critic method.',
  },
  code: {
    language: 'python',
    description:
      'Same 3-armed bandit as vanilla REINFORCE, but with a running-mean baseline. Compare the final variance of theta across runs — lower is better.',
    source: `import numpy as np

np.random.seed(0)
true_means = np.array([0.2, 0.5, 0.9])
theta = np.zeros(3)
alpha = 0.1
baseline = 0.0
bl_lr = 0.05   # baseline learning rate

def softmax(x):
    e = np.exp(x - x.max())
    return e / e.sum()

for ep in range(1, 201):
    probs = softmax(theta)
    a = np.random.choice(3, p=probs)
    reward = true_means[a] + 0.1 * np.random.randn()
    advantage = reward - baseline
    grad_log_pi = -probs.copy()
    grad_log_pi[a] += 1.0
    theta += alpha * advantage * grad_log_pi     # (G_t − b) replaces G_t
    baseline += bl_lr * (reward - baseline)      # EMA baseline update
    if ep % 40 == 0:
        print(f"ep {ep:3d}: π = {np.round(softmax(theta), 3)}, b = {baseline:.3f}")
print("Final policy:", np.round(softmax(theta), 3))
`,
  },
  sources: [
    {
      source: 'Sutton & Barto, 2018',
      url: 'http://incompleteideas.net/book/the-book-2nd.html',
      loc: 'Ch. 13.4, Eq. 13.11',
    },
    {
      source: 'Greensmith, Bartlett & Baxter, 2004 — Variance Reduction Techniques for Gradient Estimates',
      url: 'https://www.jmlr.org/papers/v5/greensmith04a.html',
      loc: 'Theoretical analysis of baselines for variance reduction',
    },
  ],
};
