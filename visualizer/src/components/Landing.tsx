import MDPLoop from './animations/MDPLoop';
import GridWorldRollout from './animations/GridWorldRollout';
import BellmanPropagation from './animations/BellmanPropagation';
import Timeline from './animations/Timeline';

interface Props {
  onContinue: () => void;
}

export default function Landing({ onContinue }: Props) {
  return (
    <div className="max-w-4xl mx-auto px-8 py-10 space-y-16">
      {/* Hero */}
      <section>
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight leading-tight">
          A visual tour of{' '}
          <span className="text-accent-teal">Reinforcement Learning</span>
        </h1>
        <p className="mt-4 text-lg text-ink-200 leading-relaxed max-w-3xl">
          From Bellman's 1957 recursive identity to the GRPO updates that trained
          DeepSeek-R1 — every modern RL algorithm is a one-line edit to something
          that came before it. This atlas shows you the lineage.
        </p>
        <p className="mt-3 text-sm text-ink-300 font-mono">
          No prior RL background assumed. Every equation cites its source paper.
        </p>
      </section>

      {/* How we got here */}
      <section>
        <div className="mb-5">
          <div className="text-[10px] uppercase tracking-[0.25em] font-mono text-accent-teal mb-2">
            Chapter 1 · History
          </div>
          <h2 className="text-2xl font-bold">How we got here</h2>
          <p className="text-sm text-ink-200 mt-2 max-w-2xl leading-relaxed">
            RL isn't one idea — it's a ~110-year conversation between animal
            psychology, operations research, and deep learning. The milestones
            that matter:
          </p>
        </div>
        <Timeline />
      </section>

      {/* The MDP framing */}
      <section>
        <div className="mb-5">
          <div className="text-[10px] uppercase tracking-[0.25em] font-mono text-accent-teal mb-2">
            Chapter 2 · The framing
          </div>
          <h2 className="text-2xl font-bold">What exactly is an RL problem?</h2>
          <p className="text-sm text-ink-200 mt-2 max-w-2xl leading-relaxed">
            Strip away the noise and every RL problem has the same two-box
            structure: an <span className="text-accent-teal">agent</span> picks
            actions; an <span className="text-accent-amber">environment</span>{' '}
            responds with a new state and a scalar reward. That loop, repeated,
            is a <strong>Markov Decision Process</strong> — the formal object
            every algorithm on this site is trying to solve.
          </p>
        </div>

        <MDPLoop />

        <div className="mt-6 grid md:grid-cols-2 gap-4">
          <div className="rounded-lg border border-ink-600 bg-ink-800 p-5">
            <div className="text-[10px] uppercase tracking-widest font-mono text-ink-300 mb-2">
              an MDP is a 5-tuple
            </div>
            <dl className="text-xs space-y-1.5 text-ink-100">
              <div className="flex gap-3"><dt className="font-mono text-accent-teal w-6">S</dt><dd>the set of possible states</dd></div>
              <div className="flex gap-3"><dt className="font-mono text-accent-teal w-6">A</dt><dd>the set of possible actions</dd></div>
              <div className="flex gap-3"><dt className="font-mono text-accent-teal w-6">P</dt><dd>transition function P(s′ | s, a)</dd></div>
              <div className="flex gap-3"><dt className="font-mono text-accent-teal w-6">R</dt><dd>reward function R(s, a)</dd></div>
              <div className="flex gap-3"><dt className="font-mono text-accent-teal w-6">γ</dt><dd>discount factor in [0, 1)</dd></div>
            </dl>
            <p className="text-[11px] text-ink-300 mt-3 leading-relaxed pt-3 border-t border-ink-700">
              The "Markov" part: the next state depends only on the current
              state and action — not on the whole history. It's a strong
              assumption, and useful even when only approximately true.
            </p>
          </div>
          <div className="rounded-lg border border-ink-600 bg-ink-800 p-5">
            <div className="text-[10px] uppercase tracking-widest font-mono text-ink-300 mb-2">
              the four flavors you'll encounter
            </div>
            <ul className="text-xs space-y-2 text-ink-100">
              <li><strong className="text-ink-200">Finite vs. infinite horizon</strong> — does the episode have a fixed length, or is it open-ended?</li>
              <li><strong className="text-ink-200">Discrete vs. continuous</strong> — are actions a menu (up/down/left/right) or a vector (torques on a robot)?</li>
              <li><strong className="text-ink-200">Deterministic vs. stochastic</strong> — does the same (s, a) always give the same next state, or is there noise?</li>
              <li><strong className="text-ink-200">MDP vs. POMDP</strong> — do you observe the true state, or only a noisy measurement of it?</li>
            </ul>
          </div>
        </div>
      </section>

      {/* Example: grid world */}
      <section>
        <div className="mb-5">
          <div className="text-[10px] uppercase tracking-[0.25em] font-mono text-accent-teal mb-2">
            Chapter 3 · A concrete example
          </div>
          <h2 className="text-2xl font-bold">The canonical toy: grid world</h2>
          <p className="text-sm text-ink-200 mt-2 max-w-2xl leading-relaxed">
            A 4×4 grid. Start in the corner, reach the goal for +1, avoid the
            pit for −1, bump into walls for 0. States are cells, actions are
            directions. Trivial — but every RL concept (value functions,
            policies, exploration, advantage) has a clean picture here.
          </p>
        </div>

        <GridWorldRollout />

        <div className="mt-4 rounded-lg border border-accent-amber/30 bg-accent-amber/5 p-4">
          <div className="text-[10px] uppercase tracking-widest font-mono text-accent-amber mb-1.5">
            why this example is a big deal
          </div>
          <p className="text-xs text-ink-100 leading-relaxed">
            A "chess move" and "next token in GPT's output" and "torque on a
            robot joint" all fit this same picture. RL is one framework —
            the diversity comes from the size of S, A, and how R is defined.
          </p>
        </div>
      </section>

      {/* Bellman */}
      <section>
        <div className="mb-5">
          <div className="text-[10px] uppercase tracking-[0.25em] font-mono text-accent-teal mb-2">
            Chapter 4 · The one equation
          </div>
          <h2 className="text-2xl font-bold">
            Bellman's recursion: the spine of the whole field
          </h2>
          <p className="text-sm text-ink-200 mt-2 max-w-2xl leading-relaxed">
            Given an MDP, how good is a state? The total future reward you'd
            get from it. Bellman's insight: that value satisfies a recursive
            identity — the value of <em>now</em> is the reward you get, plus
            the discounted value of <em>next</em>. If you can solve this
            fixed-point, you've solved the MDP.
          </p>
          <p className="text-sm text-ink-200 mt-2 leading-relaxed max-w-2xl">
            Watch value propagate outward from the goal cell — this is exactly
            what "<span className="font-mono text-accent-teal">value
            iteration</span>" does, and it is the ancestor of every algorithm
            in the atlas:
          </p>
        </div>

        <BellmanPropagation />

        <div className="mt-4 text-xs text-ink-300 font-mono leading-relaxed">
          SARSA and Q-Learning sample this update from experience instead of
          computing it exactly. REINFORCE and PPO attack it from the policy
          side. DQN approximates V with a neural net. Everything is a variation
          on the idea you just watched.
        </div>
      </section>

      {/* Bridge */}
      <section className="rounded-lg border-2 border-accent-teal/40 bg-accent-teal/5 p-6 text-center">
        <div className="text-[10px] uppercase tracking-[0.25em] font-mono text-accent-teal mb-3">
          Chapter 5 · Where each algorithm sits
        </div>
        <h2 className="text-2xl font-bold mb-3">
          Ready for the 4 questions that split the field?
        </h2>
        <p className="text-sm text-ink-200 max-w-xl mx-auto leading-relaxed">
          Online vs. offline. On-policy vs. off-policy. Model-based vs.
          model-free. Value vs. policy vs. actor-critic. Each algorithm on
          this site is a specific answer to those four questions.
        </p>
        <button
          onClick={onContinue}
          className="mt-5 px-6 py-3 rounded-lg bg-accent-teal text-ink-900 font-semibold hover:bg-accent-teal/90 text-sm"
        >
          Continue to the 4 bifurcations →
        </button>
      </section>

      <footer className="pt-8 border-t border-ink-700 text-[11px] text-ink-300 font-mono flex justify-between">
        <span>RL Algorithm Atlas · Phase 1</span>
        <span>every equation cites its source paper</span>
      </footer>
    </div>
  );
}
