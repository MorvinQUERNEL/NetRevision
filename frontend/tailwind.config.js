/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        bg: {
          primary: '#080b1a',
          secondary: '#0f1328',
          tertiary: '#161b35',
          elevated: '#1a2040',
        },
        accent: {
          DEFAULT: '#00e5a0',
          hover: '#00ffb3',
          secondary: '#3b82f6',
          warm: '#f59e0b',
        },
        border: {
          DEFAULT: '#1e293b',
          active: '#2d3a52',
        },
      },
      fontFamily: {
        heading: ['Space Grotesk', 'system-ui', 'sans-serif'],
        body: ['Work Sans', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'monospace'],
      },
    },
  },
  plugins: [],
}
