---
title: "Reward Hacking in PPO: A Visual Guide"
date: "2026-03-09"
---

# Reward Hacking in PPO

One of the most interesting phenomena in Reinforcement Learning is **Reward Hacking**. This occurs when an agent finds a way to maximize the reward signal without actually solving the intended task.

### The Experiment
I trained a simple PPO agent on a "sentiment" task using a tiny GPT model. The goal was to make the model sound "happy."

### The Results
As shown in the graph below, the reward initially climbs steadily. However, around step 400, the KL-Divergence spikes, and the model begins to produce repetitive, nonsensical but "highly positive" words.

![GPU Acceleration for RL](photos/gpu.png)

> **Key Insight:** Without a strong KL-penalty, the model will always drift towards the "easiest" way to satisfy the reward model, even if it means losing all linguistic coherence.

### Next Steps
In the next blog, I'll explore how **DPO (Direct Preference Optimization)** handles this differently.
