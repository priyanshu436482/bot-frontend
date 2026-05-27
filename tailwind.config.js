/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class', // Enables theme switching via dark class
  theme: {
    extend: {
      colors: {
        cyber: {
          dark: '#030303',
          darker: '#09090b',
          card: 'rgba(20, 20, 20, 0.65)',
          glow: '#94a3b8',
          border: 'rgba(255, 255, 255, 0.08)',
          neonPink: '#71717a',
          neonCyan: '#f4f4f5',
          neonPurple: '#3f3f46',
          lightBg: '#f4f4f5',
          lightCard: 'rgba(255, 255, 255, 0.8)',
          lightBorder: 'rgba(0, 0, 0, 0.06)',
        }
      },
      fontFamily: {
        sans: ['Outfit', 'Inter', 'system-ui', 'sans-serif'],
        mono: ['Fira Code', 'JetBrains Mono', 'monospace'],
      },
      boxShadow: {
        'neon-purple': '0 0 15px rgba(161, 161, 170, 0.18), 0 0 30px rgba(161, 161, 170, 0.08)',
        'neon-cyan': '0 0 15px rgba(255, 255, 255, 0.2), 0 0 30px rgba(255, 255, 255, 0.1)',
        'neon-pink': '0 0 15px rgba(113, 113, 122, 0.15), 0 0 30px rgba(113, 113, 122, 0.08)',
      },
      animation: {
        'pulse-glow': 'pulseGlow 3s ease-in-out infinite',
        'float-slow': 'float 8s ease-in-out infinite',
        'shimmer': 'shimmer 2.5s infinite linear',
        'fade-in-up': 'fadeInUp 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards',
      },
      keyframes: {
        pulseGlow: {
          '0%, 100%': { opacity: 0.2, filter: 'blur(40px)' },
          '50%': { opacity: 0.45, filter: 'blur(60px)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px) scale(1)' },
          '50%': { transform: 'translateY(-15px) scale(1.05)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        fadeInUp: {
          '0%': { opacity: 0, transform: 'translateY(12px)' },
          '100%': { opacity: 1, transform: 'translateY(0)' },
        }
      }
    },
  },
  plugins: [],
}
