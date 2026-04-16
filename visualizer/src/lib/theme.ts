import { useEffect, useState, useCallback } from 'react';

/**
 * Shared-theme support. Reads/writes the same localStorage["theme"] key as the
 * parent site (personal-website/theme.js), so toggling on either side syncs
 * the other on next load.
 */

export type Theme = 'light' | 'dark';

function getTheme(): Theme {
  const el = document.documentElement.getAttribute('data-theme');
  return el === 'dark' ? 'dark' : 'light';
}

export function useTheme(): { theme: Theme; toggle: () => void } {
  const [theme, setThemeState] = useState<Theme>(getTheme);

  useEffect(() => {
    // Watch for external writes to data-theme (e.g. from a parent-site toggle
    // in another tab syncing via localStorage).
    const obs = new MutationObserver(() => setThemeState(getTheme()));
    obs.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });

    const onStorage = (e: StorageEvent) => {
      if (e.key === 'theme' && (e.newValue === 'light' || e.newValue === 'dark')) {
        document.documentElement.setAttribute('data-theme', e.newValue);
      }
    };
    window.addEventListener('storage', onStorage);

    return () => {
      obs.disconnect();
      window.removeEventListener('storage', onStorage);
    };
  }, []);

  const toggle = useCallback(() => {
    const next: Theme = getTheme() === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', next);
    try { localStorage.setItem('theme', next); } catch {}
  }, []);

  return { theme, toggle };
}

/**
 * Branch accent colors — distinct hues per algorithm family. Tuned to be
 * readable on both cream (light) and near-black (dark) backgrounds.
 */
export const BRANCH_COLOR_LIGHT: Record<string, string> = {
  foundation: '#6b7280',
  value: '#c2410c',
  'policy-gradient': '#0f766e',
  'actor-critic': '#4f46e5',
  'trust-region': '#be123c',
  continuous: '#b45309',
  'model-based': '#7c3aed',
  offline: '#be185d',
};

export const BRANCH_COLOR_DARK: Record<string, string> = {
  foundation: '#9ea3b5',
  value: '#fbbf24',
  'policy-gradient': '#5eead4',
  'actor-critic': '#818cf8',
  'trust-region': '#fb7185',
  continuous: '#f59e0b',
  'model-based': '#a78bfa',
  offline: '#f472b6',
};

export function branchColor(branch: string, theme: Theme): string {
  const map = theme === 'dark' ? BRANCH_COLOR_DARK : BRANCH_COLOR_LIGHT;
  return map[branch] ?? map.foundation;
}
