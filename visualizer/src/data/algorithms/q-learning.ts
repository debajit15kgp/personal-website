import type { Algorithm } from '../schema';

export const qLearning: Algorithm = {
  id: 'q-learning',
  name: 'Q-Learning',
  shortName: 'Q-Learning',
  year: 1989,
  parentId: 'sarsa',
  level: 2,
  branch: 'value',
  edgeLabel: 'max instead of next-action',
  categories: {
    dataSource: 'online',
    policyMatch: 'off-policy',
    model: 'model-free',
    method: 'value',
  },
  tagline:
    'One character change to SARSA — use max over next actions — and you are off-policy, learning the optimal Q*.',
  intuition:
    'SARSA learns the value of *your* policy. Q-Learning cheats: its target uses max_{a′} Q(s′, a′) — the value of the *greedy* policy over Q — regardless of what action you actually take next. That single substitution makes it off-policy: you can explore with ε-greedy (or any soft policy) while still converging to the optimal action-value function Q*. This is the single most important RL algorithm ever — DQN, Rainbow, and most value-based deep RL descend from it.',
  equation: {
    latex: String.raw`Q(S_t, A_t) \;\leftarrow\; Q(S_t, A_t) \;+\; \alpha\, \Bigl[\, R_{t+1} + \gamma\, \max_{a'} Q(S_{t+1}, a') \;-\; Q(S_t, A_t)\, \Bigr]`,
    display: true,
    citation: {
      source: 'Watkins & Dayan, 1992 — Q-learning',
      url: 'https://link.springer.com/article/10.1007/BF00992698',
      loc: 'The original Q-Learning paper',
      verifiedVia: [
        'http://incompleteideas.net/book/the-book-2nd.html',
      ],
      quote: 'Q(S_t,A_t) ← Q(S_t,A_t) + α[R_{t+1} + γ max_{a′} Q(S_{t+1}, a′) - Q(S_t, A_t)]',
    },
    terms: [
      {
        symbol: 'Q(S_t, A_t)',
        meaning: 'Current Q-value estimate for the (state, action) we just executed.',
      },
      {
        symbol: '\\alpha',
        meaning: 'Learning rate, typically 0.1.',
      },
      {
        symbol: 'R_{t+1}',
        meaning: 'Immediate reward after the action.',
      },
      {
        symbol: '\\gamma',
        meaning: 'Discount factor.',
      },
      {
        symbol: '\\max_{a\'} Q(S_{t+1}, a\')',
        meaning: 'The best Q-value achievable in the next state. This "best" is what makes Q-Learning off-policy — it bootstraps toward the greedy policy, independent of which action we actually take next.',
      },
      {
        symbol: 'a\'',
        meaning: 'A candidate next action (variable being maxed over), not necessarily the one that will be executed.',
      },
    ],
  },
  diffFromParent: {
    summary:
      'Replace Q(S_{t+1}, A_{t+1}) with max_{a′} Q(S_{t+1}, a′). On-policy → off-policy.',
    changes: [
      {
        kind: 'replace',
        term: String.raw`Q(S_{t+1}, A_{t+1}) \;\to\; \max_{a'} Q(S_{t+1}, a')`,
        annotation:
          'Replaced: the next-action Q-value used in the target. SARSA uses the action the behavior policy will actually take; Q-Learning uses the greedy action according to current Q, independent of what is executed.',
      },
    ],
    rationale:
      'By bootstrapping toward the greedy Q-value, Q-Learning targets the Bellman *optimality* equation — so it converges to Q* regardless of the behavior policy (as long as every (s,a) is visited). This is why you can train with ε-greedy (or totally random) and still recover the optimal policy. The price: near cliff-like rewards, Q-Learning can take bigger risks than SARSA because its target is fearless — see Sutton & Barto Example 6.6, "Cliff Walking".',
  },
  code: {
    language: 'python',
    description:
      'Q-Learning on the same 4-state chain. Flip the target from SARSA\'s Q(s′, a′) to max_a′ Q(s′, a′) — everything else is identical.',
    source: `import numpy as np

np.random.seed(0)
S, A = 4, 2
Q = np.zeros((S, A))
alpha, gamma, eps = 0.2, 0.9, 0.1

def policy(s):
    if np.random.rand() < eps: return np.random.randint(A)
    return int(np.argmax(Q[s]))

for ep in range(300):
    s = 0
    for t in range(20):
        a = policy(s)
        s_next = min(max(s + (1 if a == 1 else -1), 0), S - 1)
        r = 1.0 if s_next == S - 1 else 0.0
        done = (s_next == S - 1)
        # --- Q-Learning update: target uses max over next actions, NOT A_{t+1} ---
        target = r + (0 if done else gamma * np.max(Q[s_next]))
        Q[s, a] += alpha * (target - Q[s, a])
        s = s_next
        if done: break

print("Final Q(s, a):")
print(np.round(Q, 3))
print("\\nGreedy policy from Q:", [int(np.argmax(Q[s])) for s in range(S)])
print("Values should be higher than SARSA because Q-Learning is fearless about exploration.")
`,
  },
  sources: [
    {
      source: 'Watkins & Dayan, 1992',
      url: 'https://link.springer.com/article/10.1007/BF00992698',
      loc: 'Original Q-Learning paper (convergence proof)',
    },
    {
      source: 'Sutton & Barto, 2018',
      url: 'http://incompleteideas.net/book/the-book-2nd.html',
      loc: 'Ch. 6.5, Eq. 6.8 + cliff-walking comparison to SARSA',
    },
    {
      source: 'Mnih et al., 2015 — Human-level control through deep RL (DQN)',
      url: 'https://www.nature.com/articles/nature14236',
      loc: 'The deep extension of Q-Learning; Phase 2 of this atlas',
    },
  ],
};
