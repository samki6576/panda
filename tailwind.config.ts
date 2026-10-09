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
        'arena-bg': '#0A0A0A',      // Main background
        'arena-card': '#161616',    // Card background
        'arena-border': '#2A2A2A',  // Subtle borders
        'arena-text': '#FFFFFF',    // Primary text
        'arena-muted': '#888888',   // Secondary text
        'arena-accent': '#8B5CF6',  // Purple accent (buttons, links)
        'arena-accent-hover': '#7C3AED',
        'arena-green': '#22C55E',   // For "YES" or success states
        'arena-red': '#EF4444',     // For "NO" or error states
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'], // Clean, modern font
      },
    },
  },
  plugins: [],
}
export default config