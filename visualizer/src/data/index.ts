import type { Algorithm } from './schema';
import { mdp } from './algorithms/mdp';
import { sarsa } from './algorithms/sarsa';
import { qLearning } from './algorithms/q-learning';
import { reinforce } from './algorithms/reinforce';
import { reinforceBaseline } from './algorithms/reinforce-baseline';
import { a3c } from './algorithms/a3c';
import { trpo } from './algorithms/trpo';
import { ppo } from './algorithms/ppo';
import { grpo } from './algorithms/grpo';

export const ALGORITHMS: Algorithm[] = [
  mdp,
  sarsa,
  qLearning,
  reinforce,
  reinforceBaseline,
  a3c,
  trpo,
  ppo,
  grpo,
];

export const ALGO_BY_ID: Record<string, Algorithm> = Object.fromEntries(
  ALGORITHMS.map((a) => [a.id, a])
);

export function getParent(id: string): Algorithm | null {
  const a = ALGO_BY_ID[id];
  if (!a || !a.parentId) return null;
  return ALGO_BY_ID[a.parentId] ?? null;
}

export function getChildren(id: string): Algorithm[] {
  return ALGORITHMS.filter((a) => a.parentId === id);
}

export type { Algorithm, Citation, Branch, EquationDiff, Categories } from './schema';
