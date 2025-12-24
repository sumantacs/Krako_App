/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      animation: {
        'spin-slow': 'spin 3s linear infinite',
        'tentacle-wave': 'tentacle-wave 0.8s ease-in-out infinite',
        'tentacle-wave-2': 'tentacle-wave-2 0.8s ease-in-out infinite',
        'tentacle-wave-3': 'tentacle-wave-3 0.8s ease-in-out infinite',
      },
      keyframes: {
        'tentacle-wave': {
          '0%, 100%': { transform: 'rotate(0deg) scaleY(1)' },
          '25%': { transform: 'rotate(-20deg) scaleY(1.05)' },
          '50%': { transform: 'rotate(25deg) scaleY(0.95)' },
          '75%': { transform: 'rotate(-15deg) scaleY(1.02)' },
        },
        'tentacle-wave-2': {
          '0%, 100%': { transform: 'rotate(0deg) scaleY(1) scaleX(1)' },
          '25%': { transform: 'rotate(-25deg) scaleY(1.08) scaleX(0.95)' },
          '50%': { transform: 'rotate(30deg) scaleY(0.92) scaleX(1.05)' },
          '75%': { transform: 'rotate(-20deg) scaleY(1.05) scaleX(0.98)' },
        },
        'tentacle-wave-3': {
          '0%, 100%': { transform: 'rotate(0deg) scaleY(1) scaleX(1)' },
          '25%': { transform: 'rotate(-30deg) scaleY(1.12) scaleX(0.9)' },
          '50%': { transform: 'rotate(35deg) scaleY(0.88) scaleX(1.1)' },
          '75%': { transform: 'rotate(-25deg) scaleY(1.08) scaleX(0.95)' },
        },
      },
    },
  },
  plugins: [],
};
