// tailwind.config.ts
import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Colosseum-inspired palette
        'arena-bg': '#0A0A0A',
        'arena-card': '#161616',
        'arena-border': '#2A2A2A',
        'arena-text': '#FFFFFF',
        'arena-muted': '#888888',
        'arena-accent': '#8B5CF6',
        'arena-accent-hover': '#7C3AED',
        'arena-green': '#22C55E',
        'arena-red': '#EF4444',
      },
      fontFamily: {
        sans: ['Inter', 'Geist Sans', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
export default config
