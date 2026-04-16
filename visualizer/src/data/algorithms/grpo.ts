import type { Algorithm } from '../schema';

export const grpo: Algorithm = {
  id: 'grpo',
  name: 'GRPO (Group Relative Policy Optimization)',
  shortName: 'GRPO',
  year: 2024,
  parentId: 'ppo',
  level: 6,
  branch: 'trust-region',
  edgeLabel: '− critic · group mean as baseline',
  categories: {
    dataSource: 'online',
    policyMatch: 'on-policy',
    model: 'model-free',
    method: 'policy',
  },
  tagline:
    'Throw away the value network. Sample G outputs per prompt and use their standardized reward as the baseline.',
  intuition:
    'In LLM RLHF you train a separate value model that is itself the size of the policy — doubling memory and often underfitting the long-horizon return. DeepSeek\'s insight: sample G completions per prompt, compute each\'s reward, then use (r_i − mean) / std as the advantage for every token in completion i. No critic, no GAE, just group statistics. KL against a frozen reference policy keeps the LM from drifting. This is what powers DeepSeek-Math and DeepSeek-R1.',
  equation: {
    latex: String.raw`\begin{aligned}
\mathcal{J}_{\text{GRPO}}(\theta) &= \mathbb{E}\!\left[\, q \sim P(Q),\; \{o_i\}_{i=1}^{G} \sim \pi_{\theta_{\text{old}}}(O\mid q) \right] \\[4pt]
&\quad \frac{1}{G}\sum_{i=1}^{G} \frac{1}{|o_i|} \sum_{t=1}^{|o_i|}\!\Bigl\{ \min\!\bigl[ \rho_{i,t}\, \hat{A}_{i,t},\; \operatorname{clip}(\rho_{i,t},\, 1-\varepsilon,\, 1+\varepsilon)\, \hat{A}_{i,t}\bigr] \;-\; \beta\, D_{\mathrm{KL}}\!\left[\pi_{\theta}\,\|\,\pi_{\text{ref}}\right] \Bigr\} \\[6pt]
\text{where}\quad \hat{A}_{i,t} &= \frac{r_i - \operatorname{mean}(\mathbf{r})}{\operatorname{std}(\mathbf{r})}, \qquad \rho_{i,t} = \frac{\pi_{\theta}(o_{i,t}\mid q, o_{i,<t})}{\pi_{\theta_{\text{old}}}(o_{i,t}\mid q, o_{i,<t})}
\end{aligned}`,
    display: true,
    citation: {
      source: 'Shao et al., 2024 — DeepSeekMath: Pushing the Limits of Mathematical Reasoning in Open Language Models',
      url: 'https://arxiv.org/abs/2402.03300',
      loc: 'Eq. 3 (GRPO objective); Eq. 4 (group-relative advantage)',
      verifiedVia: [
        'https://ar5iv.labs.arxiv.org/html/2402.03300',
      ],
      quote:
        'J_GRPO(θ) = E[q, {o_i}] (1/G) Σ_i (1/|o_i|) Σ_t { min[ρÂ, clip(ρ, 1±ε)Â] − β D_KL[π_θ ‖ π_ref] }, with Â_{i,t} = (r_i − mean(r))/std(r)',
    },
    terms: [
      {
        symbol: 'q',
        meaning: 'A prompt / question drawn from the training distribution (e.g. a math problem).',
      },
      {
        symbol: 'G',
        meaning: 'Group size — how many completions to sample per prompt. Typically 8–64.',
      },
      {
        symbol: 'o_i,\\; |o_i|',
        meaning: 'The i-th sampled completion (token sequence), and its length in tokens.',
      },
      {
        symbol: 'r_i',
        meaning: 'Scalar reward from the reward model for completion o_i. One number per full completion.',
      },
      {
        symbol: '\\hat{A}_{i,t} = \\dfrac{r_i - \\operatorname{mean}(\\mathbf r)}{\\operatorname{std}(\\mathbf r)}',
        meaning: 'Group-relative advantage — every token in completion i gets the same advantage: how that completion\'s reward ranks within its own group. Replaces the critic.',
      },
      {
        symbol: '\\rho_{i,t}',
        meaning: 'Per-token importance ratio — same idea as PPO\'s r_t but per token: probability of this specific token under π_θ vs. π_{θ_old}.',
      },
      {
        symbol: '\\varepsilon',
        meaning: 'Clip threshold on the ratio (as in PPO).',
      },
      {
        symbol: '\\pi_{\\text{ref}}',
        meaning: 'Frozen reference policy (usually the supervised-finetuned starting point). Keeps the LM from drifting into gibberish.',
      },
      {
        symbol: '\\beta',
        meaning: 'Weight on the KL penalty to π_ref. Larger β = stick closer to the reference.',
      },
    ],
  },
  diffFromParent: {
    summary:
      'Remove the learned value baseline entirely; replace it with a group-relative (mean-zero, unit-variance) return. Also move the KL from the reward into the loss.',
    changes: [
      {
        kind: 'remove',
        term: String.raw`V_{\phi}(s_t),\; \hat{A}_t^{\text{GAE}}`,
        annotation:
          'Removed: the critic / GAE machinery. No value network, no value loss c_1 · L^VF.',
      },
      {
        kind: 'add',
        term: String.raw`\hat{A}_{i,t} = \dfrac{r_i - \operatorname{mean}(\mathbf{r})}{\operatorname{std}(\mathbf{r})}`,
        annotation:
          'Added: the group-relative advantage. Draw G samples per prompt, standardize the rewards across the group.',
      },
      {
        kind: 'add',
        term: String.raw`-\, \beta\, D_{\mathrm{KL}}\!\left[\pi_{\theta}\,\|\,\pi_{\text{ref}}\right]`,
        annotation:
          'Added: explicit KL-to-reference penalty inside the objective (instead of folding it into the reward as OpenAI RLHF does).',
      },
    ],
    rationale:
      'For language models the per-token reward signal is extremely sparse (a scalar at the end of each sequence), and the value model is big, slow, and biased. Empirically the group mean is a strong enough baseline that you can skip the critic, halving memory. The std normalization gives scale invariance so hyperparameters transfer across domains.',
  },
  code: {
    language: 'python',
    description:
      'Simulate GRPO on a toy text-like task: 4 fixed policies producing rewards, sample G outputs, compute the group-normalized advantage. Compare against a PPO-style value baseline.',
    source: `import numpy as np

np.random.seed(0)
G = 8  # group size per prompt
# Pretend we sampled G completions; their scalar rewards from a reward model:
rewards = np.array([0.12, 0.55, 0.91, 0.08, 0.33, 0.77, 0.44, 0.60])

# --- GRPO: group-relative advantage, no critic ---
mean_r = rewards.mean()
std_r  = rewards.std() + 1e-8
A_grpo = (rewards - mean_r) / std_r

# --- PPO-style value baseline (imagine the critic predicted 0.5) ---
V_pred = 0.5
A_ppo  = rewards - V_pred

print(f"{'i':>2} {'reward':>7} {'A_GRPO':>8} {'A_PPO':>8}")
for i, (r, ag, ap) in enumerate(zip(rewards, A_grpo, A_ppo)):
    print(f"{i:>2} {r:>7.3f} {ag:>8.3f} {ap:>8.3f}")

print(f"\\nGRPO sum of advantages (should be ~0): {A_grpo.sum():.4f}")
print(f"GRPO variance of advantages (should be ~1): {A_grpo.var():.4f}")
print("Takeaway: GRPO advantages are automatically centered and scaled per group —")
print("no critic network needed, and hyperparameters transfer across reward scales.")
`,
    colabUrl: 'https://colab.research.google.com/github/huggingface/trl/blob/main/examples/notebooks/grpo.ipynb',
  },
  sources: [
    {
      source: 'Shao et al., 2024 — DeepSeekMath (GRPO introduction)',
      url: 'https://arxiv.org/abs/2402.03300',
      loc: 'Section 4.1.2, Eq. 3–4',
    },
    {
      source: 'DeepSeek-AI, 2025 — DeepSeek-R1',
      url: 'https://arxiv.org/abs/2501.12948',
      loc: 'Uses GRPO as the core RL algorithm for reasoning distillation',
    },
    {
      source: 'Hugging Face TRL — GRPOTrainer docs',
      url: 'https://huggingface.co/docs/trl/main/en/grpo_trainer',
      loc: 'Reference implementation',
    },
  ],
};
