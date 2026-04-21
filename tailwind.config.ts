import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        gold: '#c7a04b',
      },
      fontFamily: {
        sans:  ['var(--font-montserrat)', 'sans-serif'],
        serif: ['var(--font-playfair)', 'Georgia', 'serif'],
      },
      fontSize: {
        display: ['clamp(2.4rem, 6.5vw, 6.2rem)', { lineHeight: '1.05', letterSpacing: '0.06em' }],
      },
    },
  },
  plugins: [],
}

export default config
