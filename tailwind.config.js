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
          dark: '#050508',
          darker: '#09090e',
          card: 'rgba(17, 17, 28, 0.6)',
          glow: '#6366f1',
          border: 'rgba(99, 102, 241, 0.12)',
          neonPink: '#ec4899',
          neonCyan: '#10b981',
          neonPurple: '#8b5cf6',
          lightBg: '#f8fafc',
          lightCard: 'rgba(255, 255, 255, 0.75)',
          lightBorder: 'rgba(99, 102, 241, 0.1)',
        }
      },
      fontFamily: {
        sans: ['Outfit', 'Inter', 'system-ui', 'sans-serif'],
        mono: ['Fira Code', 'JetBrains Mono', 'monospace'],
      },
      boxShadow: {
        'neon-purple': '0 0 15px rgba(157, 78, 221, 0.25), 0 0 30px rgba(157, 78, 221, 0.1)',
        'neon-cyan': '0 0 15px rgba(0, 240, 255, 0.25), 0 0 30px rgba(0, 240, 255, 0.1)',
        'neon-pink': '0 0 15px rgba(255, 0, 127, 0.25), 0 0 30px rgba(255, 0, 127, 0.1)',
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
