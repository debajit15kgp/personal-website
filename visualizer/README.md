# RL Algorithm Atlas

An interactive lineage tree of reinforcement learning algorithms. Every node is a
canonical algorithm; every edge is a **one-line equation diff** from its parent.

Phase 1 covers the policy-gradient spine (7 nodes):

```
Bellman / MDP
      ↓
  REINFORCE                 (Williams, 1992)
      ↓  + baseline b(S_t)
  REINFORCE + baseline      (Sutton & Barto 13.4)
      ↓  replace G−b  with  bootstrapped advantage  + entropy bonus
  A2C / A3C                 (Mnih et al., 2016)
      ↓  + importance ratio, + KL trust region
  TRPO                      (Schulman et al., 2015)
      ↓  replace hard KL  with  clip(r, 1±ε)
  PPO                       (Schulman et al., 2017)
      ↓  remove critic; replace with group-relative advantage
  GRPO                      (Shao et al., 2024 — DeepSeekMath)
```

## Correctness harness

This project enforces that **every equation traces to its source paper**. Run:

```bash
npm run verify
```

The verifier:
1. Validates the schema of every algorithm node (equation, citation, loc, sources).
2. Checks every URL in every citation is publicly reachable.
3. Prints a citation summary so you can eyeball the paper → equation mapping.
4. Exits non-zero on failure (CI-gatable).

## Dev / build

```bash
npm install        # once
npm run dev        # http://localhost:5173
npm run build      # static dist/ ready for Vercel / Netlify / GitHub Pages
npm run verify     # run the correctness harness
```

## Runtime stack

- **React 18 + TypeScript + Vite** — fast dev loop, static output
- **React Flow** — the DAG tree (left pane)
- **React Three Fiber + Three.js** — per-algorithm rotating hero shape
- **KaTeX** — client-side LaTeX rendering with a monospace palette
- **Pyodide** — Python + NumPy compiled to WebAssembly, runs entirely in-browser
- **Tailwind CSS** — dark "lab notebook" theme

No backend required. No API keys. Hosts for free on any static host.

## Adding a new algorithm

1. Create `src/data/algorithms/<id>.ts` following the `Algorithm` schema.
2. Import + register it in `src/data/index.ts`.
3. Run `npm run verify` — fix any structural or URL errors.
4. Run `npm run dev` and eyeball the node.

## Where the code runs

Code snippets run client-side via Pyodide (Python 3.12 in WebAssembly). Each
snippet is **~20 lines of NumPy** that demonstrates the *core equation* rather
than a full training loop. For real training, each algorithm links out to a
Colab notebook (free GPU).

## Roadmap

**Phase 1 (current)** — Policy-gradient spine: MDP → REINFORCE → +baseline →
A2C/A3C → TRPO → PPO → GRPO (7 nodes).

**Phase 2** — Value-based spine: Q-Learning → DQN → Double/Dueling DQN →
Rainbow. Continuous control: DDPG → TD3 → SAC.

**Phase 3** — Model-based (AlphaZero/MuZero/Dreamer) + Offline RL (BCQ/CQL/IQL).
