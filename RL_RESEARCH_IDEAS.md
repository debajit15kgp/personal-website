# RL & Post-Training Research Ideas

A collection of 10 experiment-driven blog ideas focusing on Reinforcement Learning (RL) and Post-Training (DPO, PPO, RLAIF). These are designed to be scalable on a laptop or Google Colab using existing open-source repositories.

---

### 1. NanoDPO: Steering a Tiny Model
*   **Repo:** [nanoGPT](https://github.com/karpathy/nanoGPT) + [trl](https://github.com/huggingface/trl)
*   **The Experiment:** Apply Direct Preference Optimization (DPO) to a 124M parameter nanoGPT model to steer its "personality" (e.g., making it consistently use a specific persona or tone).
*   **The Insight:** How few preference pairs are actually needed to fundamentally change the output distribution of a tiny model?

### 2. The Reward Hacking Cliff
*   **Repo:** [trl](https://github.com/huggingface/trl) (PPO implementation)
*   **The Experiment:** Train a GPT-2 model to maximize a specific sentiment (e.g., "Extremely Happy"). Monitor the KL divergence and the point where the model's coherence collapses into repetitive "positive" gibberish.
*   **The Insight:** Visualizing the exact moment where the "Reward vs. KL-Divergence" trade-off breaks.

### 3. DPO vs. SFT: Style vs. Substance
*   **Repo:** [TinyLlama](https://github.com/jzhang38/TinyLlama)
*   **The Experiment:** Fine-tune TinyLlama-1.1B on a small logic puzzle dataset using Supervised Fine-Tuning (SFT) and another version using DPO.
*   **The Insight:** Does DPO improve the model's "thinking," or does it just align the *style* of the answer to what the reward model prefers?

### 4. Training a "Code Quality" Reward Model
*   **Repo:** [trl](https://github.com/huggingface/trl)
*   **The Experiment:** Use a tiny subset of GitHub/StackOverflow data to train a Bradley-Terry reward model that prefers Python code with docstrings and type hints over code without them.
*   **The Insight:** Identifying which features a 100M parameter reward model actually prioritizes when judging "quality."

### 5. PPO and the "Sparse Reward" Problem
*   **Repo:** [cleanrl](https://github.com/vwxyzjn/cleanrl) + [Minigrid](https://github.com/Farama-Foundation/Minigrid)
*   **The Experiment:** Compare PPO convergence speed in a simple maze when using a "Sparse Reward" (only +1 at the end) versus a "Shaped Reward" (small rewards for moving closer to the goal).
*   **The Insight:** The "Reward Shaping" trap—showing how an agent can learn to run in circles to collect small rewards instead of solving the task.

### 6. LoRA-RLHF Efficiency
*   **Repo:** [PEFT](https://github.com/huggingface/peft) + [trl](https://github.com/huggingface/trl)
*   **The Experiment:** Compare the performance of full-parameter DPO versus LoRA-DPO on a small model (Llama-3.2-1B).
*   **The Insight:** Is there a "steering penalty" for using low-rank adapters in RLHF, or is it purely a memory win?

### 7. RLAIF: The Student Outperforming the Teacher?
*   **Repo:** [ollama](https://github.com/ollama/ollama) (for local labeling) + [nanoGPT](https://github.com/karpathy/nanoGPT)
*   **The Experiment:** Use a "teacher" model (like Llama-3-8B via Ollama) to label preference data for a "student" model (nanoGPT). Train the student using DPO.
*   **The Insight:** Can a student model capture the "best" of the teacher and potentially surpass the teacher's *average* output?

### 8. Rejection Sampling (Best-of-N) Visualized
*   **Repo:** Any local LLM (e.g., Llama-3.2-1B via Transformers)
*   **The Experiment:** Implement "Best-of-N" sampling on math problems. Generate 5, 10, and 20 samples and use a simple heuristic (or a reward model) to pick the best.
*   **The Insight:** Quantifying exactly how much "accuracy" we can buy by simply increasing inference-time compute.

### 9. DQN: Pixels vs. State Vectors
*   **Repo:** [cleanrl](https://github.com/vwxyzjn/cleanrl)
*   **The Experiment:** Train a DQN agent on Gymnasium's `CartPole` using the raw state vector (4 numbers) vs. raw pixel input (84x84 image).
*   **The Insight:** The massive computational "tax" of visual representation—how many more iterations does it take to learn features from scratch?

### 10. Iterative DPO: The Feedback Loop
*   **Repo:** [trl](https://github.com/huggingface/trl)
*   **The Experiment:** Run DPO on a model, then use *that* model to generate new outputs. Label those outputs (self-play) and run DPO again.
*   **The Insight:** Does iterative alignment lead to better performance or "mode collapse" where the model only says one thing?
