import type { Algorithm } from '../schema';

export const reinforce: Algorithm = {
  id: 'reinforce',
  name: 'REINFORCE',
  shortName: 'REINFORCE',
  year: 1992,
  parentId: 'mdp',
  level: 1,
  branch: 'policy-gradient',
  edgeLabel: 'skip values · optimize π',
  categories: {
    dataSource: 'online',
    policyMatch: 'on-policy',
    model: 'model-free',
    method: 'policy',
  },
  tagline: 'Monte-Carlo policy gradient: roll out, weight each log-prob by the return.',
  intuition:
    'Instead of learning values and deriving a policy, REINFORCE learns the policy directly. Play a whole episode, collect the return G_t, and nudge the log-probability of each action taken by α · G_t. Actions that led to high returns get reinforced; actions in bad trajectories get suppressed. That is the entire idea.',
  equation: {
    latex: String.raw`\theta \;\leftarrow\; \theta \;+\; \alpha\, \gamma^{t}\, G_t\, \nabla_{\theta}\ln \pi_{\theta}(A_t \mid S_t)`,
    display: true,
    citation: {
      source: 'Sutton & Barto, 2018 — RL: An Introduction (2nd ed.)',
      url: 'http://incompleteideas.net/book/the-book-2nd.html',
      loc: 'Ch. 13.3, Eq. 13.8 (REINFORCE update)',
      verifiedVia: [
        'https://lilianweng.github.io/posts/2018-04-08-policy-gradient/',
      ],
      quote: 'θ ← θ + α γ^t G_t ∇_θ ln π_θ(A_t | S_t)',
    },
    terms: [
      {
        symbol: '\\theta',
        meaning: 'Parameters of the policy (e.g., the weights of the neural net that picks actions). What we update.',
      },
      {
        symbol: '\\alpha',
        meaning: 'Learning rate.',
      },
      {
        symbol: '\\gamma^t',
        meaning: 'Discounting of later time-steps: earlier steps matter more. Often dropped in practice.',
      },
      {
        symbol: 'G_t',
        meaning: 'Return from time t onward — the actual discounted sum of rewards observed in this trajectory. Computed after the episode ends.',
      },
      {
        symbol: '\\nabla_{\\theta} \\ln \\pi_{\\theta}(A_t \\mid S_t)',
        meaning: '"Score function" — how you\'d wiggle θ to make the chosen action A_t more likely. A gradient w.r.t. the log-probability.',
      },
      {
        symbol: '\\pi_{\\theta}(A_t \\mid S_t)',
        meaning: 'Probability the current policy assigns to action A_t in state S_t. A softmax over action logits in discrete cases.',
      },
    ],
  },
  diffFromParent: {
    summary: 'Go from "learn the value" (Bellman) to "directly learn the policy".',
    changes: [
      {
        kind: 'replace',
        term: String.raw`\nabla_{\theta}\ln \pi_{\theta}(A_t \mid S_t) \cdot G_t`,
        annotation:
          'Instead of backing up values, we take the gradient of log-probability and scale it by the observed return. No Bellman backup — just Monte Carlo.',
      },
    ],
    rationale:
      'The policy gradient theorem (Sutton et al., 2000) shows ∇J(θ) = E[G_t ∇ln π(A|S)]. This lets us skip value functions entirely when the policy is what we care about — e.g. when actions are continuous and argmax over Q is intractable.',
  },
  code: {
    language: 'python',
    description:
      'REINFORCE on a 3-armed bandit with a softmax policy. Watch the probability of the best arm rise across episodes.',
    source: `import numpy as np

np.random.seed(0)
true_means = np.array([0.2, 0.5, 0.9])     # arm 2 is best
theta = np.zeros(3)                         # softmax logits
alpha = 0.1

def softmax(x):
    e = np.exp(x - x.max())
    return e / e.sum()

for ep in range(1, 201):
    probs = softmax(theta)
    a = np.random.choice(3, p=probs)        # sample action
    reward = true_means[a] + 0.1 * np.random.randn()
    # REINFORCE: ∇ ln π(a) = e_a - π    (softmax gradient)
    grad_log_pi = -probs.copy()
    grad_log_pi[a] += 1.0
    theta += alpha * reward * grad_log_pi   # G_t = reward here (bandit, 1-step)
    if ep % 40 == 0:
        print(f"ep {ep:3d}: π = {np.round(softmax(theta), 3)}")
print("Final policy:", np.round(softmax(theta), 3))
print("Expected: high prob on arm 2 (true mean 0.9)")
`,
  },
  sources: [
    {
      source: 'Williams, 1992 — Simple Statistical Gradient-Following Algorithms',
      url: 'https://link.springer.com/article/10.1007/BF00992696',
      loc: 'The original REINFORCE paper',
    },
    {
      source: 'Sutton & Barto, 2018',
      url: 'http://incompleteideas.net/book/the-book-2nd.html',
      loc: 'Ch. 13.3, Eq. 13.8',
    },
    {
      source: 'OpenAI Spinning Up — Vanilla Policy Gradient',
      url: 'https://spinningup.openai.com/en/latest/algorithms/vpg.html',
      loc: 'Canonical implementation reference',
    },
  ],
};
