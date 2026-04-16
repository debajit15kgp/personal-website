import type { Algorithm } from '../schema';

export const a3c: Algorithm = {
  id: 'a3c',
  name: 'A2C / A3C (Advantage Actor-Critic)',
  shortName: 'A2C/A3C',
  year: 2016,
  parentId: 'reinforce-baseline',
  level: 3,
  branch: 'actor-critic',
  edgeLabel: '+ critic · bootstrap advantage',
  categories: {
    dataSource: 'online',
    policyMatch: 'on-policy',
    model: 'model-free',
    method: 'actor-critic',
  },
  tagline:
    'Replace the Monte-Carlo return with a bootstrapped n-step advantage — and regularize with policy entropy.',
  intuition:
    'REINFORCE waits for the end of an episode to compute G_t. A2C says: bootstrap early — after k steps, plug in V(s_{t+k}) as the tail. The weight becomes a true advantage A(s,a) learned by a critic network. A3C is just A2C running on many threads asynchronously to decorrelate samples (A2C = synchronous version). A small entropy bonus keeps the policy from collapsing early.',
  equation: {
    latex: String.raw`\begin{aligned}
\nabla_{\theta'} \log \pi(a_t|s_t;\theta')\; A(s_t, a_t;\theta, \theta_v) \;+\; \beta\,\nabla_{\theta'} H\!\bigl(\pi(\cdot|s_t;\theta')\bigr) \\[4pt]
\text{where}\quad A(s_t, a_t) \;=\; \sum_{i=0}^{k-1} \gamma^{i} r_{t+i} \;+\; \gamma^{k} V(s_{t+k};\theta_v) \;-\; V(s_t;\theta_v)
\end{aligned}`,
    display: true,
    citation: {
      source: 'Mnih et al., 2016 — Asynchronous Methods for Deep Reinforcement Learning',
      url: 'https://arxiv.org/abs/1602.01783',
      loc: 'Section 4 "Asynchronous advantage actor-critic", final paragraph; Algorithm S3',
      verifiedVia: [
        'https://ar5iv.labs.arxiv.org/html/1602.01783',
      ],
      quote:
        '∇_θ′log π(a_t|s_t;θ′)A(s_t,a_t;θ,θv) + β ∇_θ′ H(π(s_t;θ′)), with A = Σ γ^i r_{t+i} + γ^k V(s_{t+k};θ_v) − V(s_t;θ_v)',
    },
    terms: [
      {
        symbol: '\\theta, \\theta_v',
        meaning: 'Two parameter sets: θ for the actor (policy π), θ_v for the critic (value V). Often share a body network and split into two heads.',
      },
      {
        symbol: '\\theta\'',
        meaning: "Thread-local parameters on a worker; after updating locally, gradients are applied back to the shared θ asynchronously (that's the 'A' of A3C).",
      },
      {
        symbol: 'A(s_t, a_t)',
        meaning: 'Advantage: how much better action a_t was than average-from-s_t. Bootstrapped, not Monte-Carlo.',
      },
      {
        symbol: 'k',
        meaning: 'Bootstrap horizon — how many real rewards to use before plugging in V. Typically k = 5 or 20 (t_max in the paper).',
      },
      {
        symbol: 'V(s_{t+k}; \\theta_v)',
        meaning: 'Critic\'s guess at the value of the state k steps after s_t. Replaces "and then roll out to episode end" with "and then trust the critic".',
      },
      {
        symbol: '\\beta\\, H(\\pi(\\cdot | s_t))',
        meaning: 'Entropy bonus (β ≈ 0.01). Rewards the policy for staying uncertain, keeping exploration alive early in training.',
      },
    ],
  },
  diffFromParent: {
    summary:
      'Replace the Monte-Carlo advantage (G_t − b) with a bootstrapped n-step advantage, and add an entropy bonus.',
    changes: [
      {
        kind: 'replace',
        term: String.raw`\bigl(G_t - b(S_t)\bigr) \;\to\; A(s_t, a_t) = \sum_{i=0}^{k-1} \gamma^{i} r_{t+i} + \gamma^{k} V(s_{t+k}) - V(s_t)`,
        annotation:
          'Replaced: full-episode return minus baseline becomes a k-step bootstrapped advantage estimate from a learned critic V.',
      },
      {
        kind: 'add',
        term: String.raw`+\, \beta\, H(\pi(\cdot|s_t))`,
        annotation: 'Added: entropy bonus to maintain exploration and prevent premature collapse.',
      },
    ],
    rationale:
      'Bootstrapping reduces variance further (we stop waiting for episode end) at the cost of some bias from the imperfect V. The entropy term is a small regularizer — Mnih et al. report it "improved exploration by discouraging premature convergence to suboptimal deterministic policies".',
  },
  code: {
    language: 'python',
    description:
      'A tiny 4-state grid-walk MDP. A linear critic learns V, actor updates with 1-step TD advantage + entropy bonus. Watch the return climb.',
    source: `import numpy as np

np.random.seed(0)
# Linear chain: states 0,1,2,3. Action: +1 or -1. Goal: reach state 3 (reward +1).
S, A = 4, 2
theta = np.zeros((S, A))   # actor logits per state
V = np.zeros(S)            # critic
alpha_pi, alpha_v, beta, gamma = 0.2, 0.3, 0.01, 0.9

def policy(s):
    z = theta[s] - theta[s].max()
    e = np.exp(z); return e / e.sum()

returns = []
for ep in range(300):
    s, done, G = 0, False, 0.0
    for t in range(20):
        pi = policy(s)
        a = np.random.choice(A, p=pi)
        s_next = min(max(s + (1 if a == 1 else -1), 0), S - 1)
        r = 1.0 if s_next == S - 1 else 0.0
        done = (s_next == S - 1)
        # --- A2C update: advantage = r + γV(s') − V(s)  (1-step TD) ---
        adv = r + (0 if done else gamma * V[s_next]) - V[s]
        V[s] += alpha_v * adv
        grad_log_pi = -pi.copy(); grad_log_pi[a] += 1.0
        ent_grad = -pi * (np.log(pi + 1e-8) + 1)   # ∂H/∂logits
        theta[s] += alpha_pi * (adv * grad_log_pi + beta * ent_grad)
        G += (gamma ** t) * r
        s = s_next
        if done: break
    returns.append(G)
    if (ep + 1) % 50 == 0:
        print(f"ep {ep+1:3d}: avg return (last 50) = {np.mean(returns[-50:]):.3f}")
print("Final V:", np.round(V, 3))
`,
  },
  sources: [
    {
      source: 'Mnih et al., 2016 — A3C',
      url: 'https://arxiv.org/abs/1602.01783',
      loc: 'Section 4, Algorithm S3',
    },
    {
      source: 'Stable-Baselines3 — A2C docs',
      url: 'https://stable-baselines3.readthedocs.io/en/master/modules/a2c.html',
      loc: 'Reference implementation of the synchronous A2C variant',
    },
    {
      source: 'OpenAI Spinning Up — Vanilla Policy Gradient (advantage form)',
      url: 'https://spinningup.openai.com/en/latest/algorithms/vpg.html',
      loc: 'Canonical advantage-based gradient formulation',
    },
  ],
};
