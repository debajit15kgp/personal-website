import type { Algorithm } from '../schema';

export const sarsa: Algorithm = {
  id: 'sarsa',
  name: 'SARSA',
  shortName: 'SARSA',
  year: 1994,
  parentId: 'mdp',
  level: 1,
  branch: 'value',
  edgeLabel: 'sample instead of sum',
  categories: {
    dataSource: 'online',
    policyMatch: 'on-policy',
    model: 'model-free',
    method: 'value',
  },
  tagline:
    'Learn Q(s,a) from what you actually did next — on-policy temporal-difference control.',
  intuition:
    'SARSA is named for the transition it uses: (State, Action, Reward, next-State, next-Action). After acting, observe where you landed and what action you will take next, then update Q(s,a) toward r + γ · Q(s′, a′). Because the update uses the a′ you are going to actually take under your policy, SARSA is on-policy — it learns the value of the behavior policy itself.',
  equation: {
    latex: String.raw`Q(S_t, A_t) \;\leftarrow\; Q(S_t, A_t) \;+\; \alpha\, \bigl[\, R_{t+1} + \gamma\, Q(S_{t+1}, A_{t+1}) - Q(S_t, A_t)\, \bigr]`,
    display: true,
    citation: {
      source: 'Sutton & Barto, 2018',
      url: 'http://incompleteideas.net/book/the-book-2nd.html',
      loc: 'Ch. 6.4, Eq. 6.7 (SARSA: on-policy TD control)',
      quote: 'Q(S_t,A_t) ← Q(S_t,A_t) + α[R_{t+1} + γ Q(S_{t+1}, A_{t+1}) - Q(S_t, A_t)]',
    },
    terms: [
      {
        symbol: 'Q(S_t, A_t)',
        meaning: 'Current estimate of "how good is action A_t in state S_t". In tabular SARSA, a table with one number per (state, action) pair.',
      },
      {
        symbol: '\\alpha',
        meaning: 'Learning rate, 0 < α ≤ 1. Controls how much each new sample nudges the estimate. Try α = 0.1.',
      },
      {
        symbol: 'R_{t+1}',
        meaning: 'Reward observed right after taking A_t.',
      },
      {
        symbol: '\\gamma',
        meaning: 'Discount factor — how much next-step value matters compared to the current reward.',
      },
      {
        symbol: 'Q(S_{t+1}, A_{t+1})',
        meaning: '"Next Q" — the estimated value of whatever action you actually take next. This is what makes SARSA on-policy.',
      },
      {
        symbol: '[\\; R_{t+1} + \\gamma Q(S_{t+1}, A_{t+1}) - Q(S_t, A_t) \\; ]',
        meaning: 'The TD error δ_t — difference between the bootstrapped "better" estimate and the current one. Drives learning.',
      },
    ],
  },
  diffFromParent: {
    summary: 'From "expected value" (Bellman) to a sample-based, online, incremental estimate of Q.',
    changes: [
      {
        kind: 'replace',
        term: String.raw`\mathbb{E}[\,\cdot\,] \;\to\; \text{sample average via step-size } \alpha`,
        annotation:
          'Replaced: Bellman expectation with a sampled target. Instead of summing over all next-states (which requires the model), use the observed (r, s′, a′).',
      },
    ],
    rationale:
      'Bellman gives the exact identity Q^π satisfies but requires P(s′|s,a). SARSA avoids the model by replacing the expectation with one sampled transition — then averaging over many samples via the step-size α. Convergence is guaranteed as long as all (s,a) are visited infinitely often and α → 0.',
  },
  code: {
    language: 'python',
    description:
      'SARSA on the same 4-state linear chain from A2C. Learns Q(s,a) via 1-step on-policy updates with ε-greedy exploration.',
    source: `import numpy as np

np.random.seed(0)
S, A = 4, 2                          # 4 states, 2 actions (−1, +1)
Q = np.zeros((S, A))
alpha, gamma, eps = 0.2, 0.9, 0.1

def policy(s):
    if np.random.rand() < eps: return np.random.randint(A)
    return int(np.argmax(Q[s]))

for ep in range(300):
    s = 0
    a = policy(s)
    for t in range(20):
        s_next = min(max(s + (1 if a == 1 else -1), 0), S - 1)
        r = 1.0 if s_next == S - 1 else 0.0
        done = (s_next == S - 1)
        a_next = policy(s_next)
        # --- SARSA update: target uses Q(s', a') for the action we WILL take ---
        target = r + (0 if done else gamma * Q[s_next, a_next])
        Q[s, a] += alpha * (target - Q[s, a])
        s, a = s_next, a_next
        if done: break

print("Final Q(s, a):")
print(np.round(Q, 3))
print("\\nGreedy policy from Q:", [int(np.argmax(Q[s])) for s in range(S)])
print("(Action 1 = move right toward goal at state 3)")
`,
  },
  sources: [
    {
      source: 'Sutton & Barto, 2018',
      url: 'http://incompleteideas.net/book/the-book-2nd.html',
      loc: 'Ch. 6.4, Eq. 6.7',
    },
    {
      source: 'Rummery & Niranjan, 1994 — On-line Q-learning using connectionist systems',
      url: 'http://mi.eng.cam.ac.uk/reports/svr-ftp/auto-pdf/rummery_tr166.pdf',
      loc: 'The original SARSA paper',
    },
  ],
};
