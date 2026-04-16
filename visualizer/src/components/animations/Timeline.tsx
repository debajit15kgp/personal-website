/**
 * A vertical timeline of the key moments that produced modern RL. Each entry
 * cites a source so the history isn't just vibes.
 */

interface Entry {
  year: string;
  title: string;
  blurb: string;
  source: string;
  url: string;
}

const ENTRIES: Entry[] = [
  {
    year: '1911',
    title: "Thorndike's Law of Effect",
    blurb:
      'Behaviors followed by satisfaction are repeated; those followed by discomfort are dropped. The intellectual seed of reward-based learning.',
    source: 'Thorndike, Animal Intelligence (1911)',
    url: 'https://en.wikipedia.org/wiki/Law_of_effect',
  },
  {
    year: '1957',
    title: 'Bellman formalizes Dynamic Programming',
    blurb:
      'Introduces the principle of optimality and the recursive equation V(s) = max_a [R + γV(s′)] — the backbone every RL algorithm tries to solve.',
    source: 'Bellman, Dynamic Programming (1957)',
    url: 'https://press.princeton.edu/books/paperback/9780691146683/dynamic-programming',
  },
  {
    year: '1983',
    title: 'Actor-Critic reborn for neural nets',
    blurb:
      'Barto, Sutton, and Anderson show an agent with separate "actor" and "critic" nets solving the cart-pole balance problem. Template for everything from A3C to PPO.',
    source: 'Barto, Sutton & Anderson, 1983',
    url: 'https://ieeexplore.ieee.org/document/6313077',
  },
  {
    year: '1989–92',
    title: 'Q-Learning',
    blurb:
      'Watkins proves you can learn the optimal action-value function Q* from off-policy samples. Enables learning while exploring.',
    source: 'Watkins & Dayan, Q-learning (1992)',
    url: 'https://link.springer.com/article/10.1007/BF00992698',
  },
  {
    year: '1995',
    title: 'TD-Gammon reaches world-class backgammon',
    blurb:
      'Tesauro trains a neural net via temporal-difference learning through self-play — the first convincing proof that function approximation + RL scales.',
    source: 'Tesauro, Communications of the ACM (1995)',
    url: 'https://dl.acm.org/doi/10.1145/203330.203343',
  },
  {
    year: '2013 / 2015',
    title: 'Deep Q-Network (DQN)',
    blurb:
      'DeepMind combines Q-Learning with a CNN, experience replay, and a target network. One architecture plays 49 Atari games at human level — deep RL is born.',
    source: 'Mnih et al., Nature (2015)',
    url: 'https://www.nature.com/articles/nature14236',
  },
  {
    year: '2016',
    title: 'AlphaGo beats Lee Sedol',
    blurb:
      'Policy + value networks + Monte-Carlo tree search defeat a 9-dan Go player. RL crosses from research demo to "did not think we would see this in our lifetime".',
    source: 'Silver et al., Nature (2016)',
    url: 'https://www.nature.com/articles/nature16961',
  },
  {
    year: '2017',
    title: 'PPO',
    blurb:
      'Schulman simplifies TRPO to a first-order clipped objective. PPO becomes the default actor-critic algorithm; still underpins most modern RLHF stacks.',
    source: 'Schulman et al., 2017',
    url: 'https://arxiv.org/abs/1707.06347',
  },
  {
    year: '2022',
    title: 'InstructGPT / ChatGPT: RLHF at scale',
    blurb:
      'OpenAI uses PPO with a human-preference reward model to finetune GPT-3 into a helpful assistant. RL becomes the alignment layer of every frontier LLM.',
    source: 'Ouyang et al., 2022',
    url: 'https://arxiv.org/abs/2203.02155',
  },
  {
    year: '2024',
    title: 'GRPO / DeepSeek-Math',
    blurb:
      'Drops the value network entirely; uses a group-relative baseline. Halves memory for LLM RL, powers DeepSeek-R1\'s reasoning breakthrough in 2025.',
    source: 'Shao et al., 2024',
    url: 'https://arxiv.org/abs/2402.03300',
  },
];

export default function Timeline() {
  return (
    <div className="relative">
      {/* vertical line */}
      <div className="absolute left-[72px] top-2 bottom-2 w-px bg-ink-600" />
      <ol className="space-y-6">
        {ENTRIES.map((e, i) => (
          <li key={i} className="relative grid grid-cols-[72px_1fr] gap-6">
            <div className="text-right pt-1">
              <div className="text-xs font-mono text-accent-teal">{e.year}</div>
            </div>
            <div className="relative pl-5">
              {/* dot */}
              <div className="absolute -left-[7px] top-2 w-3 h-3 rounded-full bg-accent-teal border-2 border-ink-900" />
              <div className="font-semibold text-ink-100 text-sm">{e.title}</div>
              <p className="text-xs text-ink-200 leading-relaxed mt-1">{e.blurb}</p>
              <a
                href={e.url}
                target="_blank"
                rel="noreferrer"
                className="inline-block mt-1.5 text-[10px] text-ink-300 hover:text-accent-teal font-mono"
              >
                ↗ {e.source}
              </a>
            </div>
          </li>
        ))}
      </ol>
    </div>
  );
}
