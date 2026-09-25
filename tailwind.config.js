/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      screens: {
        'xs': '380px',
        '3xl': '1920px',
      },
      colors: {
        tech: {
          dark: '#0A0E1A',
          card: '#121829',
          cardHover: '#1A2238',
          border: '#1F2942',
          cyan: '#06B6D4',
          cyanHover: '#0891B2',
          purple: '#8B5CF6',
          purpleHover: '#7C3AED',
          accent: '#3B82F6',
          muted: '#94A3B8'
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
      },
      boxShadow: {
        'glow-cyan': '0 0 25px -5px rgba(6, 182, 212, 0.3)',
        'glow-purple': '0 0 25px -5px rgba(139, 92, 246, 0.3)',
        'glow-card': '0 10px 30px -10px rgba(0, 0, 0, 0.5), 0 0 15px -3px rgba(6, 182, 212, 0.15)',
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'float': 'float 4s ease-in-out infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-8px)' },
        }
      }
    },
  },
  plugins: [],
}
