/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  darkMode: ['class', '[data-theme="dark"]'],
  theme: {
    extend: {
      // All colors are backed by CSS variables defined in src/index.css so the
      // whole visualizer re-skins when the parent site toggles data-theme.
      colors: {
        // "ink" is the neutral ramp. Keep class names stable so existing
        // components don't need touching — only the underlying values change.
        ink: {
          900: 'rgb(var(--ink-900) / <alpha-value>)',
          800: 'rgb(var(--ink-800) / <alpha-value>)',
          700: 'rgb(var(--ink-700) / <alpha-value>)',
          600: 'rgb(var(--ink-600) / <alpha-value>)',
          500: 'rgb(var(--ink-500) / <alpha-value>)',
          400: 'rgb(var(--ink-400) / <alpha-value>)',
          300: 'rgb(var(--ink-300) / <alpha-value>)',
          200: 'rgb(var(--ink-200) / <alpha-value>)',
          100: 'rgb(var(--ink-100) / <alpha-value>)',
        },
        // "accent-teal" (primary) becomes amber in light mode to match the
        // parent site's #d97706 accent. Class names preserved.
        accent: {
          teal: 'rgb(var(--accent-teal) / <alpha-value>)',
          amber: 'rgb(var(--accent-amber) / <alpha-value>)',
          rose: 'rgb(var(--accent-rose) / <alpha-value>)',
          indigo: 'rgb(var(--accent-indigo) / <alpha-value>)',
        },
        diff: {
          add: 'rgb(var(--diff-add) / <alpha-value>)',
          remove: 'rgb(var(--diff-remove) / <alpha-value>)',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'ui-monospace', 'monospace'],
      },
      boxShadow: {
        card: '0 1px 3px rgb(var(--shadow) / 0.7), 0 1px 2px rgb(var(--shadow) / 0.5)',
      },
    },
  },
  plugins: [],
};
