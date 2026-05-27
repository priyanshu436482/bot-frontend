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
          dark: '#03000a',
          darker: '#07020d',
          card: 'rgba(13, 5, 24, 0.45)',
          glow: '#9d4edd',
          border: 'rgba(157, 78, 221, 0.15)',
          neonPink: '#ff007f',
          neonCyan: '#00f0ff',
          neonPurple: '#a020f0',
          lightBg: '#f6f8fd',
          lightCard: 'rgba(255, 255, 255, 0.65)',
          lightBorder: 'rgba(99, 102, 241, 0.15)',
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
