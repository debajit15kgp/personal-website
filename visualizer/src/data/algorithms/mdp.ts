import type { Algorithm } from '../schema';

export const mdp: Algorithm = {
  id: 'mdp',
  name: 'MDP & Bellman Equation',
  shortName: 'Bellman',
  year: 1957,
  parentId: null,
  level: 0,
  branch: 'foundation',
  categories: {
    dataSource: 'online',
    policyMatch: 'n/a',
    model: 'model-based',
    method: 'foundation',
  },
  tagline: 'The recursive identity every RL algorithm is trying to solve.',
  intuition:
    'A Markov Decision Process is a world where the next state depends only on the current state and chosen action. The value of a state is the expected total reward from acting under a policy — Bellman noticed it satisfies a recursive identity: value of now = immediate reward + discounted value of next. Every algorithm below is a different strategy for learning or approximating this.',
  equation: {
    latex: String.raw`\begin{aligned}
V^{\pi}(s) &= \mathbb{E}_{\pi}\!\left[R_{t+1} + \gamma V^{\pi}(S_{t+1}) \,\middle|\, S_t = s\right] \\[4pt]
Q^{\pi}(s,a) &= \mathbb{E}_{\pi}\!\left[R_{t+1} + \gamma\, Q^{\pi}(S_{t+1}, A_{t+1}) \,\middle|\, S_t=s, A_t=a\right]
\end{aligned}`,
    display: true,
    citation: {
      source: 'Sutton & Barto, 2018 — Reinforcement Learning: An Introduction (2nd ed.), Ch. 3',
      url: 'http://incompleteideas.net/book/the-book-2nd.html',
      loc: 'Ch. 3 "Finite Markov Decision Processes", Eq. 3.14 (state-value Bellman) and Eq. 3.17 (action-value Bellman)',
      verifiedVia: [
        'https://en.wikipedia.org/wiki/Bellman_equation',
      ],
    },
    terms: [
      {
        symbol: 'V^{\\pi}(s)',
        meaning: 'Value of state s under policy π — the expected total future reward if you start in s and act according to π forever.',
      },
      {
        symbol: 'Q^{\\pi}(s, a)',
        meaning: 'Value of taking action a in state s and then following π — lets you compare actions before committing.',
      },
      {
        symbol: 'R_{t+1}',
        meaning: 'Reward you get right after taking the action at time t.',
      },
      {
        symbol: '\\gamma',
        meaning: 'Discount factor, 0 ≤ γ < 1. How much you care about future reward vs now. γ = 0.99 is typical.',
      },
      {
        symbol: 'S_{t+1}',
        meaning: 'The state you land in after acting. Drawn from the env\'s transition distribution.',
      },
      {
        symbol: '\\mathbb{E}_{\\pi}[\\cdot]',
        meaning: 'Expectation over randomness from π (which action you pick) and the environment (where you land).',
      },
    ],
  },
  code: {
    language: 'python',
    description:
      'Solve a tiny 2-state MDP by Bellman backup (value iteration). You should see V converge to the fixed point in a few sweeps.',
    source: `import numpy as np

# 2-state MDP:  s0 --a0 (+0)--> s1 --a0 (+1)--> s0 (terminal reward pattern)
# Transition probs P[s, a, s'] and rewards R[s, a]
P = np.array([[[0, 1]], [[1, 0]]], dtype=float)   # shape (S=2, A=1, S'=2)
R = np.array([[0.0], [1.0]])                       # shape (S=2, A=1)
gamma = 0.9

V = np.zeros(2)
for k in range(1, 15):
    V_next = np.max(R + gamma * (P @ V), axis=1)   # Bellman optimality backup
    print(f"iter {k:2d}: V = {np.round(V_next, 3)}")
    if np.allclose(V, V_next, atol=1e-4):
        print("  converged.")
        break
    V = V_next
`,
  },
  sources: [
    {
      source: 'Sutton & Barto, 2018',
      url: 'http://incompleteideas.net/book/the-book-2nd.html',
      loc: 'Ch. 3, Eq. 3.14 & 3.17',
    },
    {
      source: 'Bellman, 1957 — Dynamic Programming',
      url: 'https://press.princeton.edu/books/paperback/9780691146683/dynamic-programming',
      loc: 'The original monograph introducing the principle of optimality',
    },
  ],
};
